import { circleRing, extrude, onTop, pathOf, planOutline, slabOf, type Flat, type Plan, type Plane, type Point3, type Projection } from '@/components/iso/iso-kit';
import { atOf } from './orbit';

export const BED = 2;

export const boxPlan = (x0: number, x1: number, y0: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

/** A track tile with rails and sleepers. `along` is the direction the rails run. */
export function tileArt(plan: Plan, along: 'x' | 'y', P: Projection) {
    const [x0, x1, y0, y1] = [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d];
    const across = along === 'x' ? (y0 + y1) / 2 : (x0 + x1) / 2;
    const from = along === 'x' ? x0 : y0;
    const to = along === 'x' ? x1 : y1;
    const at = (p: number, q: number): Plane => (along === 'x' ? [p, q] : [q, p]);
    const rails = [-6.4, 6.4].map(side => onTop([at(from, across + side), at(to, across + side)], BED, P)).join('');
    const sleepers: string[] = [];
    for (let p = from + 6; p < to - 3; p += 12) sleepers.push(onTop([at(p, across - 10), at(p, across + 10)], BED, P));
    return { slab: slabOf(plan, 0, BED, P, 3, 0.4), rails, sleepers: sleepers.join('') };
}

/** The little train, built at the origin on the track bed and moved along it. */
export function cartArt(P: Projection) {
    const solid = (plan: Plan, z: number, h: number, steps: number, bevel: number) => slabOf(plan, z, h, P, steps, bevel);
    return {
        body: solid(boxPlan(-10, 10, -10, 10, 2.5), BED, 9, 4, 0.8),
        cabin: solid(boxPlan(-6, 6, -6, 6, 2), BED + 9, 5, 3, 0.5),
        chimney: extrude(circleRing(0, 0, 2.8, 24), BED + 14, 3, P, { convex: true }),
    };
}

/** The outline of a box that is not there (dotted): where something was left out, or taken away. */
export function ghostBox(plan: Plan, z0: number, z1: number, P: Projection) {
    const at = atOf(P);
    const corners: Plane[] = [
        [plan.x, plan.y],
        [plan.x + plan.w, plan.y],
        [plan.x, plan.y + plan.d],
        [plan.x + plan.w, plan.y + plan.d],
    ];
    const edge = ([x, y]: Plane) => pathOf([at([x, y, z0] as Point3), at([x, y, z1] as Point3)] as Flat[]);
    return planOutline({ ...plan, r: 0 }, z0, P, 4) + planOutline({ ...plan, r: 0 }, z1, P, 4) + corners.map(edge).join('');
}
