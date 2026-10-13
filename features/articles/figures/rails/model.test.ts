import { describe, expect, it } from 'vitest';
import { arrives, BRANCHES, carAt, DESTINATION, distanceOf, durationOf, goTime, poseOf, routeOf, START, STOP_X } from './model';

describe('train on the line', () => {
    it('only reaches the flag by the branch that leads to it', () => {
        expect(arrives(DESTINATION)).toBe(true);
        expect(BRANCHES.filter(arrives)).toEqual([DESTINATION]);
    });

    it('starts at the buffer, ends at the station of its branch and comes back', () => {
        for (const branch of BRANCHES) {
            const end = routeOf(branch).at(-1)!;
            expect(poseOf(branch, 0)).toMatchObject({ x: START[0], y: START[1] });
            expect(poseOf(branch, goTime(branch))).toMatchObject({ x: end[0], y: end[1], arrived: true });
            expect(poseOf(branch, durationOf(branch))).toMatchObject({ x: START[0], y: START[1] });
            expect(end[0]).toBe(STOP_X);
        }
    });

    it('moves without jumps', () => {
        for (const branch of BRANCHES) {
            let before = poseOf(branch, 0);
            for (let t = 0.02; t <= durationOf(branch); t += 0.02) {
                const now = poseOf(branch, t);
                expect(Math.hypot(now.x - before.x, now.y - before.y)).toBeLessThan(5);
                before = now;
            }
        }
    });

    it('goes through the junction before taking a branch', () => {
        const pose = poseOf(1, goTime(1) / 2);
        expect(pose.x).toBeGreaterThan(-150);
    });

    it('keeps the wagon on the track behind the engine, clear of the buffer, and the engine where poseOf says', () => {
        for (const branch of BRANCHES) {
            for (let t = 0; t <= durationOf(branch); t += 0.05) {
                const engine = carAt(branch, distanceOf(branch, t));
                const pose = poseOf(branch, t);
                expect(engine.x).toBeCloseTo(pose.x, 6);
                expect(engine.y).toBeCloseTo(pose.y, 6);
                const wagon = carAt(branch, distanceOf(branch, t), 26);
                expect(wagon.x - 10.5).toBeGreaterThan(-166);
            }
        }
    });
});
