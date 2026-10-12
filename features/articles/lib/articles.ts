import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Article, ArticleSummary } from '../types';

const articlesRoot = path.join(process.cwd(), 'content', 'articles');

function readRequiredString(value: unknown, field: string, filePath: string) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Article ${filePath} requires a non-empty "${field}" field.`);
    }

    return value;
}

function getWordCount(content: string) {
    return content.trim().split(/\s+/u).filter(Boolean).length;
}

function getReadingMinutes(content: string) {
    return Math.max(1, Math.ceil(getWordCount(content) / 210));
}

function readOptionalString(value: unknown) {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function readOptionalList(value: unknown) {
    return Array.isArray(value) && value.every(item => typeof item === 'string') && value.length > 0 ? (value as string[]) : undefined;
}

function getLocaleDirectory(locale: string) {
    return path.join(articlesRoot, locale);
}

function getArticleFilePath(locale: string, slug: string) {
    return path.join(getLocaleDirectory(locale), `${slug}.md`);
}

export function getArticleSlugs(locale: string) {
    const localeDirectory = getLocaleDirectory(locale);
    if (!existsSync(localeDirectory)) return [];

    return readdirSync(localeDirectory, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
        .map(entry => entry.name.slice(0, -3))
        .sort();
}

export function getArticle(locale: string, slug: string): Article | null {
    if (!getArticleSlugs(locale).includes(slug)) return null;

    const filePath = getArticleFilePath(locale, slug);
    const source = readFileSync(filePath, 'utf8');
    const { data, content } = matter(source);
    const articleLocale = readRequiredString(data.locale, 'locale', filePath);
    const normalizedContent = content.trim();
    const readingMinutes = getReadingMinutes(normalizedContent);

    if (articleLocale !== locale) {
        throw new Error(`Article ${filePath} declares locale "${articleLocale}" instead of "${locale}".`);
    }

    return {
        slug,
        href: `/${locale}/articulos/${slug}`,
        title: readRequiredString(data.title, 'title', filePath),
        description: readRequiredString(data.description, 'description', filePath),
        date: readRequiredString(data.date, 'date', filePath),
        author: readRequiredString(data.author, 'author', filePath),
        locale: articleLocale,
        category: readRequiredString(data.category, 'category', filePath),
        readingMinutes,
        updated: readOptionalString(data.updated),
        keywords: readOptionalList(data.keywords),
        content: normalizedContent,
        wordCount: getWordCount(normalizedContent),
    };
}

export function getArticleSummaries(locale: string): ArticleSummary[] {
    return getArticleSlugs(locale)
        .map(slug => getArticle(locale, slug))
        .filter((article): article is Article => article !== null)
        .map(article => ({
            slug: article.slug,
            href: article.href,
            title: article.title,
            description: article.description,
            date: article.date,
            author: article.author,
            locale: article.locale,
            category: article.category,
            readingMinutes: article.readingMinutes,
            updated: article.updated,
            keywords: article.keywords,
        }))
        .sort((first, second) => second.date.localeCompare(first.date));
}
