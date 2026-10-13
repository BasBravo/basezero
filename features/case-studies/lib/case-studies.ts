import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { CaseStudy, CaseStudySummary } from '../types';
import { imageSizesOf } from './image-size';
import { asCaseStudyLocale, getCaseStudyPath } from './paths';

const root = path.join(process.cwd(), 'content', 'case-studies');

function required(value: unknown, field: string, file: string) {
    if (typeof value !== 'string' || value.trim() === '') throw new Error(`Case study ${file} requires a non-empty "${field}" field.`);
    return value;
}

function list(value: unknown, field: string, file: string) {
    if (!Array.isArray(value) || value.length === 0 || !value.every(item => typeof item === 'string')) throw new Error(`Case study ${file} requires a "${field}" list.`);
    return value as string[];
}

export function getCaseStudySlugs(locale: string) {
    const directory = path.join(root, asCaseStudyLocale(locale));
    if (!existsSync(directory)) return [];
    return readdirSync(directory)
        .filter(name => name.endsWith('.md'))
        .map(name => name.slice(0, -3))
        .sort();
}

export function getCaseStudy(locale: string, slug: string): CaseStudy | null {
    if (!getCaseStudySlugs(locale).includes(slug)) return null;
    const current = asCaseStudyLocale(locale);
    const file = path.join(root, current, `${slug}.md`);
    const { data, content } = matter(readFileSync(file, 'utf8'));
    const body = content.trim();
    return {
        slug,
        href: getCaseStudyPath(current, slug),
        locale: current,
        title: required(data.title, 'title', file),
        description: required(data.description, 'description', file),
        name: required(data.name, 'name', file),
        url: required(data.url, 'url', file),
        year: required(data.year, 'year', file),
        role: required(data.role, 'role', file),
        facets: list(data.facets, 'facets', file),
        stack: list(data.stack, 'stack', file),
        status: required(data.status, 'status', file),
        cover: required(data.cover, 'cover', file),
        order: typeof data.order === 'number' ? data.order : 99,
        date: required(data.date, 'date', file),
        keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : undefined,
        content: body,
        wordCount: body.split(/\s+/u).filter(Boolean).length,
        images: imageSizesOf(body),
    };
}

/** Every case study in a language, in the order the portfolio shows them. */
export function getCaseStudySummaries(locale: string): CaseStudySummary[] {
    return getCaseStudySlugs(locale)
        .map(slug => getCaseStudy(locale, slug))
        .filter((study): study is CaseStudy => study !== null)
        .map(({ content, wordCount, images, ...summary }) => {
            void content;
            void wordCount;
            void images;
            return summary;
        })
        .sort((first, second) => first.order - second.order);
}
