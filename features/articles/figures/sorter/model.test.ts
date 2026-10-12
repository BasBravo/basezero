import { describe, expect, it } from 'vitest';
import { durationOf, fits, HOLE, PIECE_H, poseOf, REST_Z, SHAPES, TARGET, TOP, TRAY_Y, trayX } from './model';

describe('shape sorter', () => {
    it('lets exactly one of the four pieces through the hole', () => {
        expect(SHAPES.map((_, piece) => fits(piece))).toEqual([false, false, false, true]);
        expect(SHAPES[TARGET]).toBe('hexagon');
    });

    it('takes a wrong piece to the hole, rests it on the block and sends it back to its pad', () => {
        for (const piece of [0, 1, 2]) {
            expect(poseOf(piece, 0)).toMatchObject({ x: trayX(piece), y: TRAY_Y, z: REST_Z, sunk: false });
            const landed = poseOf(piece, 0.7 + 0.3 + 0.01);
            expect(landed.z).toBeCloseTo(TOP + 0.5, 1);
            expect(Math.abs(landed.x - HOLE.x)).toBeLessThan(4);
            const home = poseOf(piece, durationOf(piece) + 1);
            expect(home.x).toBeCloseTo(trayX(piece), 6);
            expect(home.y).toBeCloseTo(TRAY_Y, 6);
            expect(home.z).toBeCloseTo(REST_Z, 6);
        }
    });

    it('never lets a wrong piece go below the top of the block', () => {
        for (const piece of [0, 1, 2]) for (let t = 0; t < durationOf(piece); t += 0.01) {
                const pose = poseOf(piece, t);
                if (pose.y < 40) expect(pose.z).toBeGreaterThanOrEqual(TOP);
            }
    });

    it('sinks the right piece until its top is flush with the block, and keeps it there', () => {
        const end = poseOf(TARGET, durationOf(TARGET) + 5);
        expect(end).toMatchObject({ x: HOLE.x, y: HOLE.y, sunk: true });
        expect(end.z + PIECE_H).toBeCloseTo(TOP, 5);
    });

    it('moves continuously', () => {
        for (const piece of [0, 3]) {
            let last = poseOf(piece, 0);
            for (let t = 0.01; t < durationOf(piece); t += 0.01) {
                const now = poseOf(piece, t);
                expect(Math.hypot(now.x - last.x, now.y - last.y, now.z - last.z)).toBeLessThan(8);
                last = now;
            }
        }
    });
});
