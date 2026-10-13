import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPortfolioProjects } from '@/content/portfolio-projects';
import { caseStudyMarkdown } from '@/features/seo/lib/agents';
import { caseStudyGraph } from '@/features/seo/lib/structured-data';
import { getCaseStudy, getCaseStudySlugs, getCaseStudySummaries } from './case-studies';
import { getCaseStudyMarkdownPath, getCaseStudyPath } from './paths';

const IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

describe('case studies', () => {
    it('has one case study per portfolio project, in both languages', () => {
        for (const locale of ['es', 'en']) {
            expect(getCaseStudySlugs(locale)).toEqual(getPortfolioProjects(locale).map(project => project.id).sort());
        }
    });

    it('builds localised paths', () => {
        expect(getCaseStudyPath('es', 'mappic')).toBe('/es/proyectos/mappic');
        expect(getCaseStudyPath('en', 'mappic')).toBe('/en/projects/mappic');
        expect(getCaseStudyMarkdownPath('en', 'mappic')).toBe('/en/projects/md/mappic.md');
    });

    it('keeps the portfolio order', () => {
        expect(getCaseStudySummaries('es').map(study => study.slug)).toEqual(getPortfolioProjects('es').map(project => project.id));
    });

    it('only uses screenshots that exist, each with alt text and a caption', () => {
        for (const locale of ['es', 'en']) {
            for (const slug of getCaseStudySlugs(locale)) {
                const study = getCaseStudy(locale, slug)!;
                expect(existsSync(path.join(process.cwd(), 'public', study.cover))).toBe(true);
                const images = [...study.content.matchAll(IMAGE)];
                expect(images.length).toBeGreaterThanOrEqual(3);
                for (const [, alt, src, caption] of images) {
                    expect(alt.length).toBeGreaterThan(10);
                    expect(caption?.length ?? 0).toBeGreaterThan(10);
                    expect(existsSync(path.join(process.cwd(), 'public', src!))).toBe(true);
                }
            }
        }
    });

    it('knows the real size of every screenshot, read from the WebP header', () => {
        const study = getCaseStudy('es', 'signado')!;
        expect(study.images['/projects/signado/case/mobile.webp']).toEqual({ width: 780, height: 1688 });
        expect(study.images['/projects/signado/case/hero.webp']).toEqual({ width: 1600, height: 1000 });
        expect(Object.keys(study.images)).toHaveLength([...study.content.matchAll(IMAGE)].length);
    });

    it('describes each case study and its product for search engines and agents', () => {
        const study = getCaseStudy('es', 'signado')!;
        const graph = caseStudyGraph(study)['@graph'] as Record<string, unknown>[];
        expect(graph.map(node => node['@type'])).toEqual(['Article', 'WebApplication', 'BreadcrumbList']);
        const markdown = caseStudyMarkdown(study);
        expect(markdown).toContain('- Proyecto: [Signado](https://signado.es/)');
        expect(markdown).not.toMatch(/\]\(\/(es|en|projects)\//);
    });
});
