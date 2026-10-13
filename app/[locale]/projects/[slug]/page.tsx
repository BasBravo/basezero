import type { Metadata } from 'next';
import { CaseStudyRoute, caseStudyMetadata } from '@/features/case-studies/components/CaseStudyRoute';
import { getCaseStudySlugs } from '@/features/case-studies/lib/case-studies';

const locale = 'en';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return getCaseStudySlugs(locale).map(slug => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return caseStudyMetadata(locale, slug);
}

export default async function CaseStudyRoutePage({ params }: Props) {
    const { slug } = await params;
    return <CaseStudyRoute locale={locale} slug={slug} />;
}
