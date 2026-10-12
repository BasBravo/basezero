import { describe, expect, it } from 'vitest';
import { ALL, brokenAt, delivers, reachOf } from './model';

describe('four-step route', () => {
    it('delivers only with every step in place', () => {
        expect(delivers(ALL)).toBe(true);
        expect(brokenAt(ALL)).toBe(-1);
    });

    it('stops at the first missing step, whatever comes after', () => {
        expect(reachOf([true, false, true, true])).toBe(1);
        expect(brokenAt([true, false, true, true])).toBe(1);
        expect(delivers([true, true, true, false])).toBe(false);
        expect(reachOf([false, true, true, true])).toBe(0);
    });
});
