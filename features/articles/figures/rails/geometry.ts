import { circleRing, extrude, insetPlan, onTop, planOutline, slabOf, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { facing, panel } from '../parts';
import { trainArtOf } from '../train';
import { BRANCH_Y, JUNCTION_X } from './model';
import { BASE } from './view';

export const BED = 2;

const box = (x0: number, x1: number, y0: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

/** Track tiles that fit edge to edge: the line, the junction and the two branches. `along` is the direction the rails run. */
export const TILES: { id: string; plan: Plan; along: 'x' | 'y' }[] = [
    { id: 'tile-main', plan: box(-165, -31, -11, 11, 1), along: 'x' },
    { id: 'tile-junction', plan: box(-31, -9, -11, 11, 1), along: 'x' },
    { id: 'tile-a-turn', plan: box(-31, -9, -55, -11, 1), along: 'y' },
    { id: 'tile-a-run', plan: box(-9, 136, -55, -33, 1), along: 'x' },
    { id: 'tile-b-turn', plan: box(-31, -9, 11, 55, 1), along: 'y' },
    { id: 'tile-b-run', plan: box(-9, 136, 33, 55, 1), along: 'x' },
];

export const BUFFER = box(-176, -166, -11, 11, 1.5);
export const BUFFER_H = 7;
export const GATE_Y = [-22, 22] as const;
export const GATE_POST_H = 30;
export const ARM_H = 4;
export const ARM_CLOSED = 3;
export const ARM_OPEN = 22;
const POSTS_X = [-36, -8] as const;
export const STATION_X = [138, 176] as const;
export const FLAG_TOP = 76;

/** A polyline along the axes moved sideways by `offset` (left of the direction of travel), with square mitred corners. */
function offsetOf(points: Plane[], offset: number): Plane[] {
    const normals = points.slice(1).map((point, index) => {
        const [dx, dy] = [point[0] - points[index]![0], point[1] - points[index]![1]];
        const length = Math.hypot(dx, dy) || 1;
        return [-dy / length, dx / length] as Plane;
    });
    return points.map((point, index) => {
        const before = normals[index - 1];
        const after = normals[index];
        const [nx, ny] = before && after ? [before[0] + after[0], before[1] + after[1]] : (before ?? after)!;
        return [point[0] + nx * offset, point[1] + ny * offset];
    });
}

export function artOf(P: Projection) {
    const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number, steps = 24) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true });
    const join = (paths: string[]) => paths.join('');

    const BASE_ART = baseArtOf(P, BASE);

    const TILE_ART = TILES.map(({ plan, along }) => {
        const [x0, x1, y0, y1] = [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d];
        const across = along === 'x' ? (y0 + y1) / 2 : (x0 + x1) / 2;
        const from = along === 'x' ? x0 : y0;
        const to = along === 'x' ? x1 : y1;
        const at = (p: number, q: number): Plane => (along === 'x' ? [p, q] : [q, p]);
        const sleepers: string[] = [];
        for (let p = from + 6; p < to - 3; p += 12) sleepers.push(onTop([at(p, across - 11), at(p, across + 11)], BED, P));
        return { slab: solid(plan, 0, BED, 3, 0.4), sleepers: join(sleepers) };
    });

    const BUFFER_ART = { block: solid(BUFFER, 0, BUFFER_H, 3, 0.6), top: planOutline(insetPlan(BUFFER, 2), BUFFER_H, P, 3) };

    const POST_PLANS = GATE_Y.map(y => POSTS_X.map(x => box(x, x + 4, y - 2, y + 2, 0.8)));
    const GATES = GATE_Y.map((y, index) => ({
        posts: POST_PLANS[index]!.map(plan => ({ body: solid(plan, 0, GATE_POST_H, 3, 0.4), cap: planOutline(insetPlan(plan, 0.8), GATE_POST_H, P, 3) })),
        // The arm is built on the ground and lifted by the figure.
        arm: solid(box(-32, -8, y - 1, y + 1, 0.4), 0, ARM_H, 3, 0.3),
        stripes: join([-27, -20, -13].map(x => onTop([[x, y - 1], [x, y + 1]], ARM_H, P))),
    }));

    // Each rail follows a branch's centre line at a fixed offset, mitred at the corners, so the rails run unbroken through the switch.
    const RAILS = join(
        BRANCH_Y.flatMap(y => {
            const route: Plane[] = [
                [-165, 0],
                [JUNCTION_X, 0],
                [JUNCTION_X, y],
                [136, y],
            ];
            return [-6.4, 6.4].map(offset => onTop(offsetOf(route, offset), BED, P));
        }),
    );

    const station = (side: -1 | 1) => {
        const y0 = side < 0 ? -62 : 26;
        const [x0, x1, y1] = [STATION_X[0], STATION_X[1], y0 + 36];
        const track = BRANCH_Y[side < 0 ? 0 : 1];
        const body = box(x0, x1, y0, y1, 2);
        const roof = box(x0 - 4, x1 + 4, y0 - 4, y0 + 40, 2.5);
        // The doorway the train runs into, and windows on whichever walls face the viewer.
        const openings: string[] = [];
        if (facing(P, [-1, 0])) openings.push(panel(P, [x0, track - 9], [x0, track + 9], 0, 17));
        if (facing(P, [1, 0])) openings.push(panel(P, [x1, y0 + 8], [x1, y1 - 8], 11, 18));
        for (const [normal, y] of [
            [[0, 1], y1],
            [[0, -1], y0],
        ] as [Plane, number][]) {
            if (!facing(P, normal)) continue;
            for (const x of [x0 + 6, x0 + 17, x0 + 28]) openings.push(panel(P, [x, y], [x + 5, y], 11, 18));
        }
        return {
            halo: solid(roof, 0, 28).fill,
            body: solid(body, 0, 24, 4, 0.8),
            roof: solid(roof, 24, 4, 4, 0.6),
            roofLine: planOutline(insetPlan(roof, 3), 28, P, 4),
            openings: join(openings),
        };
    };
    const STATIONS = [station(-1), station(1)];

    const FLAG = {
        pole: cylinder(157, -44, 1.6, 28, FLAG_TOP - 28, 12),
        cloth: solid(box(158.6, 180, -45.4, -42.6, 0.4), 56, 17, 3, 0.2),
    };

    return { BASE_ART, TILE_ART, RAILS, BUFFER_ART, GATES, STATIONS, FLAG, ...trainArtOf(P) };
}

export type Art = ReturnType<typeof artOf>;
