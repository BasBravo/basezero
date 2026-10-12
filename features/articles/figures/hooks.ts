'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
    return useSyncExternalStore(
        onChange => {
            const query = window.matchMedia(QUERY);
            query.addEventListener('change', onChange);
            return () => query.removeEventListener('change', onChange);
        },
        () => window.matchMedia(QUERY).matches,
        () => false,
    );
}

export function useInView(ref: RefObject<Element | null>) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(entries => setInView(Boolean(entries.at(-1)?.isIntersecting)), { rootMargin: '80px 0px' });
        observer.observe(node);
        return () => observer.disconnect();
    }, [ref]);
    return inView;
}
