'use client';

import { useRef } from 'react';
import { useServerInsertedHTML } from 'next/navigation';

const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem('basezero-theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark'}})()`;

export function ThemeBootstrap() {
    const inserted = useRef(false);

    useServerInsertedHTML(() => {
        if (inserted.current) return null;
        inserted.current = true;

        return (
            <script
                dangerouslySetInnerHTML={{
                    __html: THEME_BOOTSTRAP_SCRIPT,
                }}
            />
        );
    });

    return null;
}
