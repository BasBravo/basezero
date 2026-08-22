import { describe, expect, it } from 'vitest';
import {
    MIN_TICK_COUNT,
    TICK_MAX_OPACITY,
    TICK_MAX_WIDTH_PX,
    TICK_MIN_OPACITY,
    TICK_MIN_WIDTH_PX,
    tickAppearance,
    tickCountForHeight,
} from './scrollbar-lens';

describe('scrollbar-lens', () => {
    it('concentra el foco en el centro a mitad de recorrido', () => {
        const count = 13;
        const center = tickAppearance(6, 0.5, count);
        const edge = tickAppearance(0, 0.5, count);

        expect(center.width).toBeCloseTo(TICK_MAX_WIDTH_PX, 5);
        expect(center.opacity).toBeCloseTo(TICK_MAX_OPACITY, 5);
        expect(edge.width).toBeLessThan(center.width);
        expect(edge.width).toBeGreaterThanOrEqual(TICK_MIN_WIDTH_PX);
        expect(edge.opacity).toBeGreaterThanOrEqual(TICK_MIN_OPACITY);
    });

    it('pinta en sólido las marcas ya recorridas', () => {
        const count = 13;
        const past = tickAppearance(2, 0.5, count);
        const current = tickAppearance(6, 0.5, count);
        const upcoming = tickAppearance(10, 0.5, count);

        expect(past.opacity).toBeCloseTo(TICK_MAX_OPACITY, 5);
        expect(current.opacity).toBeCloseTo(TICK_MAX_OPACITY, 5);
        expect(upcoming.opacity).toBeCloseTo(TICK_MIN_OPACITY, 5);
        expect(upcoming.opacity).toBeLessThan(past.opacity);
    });

    it('mueve el foco al inicio y al final según el progreso', () => {
        const count = 13;
        const start = tickAppearance(0, 0, count);
        const end = tickAppearance(count - 1, 1, count);
        const oppositeStart = tickAppearance(count - 1, 0, count);

        expect(start.width).toBeGreaterThan(oppositeStart.width);
        expect(end.width).toBeCloseTo(TICK_MAX_WIDTH_PX, 5);
        expect(end.opacity).toBeCloseTo(TICK_MAX_OPACITY, 5);
        expect(start.opacity).toBeCloseTo(TICK_MAX_OPACITY, 5);
        expect(oppositeStart.opacity).toBeCloseTo(TICK_MIN_OPACITY, 5);
    });

    it('calcula suficientes marcas para rellenar la pista', () => {
        expect(tickCountForHeight(0)).toBe(MIN_TICK_COUNT);
        expect(tickCountForHeight(400)).toBeGreaterThan(MIN_TICK_COUNT);
    });
});
