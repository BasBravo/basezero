import Script from 'next/script';
import { publicEnvironment } from '@/lib/env';

// Basic GA4 analytics. Page views on client-side navigation are covered by GA's enhanced measurement (history changes).
// Only rendered in production builds so local development does not pollute the data.
export function GoogleAnalytics() {
    const id = publicEnvironment.gtagId;
    if (!id || process.env.NODE_ENV !== 'production') return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
            </Script>
        </>
    );
}
