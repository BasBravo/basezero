import { circleRing, extrude, onTop, pathOf, ring, slabOf, type Flat, type Plan, type Point3, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { atOf } from '../orbit';
import { boxPlan, ghostBox } from '../track';
import { BASE } from './view';

export const PIPE_TOP = 14;
export const SOURCE = { x: -166, y: -40, r: 14, h: 30 };
export const CUP = { x: -162, y: 40, r: 12, h: 12 };

/** The four steps, each one or two pipe pieces, and the line the water follows through it. */
/** Half the length of the flange that joins one step to the next; the pipes stop short of it so each joint is its own part. */
export const FLANGE = 2.2;
const F = FLANGE;

export const STEPS_ART: { pieces: { id: string; plan: Plan }[]; inlet?: { id: string; plan: Plan; bolts: [number, number][] }; path: [number, number][]; bands: { from: number; dir: 1 | -1; y: number; piece: number } }[] = [
    { pieces: [{ id: 'p1', plan: boxPlan(-150, -60 - F, -46, -34, 1) }], path: [[-150, -40], [-60, -40]], bands: { from: -140, dir: 1, y: -40, piece: 0 } },
    {
        pieces: [{ id: 'p2', plan: boxPlan(-60 + F, 30 - F, -46, -34, 1) }],
        inlet: { id: 'f2', plan: boxPlan(-60 - F, -60 + F, -47.6, -32.4, 0.6), bolts: [[-60, -45.4], [-60, -34.6]] },
        path: [[-60, -40], [30, -40]],
        bands: { from: -50, dir: 1, y: -40, piece: 0 },
    },
    {
        pieces: [
            { id: 'p3a', plan: boxPlan(30 + F, 114, -46, -34, 1) },
            { id: 'p3u', plan: boxPlan(114, 126, -46, 46, 1) },
        ],
        inlet: { id: 'f3', plan: boxPlan(30 - F, 30 + F, -47.6, -32.4, 0.6), bolts: [[30, -45.4], [30, -34.6]] },
        path: [[30, -40], [120, -40], [120, 40]],
        bands: { from: 40, dir: 1, y: -40, piece: 0 },
    },
    {
        pieces: [{ id: 'p4', plan: boxPlan(-150, 114 - 2 * F, 34, 46, 1) }],
        inlet: { id: 'f4', plan: boxPlan(114 - 2 * F, 114, 32.4, 47.6, 0.6), bolts: [[114 - F, 35.4], [114 - F, 44.6]] },
        path: [[120, 40], [-150, 40]],
        bands: { from: 100, dir: -1, y: 40, piece: 0 },
    },
];
export const FLANGE_TOP = PIPE_TOP + 1.6;

/** Where the water falls out when the route is cut after `reach` steps. */
export const SPILL: [number, number][] = [
    [-147, -40],
    [-56, -40],
    [34, -40],
    [120, 50],
];

export function artOf(P: Projection) {
    const at = atOf(P);
    const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number) => extrude(circleRing(cx, cy, r, 28), z, h, P, { convex: true });
    const line = (...points: Point3[]) => pathOf(points.map((point): Flat => at(point)));

    const STEP_ART = STEPS_ART.map((step, index) => ({
        pieces: step.pieces.map(piece => ({ id: piece.id, plan: piece.plan, body: solid(piece.plan, 0, PIPE_TOP, 4, 0.6), halo: solid(piece.plan, 0, PIPE_TOP).fill, ghost: ghostBox(piece.plan, 0, PIPE_TOP, P) })),
        inlet: step.inlet && {
            body: solid(step.inlet.plan, 0, FLANGE_TOP, 3, 0.4),
            bolts: step.inlet.bolts.map(([x, y]) => at([x, y, FLANGE_TOP])),
            rings: step.inlet.bolts.map(([x, y]) => ring(x, y, 0.9, FLANGE_TOP, P, 12)).join(''),
            ghost: ghostBox(step.inlet.plan, 0, FLANGE_TOP, P),
        },
        // One band on the first piece for the first step, two for the second, and so on: they tie each pipe to its button.
        bands: Array.from({ length: index + 1 }, (_, band) => {
            const x = step.bands.from + step.bands.dir * band * 6;
            return onTop([[x, step.bands.y - 6], [x, step.bands.y + 6]], PIPE_TOP, P);
        }).join(''),
    }));

    const flowOf = (reach: number) => {
        const points = STEPS_ART.slice(0, reach).flatMap((step, index) => (index ? step.path.slice(1) : step.path));
        return points.length > 1 ? pathOf(points.map(([x, y]): Flat => at([x, y, PIPE_TOP]))) : '';
    };
    const spillOf = (reach: number) => {
        const [x, y] = SPILL[reach]!;
        return { stream: line([x, y, 8], [x, y, 0.3]), puddle: cylinder(x, y, 6, 0, 0.4) };
    };

    return {
        BASE_ART: baseArtOf(P, BASE),
        STEP_ART,
        SOURCE: { body: cylinder(SOURCE.x, SOURCE.y, SOURCE.r, 0, SOURCE.h), top: ring(SOURCE.x, SOURCE.y, SOURCE.r - 4, SOURCE.h, P, 24), halo: cylinder(SOURCE.x, SOURCE.y, SOURCE.r, 0, SOURCE.h).fill },
        CUP: { body: cylinder(CUP.x, CUP.y, CUP.r, 0, CUP.h), top: ring(CUP.x, CUP.y, CUP.r - 3.5, CUP.h, P, 24) },
        flowOf,
        spillOf,
    };
}

export type Art = ReturnType<typeof artOf>;
