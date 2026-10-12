import { getArticle, getArticleSlugs } from '@/features/articles/lib/articles';
import { articleMarkdown } from '@/features/seo/lib/agents';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';
export const dynamicParams = false;

/** Each article as plain Markdown at /<locale>/articulos/md/<slug>.md, for AI agents and text readers. */
export function generateStaticParams() {
    return routing.locales.flatMap(locale => getArticleSlugs(locale).map(slug => ({ locale, file: `${slug}.md` })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; file: string }> }) {
    const { locale, file } = await params;
    const article = getArticle(locale, file.replace(/\.md$/, ''));
    if (!article) return new Response('Not found', { status: 404 });
    return new Response(articleMarkdown(article), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
