import { clamp01 } from '@/features/portfolio/lib/scrollbar-lens';

function scrollingElement() {
    return document.scrollingElement ?? document.documentElement;
}

export function getDocumentScrollProgress() {
    const element = scrollingElement();
    const max = Math.max(element.scrollHeight - window.innerHeight, 0);
    if (max <= 0) return 0;
    return clamp01(element.scrollTop / max);
}

export function setDocumentScrollProgress(progress: number) {
    const element = scrollingElement();
    const max = Math.max(element.scrollHeight - window.innerHeight, 0);
    const top = max * clamp01(progress);
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    element.scrollTop = top;
    html.style.scrollBehavior = previousBehavior;
}

export function hideNativeScrollbar() {
    document.documentElement.dataset.customScrollbar = 'true';
}

export function restoreNativeScrollbar() {
    delete document.documentElement.dataset.customScrollbar;
}
