import { getPortfolioProjects } from '@/content/portfolio-projects';
import { getAboutPath } from '@/features/about/lib/paths';
import { getArticle, getArticleSummaries } from '@/features/articles/lib/articles';
import type { Article } from '@/features/articles/types';
import { FEED_PATH } from './metadata';
import { absolute, aboutUrl, articleMarkdownPath, authorName, contactEmail, services, siteName, socialProfiles } from './site';

const llmsSummaryLine = 'Decisiones, métodos y aprendizajes sobre cómo convertir una idea en un producto digital útil: primeras versiones, MVPs, trabajo por resultados y desarrollo con IA.';

const FIGURE = /!\[([^\]]*)\]\(figure:[a-z-]+\)/g;
const RELATIVE_LINK = /\]\((\/[^)\s]*)\)/g;

/** An article as plain Markdown: a short header with its facts, interactive figures described in words and links made absolute. */
export function articleMarkdown(article: Article) {
    const figure = article.locale === 'es' ? 'Figura interactiva' : 'Interactive figure';
    const labels = article.locale === 'es' ? { author: 'Autor', date: 'Publicado', category: 'Categoría', source: 'Original' } : { author: 'Author', date: 'Published', category: 'Category', source: 'Original' };
    const body = article.content.replace(FIGURE, (_, alt: string) => `*${figure}: ${alt}*`).replace(RELATIVE_LINK, (_, path: string) => `](${absolute(path)})`);
    return [
        `# ${article.title}`,
        '',
        `> ${article.description}`,
        '',
        `- ${labels.author}: [${article.author}](${aboutUrl(article.locale)})`,
        `- ${labels.date}: ${article.date}`,
        `- ${labels.category}: ${article.category}`,
        `- ${labels.source}: ${absolute(article.href)}`,
        '',
        body,
        '',
    ].join('\n');
}

const articleLine = (locale: string) => (article: { slug: string; title: string; description: string }) =>
    `- [${article.title}](${absolute(articleMarkdownPath(locale, article.slug))}): ${article.description}`;

/** /llms.txt: who this is, what the studio does, and where the useful content lives (llmstxt.org). */
export function llmsTxt() {
    const articles = getArticleSummaries('es');
    const projects = getPortfolioProjects('es');
    return [
        `# ${siteName}`,
        '',
        `> ${siteName} es el estudio independiente de ${authorName}, diseñador y desarrollador de producto en España con más de veinte años en la web. Define, diseña y desarrolla MVPs, plataformas SaaS y herramientas web con un método AI-first, de la idea al lanzamiento. Trabaja directamente con fundadores y equipos, en español y en inglés.`,
        '',
        `${siteName} is the independent studio of ${authorName}, a product designer and developer based in Spain. It defines, designs and builds MVPs, SaaS platforms and web tools with an AI-first method, from idea to launch, working directly with founders and teams in Spanish and English.`,
        '',
        `Para encargar un proyecto o pedir presupuesto, escribir a ${contactEmail} contando el objetivo, en qué punto está el proyecto y si hay una fecha. Responde personalmente.`,
        '',
        '## Servicios',
        '',
        ...services.es.map(service => `- ${service.name}: ${service.description}`),
        '',
        '## Páginas',
        '',
        `- [Basezero (español)](${absolute('/es')}): el estudio, su proceso, proyectos y artículos.`,
        `- [Basezero (English)](${absolute('/en')}): the studio, its process and projects.`,
        `- [Sobre Bas Bravo](${absolute(getAboutPath('es'))}): trayectoria, cómo trabaja y herramientas.`,
        `- [About Bas Bravo](${absolute(getAboutPath('en'))}): background, how he works and tools.`,
        '',
        '## Artículos',
        '',
        ...articles.map(articleLine('es')),
        '',
        '## Proyectos',
        '',
        ...projects.map(project => `- [${project.name}](${project.url}): ${project.description}`),
        '',
        '## Optional',
        '',
        `- [Todos los artículos en un solo archivo](${absolute('/llms-full.txt')})`,
        `- [Feed RSS de artículos](${absolute(FEED_PATH)})`,
        ...socialProfiles.map(profile => `- [${profile.label}](${profile.href})`),
        '',
    ].join('\n');
}

/** /llms-full.txt: every article in full, newest first, for agents that want everything in one request. */
export function llmsFullTxt() {
    const articles = getArticleSummaries('es')
        .map(summary => getArticle('es', summary.slug))
        .filter((article): article is Article => article !== null);
    return [`# ${siteName} — artículos de ${authorName}`, '', `> ${llmsSummaryLine}`, '', ...articles.map(article => `${articleMarkdown(article)}\n---\n`)].join('\n');
}

const escapeXml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** /feed.xml: RSS 2.0 of the Spanish articles. */
export function rssFeed() {
    const articles = getArticleSummaries('es');
    const items = articles.map(article =>
        [
            '    <item>',
            `      <title>${escapeXml(article.title)}</title>`,
            `      <link>${absolute(article.href)}</link>`,
            `      <guid isPermaLink="true">${absolute(article.href)}</guid>`,
            `      <description>${escapeXml(article.description)}</description>`,
            `      <category>${escapeXml(article.category)}</category>`,
            `      <dc:creator>${escapeXml(article.author)}</dc:creator>`,
            `      <pubDate>${new Date(`${article.date}T08:00:00Z`).toUTCString()}</pubDate>`,
            '    </item>',
        ].join('\n'),
    );
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
        '  <channel>',
        `    <title>${siteName} — Artículos</title>`,
        `    <link>${absolute('/es')}</link>`,
        `    <description>${escapeXml(llmsSummaryLine)}</description>`,
        '    <language>es-ES</language>',
        `    <atom:link href="${absolute(FEED_PATH)}" rel="self" type="application/rss+xml" />`,
        ...(articles[0] ? [`    <lastBuildDate>${new Date(`${articles[0].date}T08:00:00Z`).toUTCString()}</lastBuildDate>`] : []),
        ...items,
        '  </channel>',
        '</rss>',
        '',
    ].join('\n');
}
