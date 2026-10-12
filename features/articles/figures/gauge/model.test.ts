import { describe, expect, it } from 'vitest';
import { angleOf, CHANGE_BELOW, clampTeams, decisionOf, springStep, START, STOP_BELOW, SWEEP, TEAMS } from './model';

describe('decision gauge', () => {
    it('stops below two teams, changes below half and keeps going from half', () => {
        expect(decisionOf(0)).toBe('stop');
        expect(decisionOf(STOP_BELOW - 1)).toBe('stop');
        expect(decisionOf(STOP_BELOW)).toBe('change');
        expect(decisionOf(CHANGE_BELOW - 1)).toBe('change');
        expect(decisionOf(CHANGE_BELOW)).toBe('keep');
        expect(decisionOf(TEAMS)).toBe('keep');
        expect(CHANGE_BELOW).toBe(TEAMS / 2);
    });

    it('maps teams onto the dial and keeps the needle on the scale', () => {
        expect(angleOf(0)).toBe(START);
        expect(angleOf(TEAMS)).toBeCloseTo(START + SWEEP, 10);
        expect(angleOf(TEAMS / 2)).toBeCloseTo(START + SWEEP / 2, 10);
        expect(angleOf(-3)).toBe(START);
        expect(angleOf(99)).toBeCloseTo(START + SWEEP, 10);
    });

    it('only accepts whole teams within the range', () => {
        expect(clampTeams(-1)).toBe(0);
        expect(clampTeams(3.4)).toBe(3);
        expect(clampTeams(12)).toBe(TEAMS);
    });

    it('settles the needle on its goal without running away', () => {
        let state = { value: 0, speed: 0 };
        let peak = 0;
        for (let step = 0; step < 240; step++) {
            state = springStep(state, 5, 1 / 60);
            peak = Math.max(peak, state.value);
        }
        expect(state.value).toBeCloseTo(5, 2);
        expect(peak).toBeLessThan(5.5);
    });
});
