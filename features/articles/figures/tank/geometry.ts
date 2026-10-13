import { circleRing, extrude, insetPlan, pathOf, planOutline, slabOf, towardViewer, type Flat, type Plan, type Point3, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { atOf } from '../orbit';
import { CAP, TARGET } from './model';
import { BASE } from './view';

const box = (x0: number, x1: number, y0: number, y1: number, r = 0): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

export const TANK = box(-70, 30, -40, 40);
export const TANK_H = 96;
export const FLOOR = 3;
export const waterZ = (level: number) => FLOOR + (Math.max(0, level) / CAP) * (TANK_H - FLOOR);

export const PIPE = box(-100, -92, -30, -22, 1);
export const ARM = box(-92, -16, -30, -22, 1);
export const ARM_Z = [104, 120] as const;
export const SPOUT = { x: -20, y: -26 };
export const STUB = box(30, 42, -5, 5, 0.8);
export const STUB_Z = [9, 19] as const;
export const LEAK_AT = { x: 38, y: 0 };

export function artOf(P: Projection) {
    const at = atOf(P);
    const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number, steps = 24) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true });
    const line = (...points: Point3[]) => pathOf(points.map((point): Flat => at(point)));

    const BASE_ART = baseArtOf(P, BASE);

    const corners: [number, number][] = [
        [TANK.x, TANK.y],
        [TANK.x + TANK.w, TANK.y],
        [TANK.x, TANK.y + TANK.d],
        [TANK.x + TANK.w, TANK.y + TANK.d],
    ];
    // The glass is clear, but the water is not: whatever lies behind the water (the far corner, the far half of the mark)
    // is drawn before it, and the rest after it.
    const [vx, vy] = towardViewer(P);
    const depth = ([x, y]: [number, number]) => x * vx + y * vy;
    const far = corners.reduce((best, corner) => (depth(corner) < depth(best) ? corner : best));
    const sides: { normal: [number, number]; from: [number, number]; to: [number, number] }[] = [
        { normal: [0, -1], from: corners[0]!, to: corners[1]! },
        { normal: [1, 0], from: corners[1]!, to: corners[3]! },
        { normal: [0, 1], from: corners[3]!, to: corners[2]! },
        { normal: [-1, 0], from: corners[2]!, to: corners[0]! },
    ];
    const markZ = waterZ(TARGET);
    const markOf = (front: boolean) =>
        sides
            .filter(({ normal }) => normal[0] * vx + normal[1] * vy > 0 === front)
            .map(({ from, to }) => line([from[0], from[1], markZ], [to[0], to[1], markZ]))
            .join('');
    // A level rule on the long wall that faces the viewer: a strip up the glass with a tick every 10 %, longer every 25 %.
    const ruleY = vy >= 0 ? TANK.y + TANK.d : TANK.y;
    const ruleX = TANK.x + 6;
    const ticks: string[] = [];
    for (let level = 10; level < CAP; level += 5) {
        if (level === TARGET) continue;
        const z = waterZ(level);
        ticks.push(line([ruleX, ruleY, z], [ruleX + (level % 25 === 0 ? 5 : 2.6), ruleY, z]));
    }
    const TANK_ART = {
        floor: solid(TANK, 0, FLOOR, 4, 0.6),
        backEdge: line([far[0], far[1], FLOOR], [far[0], far[1], TANK_H]),
        edges: corners
            .filter(corner => corner !== far)
            .map(([x, y]) => line([x, y, FLOOR], [x, y, TANK_H]))
            .join(''),
        markBack: markOf(false),
        markFront: markOf(true),
        rule: line([ruleX, ruleY, FLOOR], [ruleX, ruleY, TANK_H - 4]),
        ticks: ticks.join(''),
        targetTick: line([ruleX, ruleY, markZ], [ruleX + 8, ruleY, markZ]),
        rim: planOutline(TANK, TANK_H, P, 4),
        lip: planOutline(insetPlan(TANK, 2.4), TANK_H, P, 4),
        waterOf: (level: number) => (level > 0.4 ? solid(insetPlan(TANK, 1.6), FLOOR, waterZ(level) - FLOOR, 4, 0) : null),
        streamOf: (level: number) => line([SPOUT.x, SPOUT.y, ARM_Z[0]], [SPOUT.x, SPOUT.y, waterZ(level)]),
    };

    const TAP = {
        halo: solid(ARM, ARM_Z[0], ARM_Z[1] - ARM_Z[0]).fill,
        pipe: solid(PIPE, 0, ARM_Z[1], 4, 0.6),
        arm: solid(ARM, ARM_Z[0] + 8, ARM_Z[1] - ARM_Z[0] - 8, 4, 0.6),
        spout: solid(box(SPOUT.x - 4, SPOUT.x + 4, SPOUT.y - 4, SPOUT.y + 4, 1), ARM_Z[0], 8, 4, 0.5),
        ring: planOutline(insetPlan(PIPE, 1.4), ARM_Z[1], P, 4),
        collar: planOutline(box(PIPE.x - 1.5, PIPE.x + PIPE.w + 1.5, PIPE.y - 1.5, PIPE.y + PIPE.d + 1.5, 1), 30, P, 4),
    };

    const LEAK = {
        stub: solid(STUB, STUB_Z[0], STUB_Z[1] - STUB_Z[0], 4, 0.5),
        plug: solid(box(STUB.x + STUB.w, STUB.x + STUB.w + 4, -5.2, 5.2, 1), STUB_Z[0] - 1.2, STUB_Z[1] - STUB_Z[0] + 2.4, 3, 0.4),
        stream: line([LEAK_AT.x, LEAK_AT.y, STUB_Z[0]], [LEAK_AT.x, LEAK_AT.y, 0.3]),
        puddle: cylinder(LEAK_AT.x, LEAK_AT.y, 9, 0, 0.4, 24),
    };

    return { BASE_ART, TANK_ART, TAP, LEAK };
}

export type Art = ReturnType<typeof artOf>;
