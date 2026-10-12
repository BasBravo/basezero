import { describe, expect, it } from 'vitest';
import { advance, GAP, GAP_TILE, LENGTH, pointAt, SPEED, stoppedAt, STOP } from './model';

const run = (from: number, seconds: number, cut: boolean) => {
    let distance = from;
    for (let t = 0; t < seconds; t += 1 / 30) distance = advance(distance, 1 / 30, cut);
    return distance;
};

describe('train on the circuit', () => {
    it('is a closed loop', () => {
        expect(pointAt(0)).toEqual(pointAt(LENGTH));
        expect(pointAt(160)).toEqual([80, -36]);
    });

    it('puts the gap on the front side, where the missing tile is', () => {
        for (const distance of GAP) expect(Math.abs(pointAt(distance)[1])).toBe(36);
        expect(pointAt(GAP[0])[0]).toBeCloseTo(GAP_TILE.x1, 6);
        expect(pointAt(GAP[1])[0]).toBeCloseTo(GAP_TILE.x0, 6);
    });

    it('goes round and round while the circuit is whole', () => {
        const laps = run(0, (LENGTH * 2.5) / SPEED, false);
        expect(Math.abs(laps - LENGTH / 2)).toBeLessThan(5);
    });

    it('stops before the gap when a tile is missing, and goes on once it is back', () => {
        const stuck = run(0, (LENGTH * 1.2) / SPEED, true);
        expect(stuck).toBeCloseTo(STOP, 6);
        expect(stoppedAt(stuck, true)).toBe(true);
        expect(run(stuck, 8, false)).toBeGreaterThan(GAP[1]);
    });
});
