import { circleRing, extrude, insetPlan, onTop, planOutline, slabOf, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
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
        const rails = join([-6.4, 6.4].map(side => onTop([at(from, across + side), at(to, across + side)], BED, P)));
        const sleepers: string[] = [];
        for (let p = from + 6; p < to - 3; p += 12) sleepers.push(onTop([at(p, across - 11), at(p, across + 11)], BED, P));
        return { slab: solid(plan, 0, BED, 3, 0.4), rails, sleepers: join(sleepers) };
    });

    const BUFFER_ART = { block: solid(BUFFER, 0, BUFFER_H, 3, 0.6), top: planOutline(insetPlan(BUFFER, 2), BUFFER_H, P, 3) };

    const POST_PLANS = GATE_Y.map(y => POSTS_X.map(x => box(x, x + 4, y - 2, y + 2, 0.8)));
    const GATES = GATE_Y.map((y, index) => ({
        posts: POST_PLANS[index]!.map(plan => ({ body: solid(plan, 0, GATE_POST_H, 3, 0.4), cap: planOutline(insetPlan(plan, 0.8), GATE_POST_H, P, 3) })),
        // The arm is built on the ground and lifted by the figure.
        arm: solid(box(-32, -8, y - 1, y + 1, 0.4), 0, ARM_H, 3, 0.3),
        stripes: join([-27, -20, -13].map(x => onTop([[x, y - 1], [x, y + 1]], ARM_H, P))),
    }));

    const station = (side: -1 | 1) => {
        const y0 = side < 0 ? -62 : 26;
        const body = box(STATION_X[0], STATION_X[1], y0, y0 + 36, 2);
        const roof = box(STATION_X[0] - 4, STATION_X[1] + 4, y0 - 4, y0 + 40, 2.5);
        return {
            halo: solid(roof, 0, 28).fill,
            body: solid(body, 0, 24, 4, 0.8),
            roof: solid(roof, 24, 4, 4, 0.6),
            roofLine: planOutline(insetPlan(roof, 3), 28, P, 4),
        };
    };
    const STATIONS = [station(-1), station(1)];

    const FLAG = {
        pole: cylinder(157, -44, 1.6, 28, FLAG_TOP - 28, 12),
        cloth: solid(box(158.6, 180, -45.4, -42.6, 0.4), 56, 17, 3, 0.2),
    };

    // The train is built at the origin and moved along the track.
    const CART = {
        body: solid(box(-10, 10, -10, 10, 2.5), BED, 9, 4, 0.8),
        cabin: solid(box(-6, 6, -6, 6, 2), BED + 9, 5, 3, 0.5),
        chimney: cylinder(0, 0, 2.8, BED + 14, 3),
    };

    return { BASE_ART, TILE_ART, BUFFER_ART, GATES, STATIONS, FLAG, CART };
}

export type Art = ReturnType<typeof artOf>;
