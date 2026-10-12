import { describe, expect, it } from 'vitest';
import { heavierOf, MAX_OPINIONS, MAX_TILT, tiltOf, tilted, USE, OPINION } from './model';

describe('balance of signals', () => {
    it('stays level when empty or when both sides weigh the same', () => {
        expect(tiltOf({ opinions: 0, uses: 0 })).toBe(0);
        expect(tiltOf({ opinions: 4, uses: 1 })).toBeCloseTo(0, 10);
        expect(heavierOf({ opinions: 4, uses: 1 })).toBe('even');
    });

    it('lets two uses outweigh every opinion there is room for', () => {
        expect(2 * USE).toBeGreaterThan(MAX_OPINIONS * OPINION);
        expect(heavierOf({ opinions: MAX_OPINIONS, uses: 2 })).toBe('right');
        expect(tiltOf({ opinions: MAX_OPINIONS, uses: 2 })).toBeGreaterThan(0);
    });

    it('tips towards the heavier side and stops at the end stops', () => {
        expect(tiltOf({ opinions: 3, uses: 0 })).toBeLessThan(0);
        expect(heavierOf({ opinions: 3, uses: 0 })).toBe('left');
        expect(tiltOf({ opinions: 0, uses: 4 })).toBe(MAX_TILT);
        expect(tiltOf({ opinions: 6, uses: 0 })).toBeGreaterThanOrEqual(-MAX_TILT);
        expect(Math.abs(tiltOf({ opinions: 1, uses: 0 }))).toBeLessThan(Math.abs(tiltOf({ opinions: 2, uses: 0 })));
    });

    it('lowers the right end of the beam when it tilts positive', () => {
        const [x, , z] = tilted([100, 0, 0], 10);
        expect(z).toBeLessThan(0);
        expect(x).toBeLessThan(100);
        expect(Math.hypot(x, z)).toBeCloseTo(100, 10);
        expect(tilted([-100, 0, 0], 10)[2]).toBeGreaterThan(0);
    });
});
