'use client';

import { useRef } from 'react';
import { useServerInsertedHTML } from 'next/navigation';

export function HtmlLang({ locale }: { locale: string }) {
    const inserted = useRef(false);

    useServerInsertedHTML(() => {
        if (inserted.current) return null;
        inserted.current = true;

        return (
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
                }}
            />
        );
    });

    return null;
}
