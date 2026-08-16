import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: 'Basezero — AI-first product development',
    description:
        'Independent product development. From problem to MVP, and from MVP to a platform ready to evolve.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang={routing.defaultLocale} data-theme="dark" suppressHydrationWarning>
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
