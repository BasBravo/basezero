'use client';

import { useCallback, useState } from 'react';

export const ZOOM_MIN = 0.75;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.25;

const clamp = (value: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value / ZOOM_STEP) * ZOOM_STEP));

/** Zoom of the drawing alone, within a range that never loses the scene or shrinks it to nothing. */
export function useZoom() {
    const [zoom, setZoom] = useState(1);
    const closer = useCallback(() => setZoom(value => clamp(value + ZOOM_STEP)), []);
    const further = useCallback(() => setZoom(value => clamp(value - ZOOM_STEP)), []);
    const reset = useCallback(() => setZoom(1), []);
    return { zoom, closer, further, reset, atMax: zoom >= ZOOM_MAX, atMin: zoom <= ZOOM_MIN };
}
