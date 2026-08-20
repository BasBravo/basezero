import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev'),
    title: 'Basezero — Independent digital product studio',
    description: 'Independent digital product studio led by Bas Bravo.',
    manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang={routing.defaultLocale}
            data-theme="dark"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('basezero-theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark'}})()`,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
