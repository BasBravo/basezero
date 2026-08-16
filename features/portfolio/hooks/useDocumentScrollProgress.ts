import { useCallback, useEffect, useRef } from 'react';
import { clamp01 } from '@/features/portfolio/lib/scrollbar-lens';
import {
    getDocumentScrollProgress,
    hideNativeScrollbar,
    restoreNativeScrollbar,
    setDocumentScrollProgress,
} from '@/features/portfolio/services/document-scroll';

export function useDocumentScrollProgress() {
    const progressRef = useRef(0);

    const readProgress = useCallback(() => {
        const progress = getDocumentScrollProgress();
        progressRef.current = progress;
        return progress;
    }, []);

    const writeProgress = useCallback((progress: number) => {
        const next = clamp01(progress);
        setDocumentScrollProgress(next);
        progressRef.current = next;
        return next;
    }, []);

    useEffect(() => {
        hideNativeScrollbar();
        progressRef.current = getDocumentScrollProgress();
        return () => restoreNativeScrollbar();
    }, []);

    return { progressRef, readProgress, writeProgress };
}
