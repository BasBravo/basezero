'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useDocumentScrollProgress } from '@/features/portfolio/hooks/useDocumentScrollProgress';
import {
    MIN_TICK_COUNT,
    clamp01,
    tickAppearance,
    tickCountForHeight,
} from '@/features/portfolio/lib/scrollbar-lens';
import styles from './portfolio.module.css';

type PortfolioScrollbarProps = {
    label: string;
};

const KEYBOARD_STEP = 0.035;
const KEYBOARD_PAGE = 0.12;

export function PortfolioScrollbar({ label }: PortfolioScrollbarProps) {
    const ticksRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const activePointerIdRef = useRef<number | null>(null);
    const activeTouchIdRef = useRef<number | null>(null);
    const [tickCount, setTickCount] = useState(MIN_TICK_COUNT);
    const { readProgress, writeProgress } = useDocumentScrollProgress();

    const paint = useCallback((progress: number) => {
        const ticks = ticksRef.current;
        const control = controlRef.current;
        if (!ticks || !control) return;

        const next = clamp01(progress);
        const nodes = ticks.children;
        const count = nodes.length;
        for (let index = 0; index < count; index += 1) {
            const tick = nodes[index];
            if (!(tick instanceof HTMLElement)) continue;
            const appearance = tickAppearance(index, next, count);
            tick.style.width = `${appearance.width}px`;
            tick.style.opacity = appearance.opacity.toFixed(3);
        }

        control.setAttribute('aria-valuenow', String(Math.round(next * 100)));
    }, []);

    const progressFromClientY = useCallback((clientY: number) => {
        const ticks = ticksRef.current;
        if (!ticks) return 0;
        const rect = ticks.getBoundingClientRect();
        return clamp01((clientY - rect.top) / Math.max(rect.height, 1));
    }, []);

    const seekToClientY = useCallback((clientY: number) => {
        const progress = progressFromClientY(clientY);
        writeProgress(progress);
        paint(progress);
    }, [paint, progressFromClientY, writeProgress]);

    useEffect(() => {
        const ticks = ticksRef.current;
        if (!ticks) return;

        function syncTickCount() {
            if (!ticks) return;
            const nextCount = tickCountForHeight(ticks.clientHeight);
            setTickCount((current) => (current === nextCount ? current : nextCount));
        }

        syncTickCount();
        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', syncTickCount);
            return () => window.removeEventListener('resize', syncTickCount);
        }

        const observer = new ResizeObserver(syncTickCount);
        observer.observe(ticks);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        function handleScroll() {
            if (draggingRef.current) return;
            paint(readProgress());
        }

        paint(readProgress());
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [paint, readProgress, tickCount]);

    const stopDragging = useCallback(() => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        activePointerIdRef.current = null;
        activeTouchIdRef.current = null;
        controlRef.current?.removeAttribute('data-dragging');
    }, []);

    useEffect(() => {
        const control = controlRef.current;
        if (!control) return;
        const activeControl = control;

        function handlePointerMove(event: PointerEvent) {
            if (
                !draggingRef.current ||
                activeTouchIdRef.current !== null ||
                event.pointerId !== activePointerIdRef.current
            ) return;
            event.preventDefault();
            seekToClientY(event.clientY);
        }

        function handlePointerEnd(event: PointerEvent) {
            if (!draggingRef.current || event.pointerId !== activePointerIdRef.current) return;
            stopDragging();
        }

        function findTouch(touches: TouchList, identifier: number) {
            for (let index = 0; index < touches.length; index += 1) {
                const touch = touches[index];
                if (touch?.identifier === identifier) return touch;
            }
            return null;
        }

        function handleTouchStart(event: TouchEvent) {
            if (activeTouchIdRef.current !== null) return;
            const touch = event.changedTouches[0];
            if (!touch) return;

            activePointerIdRef.current = null;
            activeTouchIdRef.current = touch.identifier;
            draggingRef.current = true;
            activeControl.setAttribute('data-dragging', 'true');
            seekToClientY(touch.clientY);
            event.preventDefault();
        }

        function handleTouchMove(event: TouchEvent) {
            const touchId = activeTouchIdRef.current;
            if (!draggingRef.current || touchId === null) return;
            const touch = findTouch(event.touches, touchId) ?? findTouch(event.changedTouches, touchId);
            if (!touch) return;

            event.preventDefault();
            seekToClientY(touch.clientY);
        }

        function handleTouchEnd(event: TouchEvent) {
            const touchId = activeTouchIdRef.current;
            if (touchId === null || !findTouch(event.changedTouches, touchId)) return;
            stopDragging();
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerEnd);
        window.addEventListener('pointercancel', handlePointerEnd);
        activeControl.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerEnd);
            window.removeEventListener('pointercancel', handlePointerEnd);
            activeControl.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [seekToClientY, stopDragging]);

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'touch' && 'ontouchstart' in window) return;
        if (event.button !== 0) return;

        draggingRef.current = true;
        activePointerIdRef.current = event.pointerId;
        controlRef.current?.setAttribute('data-dragging', 'true');
        try {
            controlRef.current?.setPointerCapture?.(event.pointerId);
        } catch {
            // Global pointer listeners keep the drag working if capture is unavailable.
        }
        seekToClientY(event.clientY);
        event.preventDefault();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const current = readProgress();
        let next = current;

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
            next = current + (event.key === 'PageDown' ? KEYBOARD_PAGE : KEYBOARD_STEP);
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
            next = current - (event.key === 'PageUp' ? KEYBOARD_PAGE : KEYBOARD_STEP);
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = 1;
        } else {
            return;
        }

        event.preventDefault();
        writeProgress(next);
        paint(next);
    }

    return (
        <div className={styles.scrollbar}>
            <div
                ref={controlRef}
                className={styles.scrollbarControl}
                role="slider"
                aria-label={label}
                aria-orientation="vertical"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onLostPointerCapture={stopDragging}
                onKeyDown={handleKeyDown}
            >
                <div ref={ticksRef} className={styles.scrollbarTicks} aria-hidden="true">
                    {Array.from({ length: tickCount }, (_, index) => (
                        <span key={index} className={styles.scrollbarTick} />
                    ))}
                </div>
            </div>
        </div>
    );
}
