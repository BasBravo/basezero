import { describe, expect, it } from 'vitest';
import { durationOf, fits, HOLE, poseOf, SHAPES, TARGET, TRAY_Y, trayX } from './model';

describe('shape sorter', () => {
    it('lets exactly one of the four pieces through the hole', () => {
        expect(SHAPES.map((_, piece) => fits(piece))).toEqual([false, false, false, true]);
        expect(SHAPES[TARGET]).toBe('hexagon');
    });

    it('starts and ends a wrong piece in the tray, after it reached the hole', () => {
        for (const piece of [0, 1, 2]) {
            expect(poseOf(piece, 0)).toMatchObject({ x: trayX(piece), y: TRAY_Y, inside: false });
            const at = poseOf(piece, 0.9);
            expect(Math.abs(at.x - HOLE.x)).toBeLessThan(8);
            expect(at.y).toBeCloseTo(HOLE.y, 5);
            expect(poseOf(piece, durationOf(piece) + 1)).toMatchObject({ x: trayX(piece), y: TRAY_Y, scale: 1, inside: false });
        }
    });

    it('sinks the right piece into the hole and keeps it there', () => {
        const end = poseOf(TARGET, durationOf(TARGET) + 5);
        expect(end).toMatchObject({ x: HOLE.x, y: HOLE.y, inside: true });
        expect(end.scale).toBeLessThan(0.85);
        expect(poseOf(TARGET, 0.2).inside).toBe(false);
    });

    it('moves continuously', () => {
        for (const piece of [0, 3]) {
            let last = poseOf(piece, 0);
            for (let t = 0.01; t < durationOf(piece); t += 0.01) {
                const now = poseOf(piece, t);
                expect(Math.hypot(now.x - last.x, now.y - last.y)).toBeLessThan(14);
                last = now;
            }
        }
    });
});
