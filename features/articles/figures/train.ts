import { circleRing, extrude, pathOf, sideRing, slabOf, planOutline, insetPlan, type Plan, type Plane, type Projection, type SolidPaths } from '@/components/iso/iso-kit';
import { atOf } from './orbit';
import type { Box } from './painter';
import { boxOfPlan, facing, panel, sortedParts, type Part } from './parts';
import { BED, boxPlan } from './track';

/** Train lengths: the engine, the wagon behind it, and how far apart their centres run along the track. */
export const ENGINE_HALF = 13.5;
export const WAGON_HALF = 10.5;
export const COUPLING = 26;
export const TRAIN_TOP = BED + 17;

export type Heading = 0 | 1 | 2 | 3;
/** The four ways the train can face on a track laid along the axes. */
const FORWARD: Plane[] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];
export const HEADINGS: Heading[] = [0, 1, 2, 3];

/** The heading of a move along an axis, from its direction. */
export const headingOf = (dx: number, dy: number): Heading => (Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 0 : 2) : dy >= 0 ? 1 : 3);

/** Builds parts in a local frame (u along the heading, w across it) and turns them into the world. */
function frameOf(heading: Heading) {
    const [fx, fy] = FORWARD[heading]!;
    const [sx, sy] = [-fy, fx];
    const world = (u: number, w: number): Plane => [u * fx + w * sx, u * fy + w * sy];
    const plan = (u0: number, u1: number, w0: number, w1: number, r = 0.6): Plan => {
        const corners = [world(u0, w0), world(u1, w1)];
        const xs = corners.map(([x]) => x);
        const ys = corners.map(([, y]) => y);
        return boxPlan(Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), r);
    };
    return { world, plan, across: (Math.abs(sx) > 0.5 ? 'x' : 'y') as 'x' | 'y', side: [sx, sy] as Plane, forward: [fx, fy] as Plane };
}

/** Wheels on both sides of a bogie, as discs standing on the rails. */
function wheelsOf(P: Projection, frame: ReturnType<typeof frameOf>, id: string, us: number[], half: number): Part[] {
    const radius = 2.5;
    const z = BED + radius;
    return [-1, 1].flatMap(side =>
        us.map((u): Part => {
            const [x, y] = frame.world(u, side * half);
            const box: Box = frame.across === 'y' ? [x - radius, x + radius, y - 0.3, y + 0.3, BED, z + radius] : [x - 0.3, x + 0.3, y - radius, y + radius, BED, z + radius];
            const at = atOf(P);
            const hub = at([x, y, z]);
            return {
                id: `${id}-wheel-${side}-${u}`,
                box,
                discs: [{ d: sideRing([x, y, z], radius, frame.across, P, 22), tone: 'mid' }],
                lines: [{ d: sideRing([x, y, z], radius * 0.45, frame.across, P, 14) + pathOf([hub, hub]), tone: 'lo' }],
            };
        }),
    );
}

function engineParts(P: Projection, heading: Heading): Part[] {
    const f = frameOf(heading);
    const solid = (plan: Plan, z: number, h: number, steps = 3, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const round = (u: number, r: number, z: number, h: number): SolidPaths => {
        const [x, y] = f.world(u, 0);
        return extrude(circleRing(x, y, r, 24), z, h, P, { convex: true });
    };
    const roundBox = (u: number, r: number, z0: number, z1: number): Box => {
        const [x, y] = f.world(u, 0);
        return [x - r, x + r, y - r, y + r, z0, z1];
    };
    const chassis = f.plan(-12, 12, -5.2, 5.2, 0.6);
    const bogie = f.plan(-10, 10, -3.6, 3.6, 0.4);
    const boiler = f.plan(-1.5, 11, -4.4, 4.4, 4.2);
    const cab = f.plan(-11.5, -1.5, -5.4, 5.4, 0.8);
    const roof = f.plan(-12.6, -0.6, -6.4, 6.4, 1.2);
    const buffers = [f.plan(12, 13.5, -4, 4, 0.5), f.plan(-13.5, -12, -4, 4, 0.5)];
    const deck = BED + 4.4;
    const parts: Part[] = [
        { id: 'bogie', box: boxOfPlan(bogie, BED + 1, deck - 1.4), solid: solid(bogie, BED + 1, deck - 1.4 - BED - 1, 3), tone: 'lo' },
        { id: 'chassis', box: boxOfPlan(chassis, deck - 1.4, deck), solid: solid(chassis, deck - 1.4, 1.4, 3, 0.3), tone: 'mid' },
        ...buffers.map((plan, index): Part => ({ id: `buffer-${index}`, box: boxOfPlan(plan, deck - 1.2, deck - 0.2), solid: solid(plan, deck - 1.2, 1, 3), tone: 'lo' })),
        { id: 'boiler', box: boxOfPlan(boiler, deck, deck + 7), solid: solid(boiler, deck, 7, 6, 0.6), tone: 'hi', lit: true },
        { id: 'chimney', box: roundBox(8, 2, deck + 7, deck + 11.6), solid: round(8, 1.8, deck + 7, 4.6), tone: 'hi', lit: true },
        { id: 'dome', box: roundBox(2.8, 2.2, deck + 7, deck + 9), solid: round(2.8, 2.1, deck + 7, 2), tone: 'hi', lit: true },
        { id: 'cab', box: boxOfPlan(cab, deck, deck + 10.6), solid: solid(cab, deck, 10.6, 3, 0.4), tone: 'hi', lit: true },
        { id: 'roof', box: boxOfPlan(roof, deck + 10.6, deck + 12), solid: solid(roof, deck + 10.6, 1.4, 4, 0.4), tone: 'mid' },
    ];
    // Cab windows on whichever sides face the viewer.
    const cabParts = parts.find(part => part.id === 'cab')!;
    cabParts.lines = [];
    for (const side of [-1, 1]) {
        if (!facing(P, [f.side[0] * side, f.side[1] * side])) continue;
        cabParts.lines.push({ d: panel(P, f.world(-9.5, side * 5.4), f.world(-4, side * 5.4), deck + 5.4, deck + 9), tone: 'mid' });
    }
    if (facing(P, [-f.forward[0], -f.forward[1]])) cabParts.lines.push({ d: panel(P, f.world(-11.5, -3), f.world(-11.5, 3), deck + 5.4, deck + 9), tone: 'mid' });
    // Boiler bands: across the top and down the side that faces the viewer, so each ends on an edge.
    const at = atOf(P);
    const near = facing(P, f.side) ? 1 : -1;
    parts.find(part => part.id === 'boiler')!.lines = [0.6, 5.4].map(u => {
        const [a, b] = [f.world(u, near * 4.4), f.world(u, -near * 4.4)];
        return { d: pathOf([at([a[0], a[1], deck]), at([a[0], a[1], deck + 7]), at([b[0], b[1], deck + 7])]), tone: 'mid' as const };
    });
    return [...parts, ...wheelsOf(P, f, 'engine', [-7.5, -2, 6.5], 4.2)];
}

function wagonParts(P: Projection, heading: Heading): Part[] {
    const f = frameOf(heading);
    const solid = (plan: Plan, z: number, h: number, steps = 3, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const deck = BED + 4.4;
    const chassis = f.plan(-9.5, 9.5, -5, 5, 0.6);
    const bogie = f.plan(-8, 8, -3.6, 3.6, 0.4);
    const body = f.plan(-9, 9, -5.4, 5.4, 0.8);
    const buffers = [f.plan(9.5, 10.5, -3.6, 3.6, 0.5), f.plan(-10.5, -9.5, -3.6, 3.6, 0.5)];
    const top = deck + 7;
    const lines: Part['lines'] = [{ d: planOutline(insetPlan(body, 1), top, P, 3), tone: 'mid' }];
    // Plank seams on the long sides that face the viewer.
    for (const side of [-1, 1]) {
        if (!facing(P, [f.side[0] * side, f.side[1] * side])) continue;
        const at = atOf(P);
        for (const z of [deck + 2.4, deck + 4.8]) {
            const [a, b] = [f.world(-9, side * 5.4), f.world(9, side * 5.4)];
            lines.push({ d: pathOf([at([a[0], a[1], z]), at([b[0], b[1], z])]), tone: 'lo' });
        }
    }
    return [
        { id: 'bogie', box: boxOfPlan(bogie, BED + 1, deck - 1.4), solid: solid(bogie, BED + 1, deck - 1.4 - BED - 1, 3), tone: 'lo' },
        { id: 'chassis', box: boxOfPlan(chassis, deck - 1.4, deck), solid: solid(chassis, deck - 1.4, 1.4, 3, 0.3), tone: 'mid' },
        ...buffers.map((plan, index): Part => ({ id: `buffer-${index}`, box: boxOfPlan(plan, deck - 1.2, deck - 0.2), solid: solid(plan, deck - 1.2, 1, 3), tone: 'lo' })),
        { id: 'body', box: boxOfPlan(body, deck, top), solid: solid(body, deck, 7, 3, 0.4), tone: 'mid', lines },
        ...wheelsOf(P, f, 'wagon', [-5.5, 5.5], 4.2),
    ];
}


export const engineBox = (heading: Heading, [x, y]: Plane): Box => {
    const along = Math.abs(FORWARD[heading]![0]) > 0.5;
    const [hx, hy] = along ? [ENGINE_HALF, 6.5] : [6.5, ENGINE_HALF];
    return [x - hx, x + hx, y - hy, y + hy, BED, TRAIN_TOP];
};
export const wagonBox = (heading: Heading, [x, y]: Plane): Box => {
    const along = Math.abs(FORWARD[heading]![0]) > 0.5;
    const [hx, hy] = along ? [WAGON_HALF, 5.6] : [5.6, WAGON_HALF];
    return [x - hx, x + hx, y - hy, y + hy, BED, BED + 11.4];
};

/** The engine and the wagon for every heading, built at the origin and already in their own painter's order. */
export const trainArtOf = (P: Projection) => ({
    ENGINE: HEADINGS.map(heading => sortedParts(engineParts(P, heading), P)),
    WAGON: HEADINGS.map(heading => sortedParts(wagonParts(P, heading), P)),
});
