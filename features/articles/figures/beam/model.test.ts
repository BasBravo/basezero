import { describe, expect, it } from 'vitest';
import { HALF, LIMIT_MM, limitZ, loadOf, mostPlates, passes, PLATES, REST_Z, sagOf, undersideAt } from './model';

describe('plank under load', () => {
    it('gives no sag without load and grows in a straight line with it', () => {
        expect(sagOf(0)).toBe(0);
        expect(sagOf(100) / sagOf(50)).toBeCloseTo(2, 8);
    });

    it('sags about 4.5 mm under 100 kg, from the beam formula', () => {
        expect(sagOf(100)).toBeCloseTo(4.54, 1);
    });

    it('passes up to five plates and fails from the sixth', () => {
        expect(mostPlates()).toBe(5);
        expect(passes(5)).toBe(true);
        expect(passes(6)).toBe(false);
        expect(sagOf(loadOf(5))).toBeLessThan(LIMIT_MM);
        expect(sagOf(loadOf(6))).toBeGreaterThan(LIMIT_MM);
        expect(PLATES).toBeGreaterThan(6);
    });

    it('keeps the plank on its supports and sags only in the middle', () => {
        expect(undersideAt(-HALF, 30)).toBe(REST_Z);
        expect(undersideAt(HALF, 30)).toBe(REST_Z);
        expect(undersideAt(0, 30)).toBe(REST_Z - 30);
        expect(limitZ).toBeLessThan(REST_Z);
    });
});
