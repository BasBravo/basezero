import { getCaseStudy, getCaseStudySlugs } from '@/features/case-studies/lib/case-studies';
import { caseStudyMarkdown } from '@/features/seo/lib/agents';

const locale = 'en';

export const dynamic = 'force-static';
export const dynamicParams = false;

/** Each case study as plain Markdown, for AI agents and text readers. */
export function generateStaticParams() {
    return getCaseStudySlugs(locale).map(slug => ({ locale, file: `${slug}.md` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
    const { file } = await params;
    const study = getCaseStudy(locale, file.replace(/\.md$/, ''));
    if (!study) return new Response('Not found', { status: 404 });
    return new Response(caseStudyMarkdown(study), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
