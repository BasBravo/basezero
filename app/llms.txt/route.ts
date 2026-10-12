import { llmsTxt } from '@/features/seo/lib/agents';

export const dynamic = 'force-static';

export function GET() {
    return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
