'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './portfolio.module.css';

type FadeInTitleProps = {
    children: ReactNode;
    className: string;
};

export function FadeInTitle({ children, className }: FadeInTitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            title.dataset.visible = 'true';
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                title.dataset.visible = 'true';
                observer.disconnect();
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.18 },
        );
        observer.observe(title);

        return () => observer.disconnect();
    }, []);

    return (
        <h2 ref={titleRef} className={`${className} ${styles.fadeInTitle}`}>
            {children}
        </h2>
    );
}
