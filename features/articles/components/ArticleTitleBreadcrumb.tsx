'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './article.module.css';

type ArticleTitleBreadcrumbProps = {
    title: string;
    sectionLabel: string;
    sectionHref: string;
    targetId: string;
};

export function ArticleTitleBreadcrumb({
    title,
    sectionLabel,
    sectionHref,
    targetId,
}: ArticleTitleBreadcrumbProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target = document.getElementById(targetId);
        if (!target) return;

        let frame = 0;

        function syncVisibility() {
            frame = 0;
            setVisible(target!.getBoundingClientRect().bottom <= 0);
        }

        function scheduleSync() {
            if (frame === 0) frame = window.requestAnimationFrame(syncVisibility);
        }

        syncVisibility();
        window.addEventListener('scroll', scheduleSync, { passive: true });
        window.addEventListener('resize', scheduleSync, { passive: true });

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleSync);
            window.removeEventListener('resize', scheduleSync);
        };
    }, [targetId]);

    return (
        <nav
            className={styles.articleBreadcrumb}
            data-visible={visible ? 'true' : undefined}
            aria-label={`${sectionLabel}: ${title}`}
            aria-hidden={!visible}
            {...(!visible ? { inert: true } : {})}
        >
            <Link href={sectionHref}>{sectionLabel}</Link>
            <span aria-hidden="true">/</span>
            <span className={styles.breadcrumbTitle} aria-current="page">{title}</span>
        </nav>
    );
}
