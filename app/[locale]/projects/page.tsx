import { notFound } from 'next/navigation';
import { ProjectsIndexRoute } from '@/features/portfolio/components/ProjectsIndexRoute';
import { projectsIndexMetadata } from '@/features/portfolio/components/projects-index-route';

type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: 'en' }]; }
export async function generateMetadata({ params }: Props) { return projectsIndexMetadata((await params).locale); }
export default async function Page({ params }: Props) {
    const { locale } = await params;
    if (locale !== 'en') notFound();
    return <ProjectsIndexRoute locale={locale} />;
}
