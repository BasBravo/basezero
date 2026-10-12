import { describe, expect, it } from 'vitest';
import { BUCKET, CAP, EMPTY, pour, reached, run, step, TARGET } from './model';

const bucketsEvery = (seconds: number, count: number, leaking: boolean, from = EMPTY) => {
    let tank = from;
    for (let index = 0; index < count; index++) tank = run(pour(tank), seconds, leaking);
    return tank;
};

describe('tank with a leak', () => {
    it('fills by a bucket when nothing leaks', () => {
        const tank = run(pour(EMPTY), 2, false);
        expect(tank.level).toBeCloseTo(BUCKET, 5);
        expect(tank.buckets).toBe(1);
    });

    it('never goes over the top or under empty', () => {
        expect(bucketsEvery(1, 20, false).level).toBe(CAP);
        expect(step(EMPTY, 1, true).level).toBe(0);
    });

    it('keeps getting buckets and stays under the target while it leaks', () => {
        const tank = bucketsEvery(1.2, 8, true);
        expect(tank.buckets).toBe(8);
        expect(tank.level).toBeLessThan(TARGET - 10);
        expect(reached(tank)).toBe(false);
    });

    it('reaches the target with a few more buckets once the leak is closed', () => {
        const stuck = bucketsEvery(1.2, 8, true);
        const fixed = bucketsEvery(1.2, 3, false, stuck);
        expect(reached(fixed)).toBe(true);
    });
});
