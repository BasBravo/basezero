import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { getArticle, getArticleSlugs } from '@/features/articles/lib/articles';
import { authorName } from '@/features/seo/lib/site';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';
export const dynamicParams = false;

const SIZE = { width: 1200, height: 630 };

/** One social image per page that is shared: the home in each language and every article, at /og/<locale>/<name>.png. */
export function generateStaticParams() {
    return routing.locales.flatMap(locale => [{ locale, file: 'home.png' }, ...getArticleSlugs(locale).map(slug => ({ locale, file: `${slug}.png` }))]);
}

const fonts = async () => {
    const dir = path.join(process.cwd(), 'features', 'seo', 'fonts');
    const [bold, regular] = await Promise.all([readFile(path.join(dir, 'BricolageGrotesque-Bold.ttf')), readFile(path.join(dir, 'BricolageGrotesque-Regular.ttf'))]);
    return [
        { name: 'Bricolage', data: bold, weight: 700 as const, style: 'normal' as const },
        { name: 'Bricolage', data: regular, weight: 400 as const, style: 'normal' as const },
    ];
};

const logo = async () => {
    const svg = await readFile(path.join(process.cwd(), 'public', 'logotipo.svg'), 'utf8');
    return `data:image/svg+xml;base64,${Buffer.from(svg.replace('fill="black"', 'fill="#f2f2ef"')).toString('base64')}`;
};

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; file: string }> }) {
    const { locale, file } = await params;
    const name = file.replace(/\.png$/, '');
    let kicker: string;
    let title: string;
    let footer: string;

    if (name === 'home') {
        const t = await getTranslations({ locale, namespace: 'Portfolio' });
        kicker = locale === 'es' ? 'Estudio independiente de producto digital' : 'Independent digital product studio';
        title = t('intro.title').replace(/\s*\n\s*/g, ' ');
        footer = locale === 'es' ? 'MVPs · SaaS · Herramientas web · AI-first' : 'MVPs · SaaS · Web tools · AI-first';
    } else {
        const article = getArticle(locale, name);
        if (!article) return new Response('Not found', { status: 404 });
        kicker = `${article.category} · ${locale === 'es' ? 'Artículo' : 'Article'}`;
        title = article.title;
        footer = `${authorName} · ${locale === 'es' ? `${article.readingMinutes} min de lectura` : `${article.readingMinutes} min read`}`;
    }

    const [logoSrc, fontList] = await Promise.all([logo(), fonts()]);
    return new ImageResponse(
        (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '72px 80px', background: '#0d0d0c', color: '#f2f2ef', fontFamily: 'Bricolage' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- rendered by ImageResponse, not the page */}
                    <img src={logoSrc} width={230} height={41} alt="Basezero" />
                    <div style={{ fontSize: 24, color: '#9a9a94', letterSpacing: 2, textTransform: 'uppercase' }}>{kicker}</div>
                </div>
                <div style={{ display: 'flex', fontSize: title.length > 40 ? 76 : 92, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #33332f', paddingTop: 28, fontSize: 26, color: '#b8b8b2' }}>
                    <div style={{ display: 'flex' }}>{footer}</div>
                    <div style={{ display: 'flex', color: '#f2f2ef' }}>basezero.dev</div>
                </div>
            </div>
        ),
        { ...SIZE, fonts: fontList },
    );
}
