'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { TURN, TURN_STEP } from './orbit';

const DEGREES_PER_PIXEL = 0.3;

const quantise = (value: number) => Math.round(value / TURN_STEP) * TURN_STEP;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export interface Centre {
    azimuth: number;
    elevation: number;
    elevationRange: [number, number];
}

/** Drag to turn the camera up to ±50° either side of its centre, around both axes; it eases and can be brought back. */
export function useOrbit(centre: Centre, calm: boolean) {
    const [view, setView] = useState({ azimuth: centre.azimuth, elevation: centre.elevation });
    const [dragging, setDragging] = useState(false);
    const target = useRef({ azimuth: centre.azimuth, elevation: centre.elevation });
    const shown = useRef({ azimuth: centre.azimuth, elevation: centre.elevation });
    const origin = useRef<{ x: number; y: number; azimuth: number; elevation: number } | null>(null);
    const frame = useRef(0);
    const last = useRef(0);

    const run = useCallback(() => {
        if (frame.current) return;
        last.current = 0;
        const tick = (time: number) => {
            const dt = last.current ? Math.min((time - last.current) / 1000, 1 / 20) : 1 / 60;
            last.current = time;
            const follow = calm ? 1 : 1 - Math.exp(-dt / 0.08);
            for (const axis of ['azimuth', 'elevation'] as const) {
                shown.current[axis] += (target.current[axis] - shown.current[axis]) * follow;
                if (Math.abs(target.current[axis] - shown.current[axis]) < 0.02) shown.current[axis] = target.current[axis];
            }
            setView({ azimuth: quantise(shown.current.azimuth), elevation: quantise(shown.current.elevation) });
            const settled = shown.current.azimuth === target.current.azimuth && shown.current.elevation === target.current.elevation;
            frame.current = settled ? 0 : requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    }, [calm]);

    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    const handlers = {
        onPointerDown: (event: PointerEvent<HTMLElement>) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            origin.current = { x: event.clientX, y: event.clientY, ...target.current };
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
        },
        onPointerMove: (event: PointerEvent<HTMLElement>) => {
            const start = origin.current;
            if (!start) return;
            target.current = {
                azimuth: clamp(start.azimuth + (event.clientX - start.x) * DEGREES_PER_PIXEL, centre.azimuth - TURN, centre.azimuth + TURN),
                elevation: clamp(start.elevation + (event.clientY - start.y) * DEGREES_PER_PIXEL, centre.elevationRange[0], centre.elevationRange[1]),
            };
            run();
        },
        onPointerUp: (event: PointerEvent<HTMLElement>) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            origin.current = null;
            setDragging(false);
        },
        onPointerCancel: () => {
            origin.current = null;
            setDragging(false);
        },
    };

    const reset = useCallback(() => {
        target.current = { azimuth: centre.azimuth, elevation: centre.elevation };
        run();
    }, [centre.azimuth, centre.elevation, run]);

    const turned = Math.abs(view.azimuth - centre.azimuth) > 0.01 || Math.abs(view.elevation - centre.elevation) > 0.01;
    return { azimuth: view.azimuth, elevation: view.elevation, dragging, handlers, reset, turned };
}
