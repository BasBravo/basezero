import { circleRing, extrude, insetPlan, onTop, pathOf, ring, slabOf, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { atOf } from '../orbit';
import type { Box } from '../painter';
import { boxOfPlan, facing, panel, sortedParts, type Part } from '../parts';
import { BED, boxPlan, ghostBox, tileArt } from '../track';
import { trainArtOf, type Heading } from '../train';
import { GAP_TILE, PATH } from './model';
import { BASE } from './view';

/** The circuit, as tiles that fit edge to edge. The `gap` tile is the one that can be taken away. */
export const TILES: { id: string; plan: Plan; along: 'x' | 'y'; gap?: boolean }[] = [
    { id: 'tile-back', plan: boxPlan(-90, 90, -46, -26, 1), along: 'x' },
    { id: 'tile-left', plan: boxPlan(-90, -70, -26, 26, 1), along: 'y' },
    { id: 'tile-right', plan: boxPlan(70, 90, -26, 26, 1), along: 'y' },
    { id: 'tile-front-left', plan: boxPlan(-90, GAP_TILE.x0, 26, 46, 1), along: 'x' },
    { id: 'tile-gap', plan: boxPlan(GAP_TILE.x0, GAP_TILE.x1, 26, 46, 1), along: 'x', gap: true },
    { id: 'tile-front-right', plan: boxPlan(GAP_TILE.x1, 90, 26, 46, 1), along: 'x' },
];

export const GAP_Z = 8;

/** The extras around the circuit, nothing the train needs: a station, a goods shed and a water tower. */
export const EXTRAS: { kind: 'station' | 'shed' | 'tower'; plan: Plan; height: number }[] = [
    { kind: 'station', plan: boxPlan(-70, -34, -70, -52, 1.2), height: 19 },
    { kind: 'shed', plan: boxPlan(18, 54, -70, -52, 1.2), height: 16 },
    { kind: 'tower', plan: boxPlan(102, 126, -12, 12, 1.2), height: 29 },
];

/** The side of the circuit a point on it belongs to, which sets the way the train faces (the circuit runs +x, +y, −x, −y). */
export function headingAt([x, y]: Plane): Heading {
    const eps = 1e-6;
    if (Math.abs(y - PATH[0]![1]) < eps && x < PATH[1]![0] - eps) return 0;
    if (Math.abs(x - PATH[1]![0]) < eps && y < PATH[2]![1] - eps) return 1;
    if (Math.abs(y - PATH[2]![1]) < eps && x > PATH[3]![0] + eps) return 2;
    return 3;
}

/** The station: a house with a deep roof, a chimney, a door and windows on the sides you can see. */
function stationParts(P: Projection, plan: Plan): Part[] {
    const body = plan;
    const wall = 13;
    const roof = { ...insetPlan(plan, -1.6), r: 1.6 };
    const ridge = insetPlan(plan, 4);
    const [x0, x1, y0, y1] = [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d];
    const lines: Part['lines'] = [];
    if (facing(P, [0, 1])) {
        lines.push({ d: panel(P, [x0 + 15, y1], [x0 + 21, y1], 0, 9), tone: 'mid' });
        for (const x of [x0 + 5, x0 + 26]) lines.push({ d: panel(P, [x, y1], [x + 5, y1], 5, 9.5), tone: 'lo' });
    }
    if (facing(P, [0, -1])) for (const x of [x0 + 5, x0 + 26]) lines.push({ d: panel(P, [x, y0], [x + 5, y0], 5, 9.5), tone: 'lo' });
    if (facing(P, [1, 0])) lines.push({ d: panel(P, [x1, y0 + 6], [x1, y1 - 6], 5, 9.5), tone: 'lo' });
    if (facing(P, [-1, 0])) lines.push({ d: panel(P, [x0, y0 + 6], [x0, y1 - 6], 5, 9.5), tone: 'lo' });
    const chimney = { x: x0 + 8, y: y0 + 6 };
    return [
        { id: 'walls', box: boxOfPlan(body, 0, wall), solid: slabOf(body, 0, wall, P, 4, 0.6), tone: 'mid', lines },
        { id: 'roof', box: boxOfPlan(roof, wall, wall + 2), solid: slabOf(roof, wall, 2, P, 4, 0.5), tone: 'mid' },
        { id: 'ridge', box: boxOfPlan(ridge, wall + 2, wall + 3.4), solid: slabOf(ridge, wall + 2, 1.4, P, 4, 0.4), tone: 'mid' },
        {
            id: 'chimney',
            box: [chimney.x - 2, chimney.x + 2, chimney.y - 2, chimney.y + 2, wall + 3.4, wall + 6],
            solid: slabOf(boxPlan(chimney.x - 2, chimney.x + 2, chimney.y - 2, chimney.y + 2, 0.4), wall + 3.4, 2.6, P, 2, 0.3),
            tone: 'mid',
        },
    ];
}

/** The goods shed: a long low building with ribbed walls and a wide sliding door. */
function shedParts(P: Projection, plan: Plan): Part[] {
    const wall = 12;
    const roof = { ...insetPlan(plan, -1.2), r: 1.2 };
    const vent = insetPlan(plan, 6);
    const [x0, x1, y0, y1] = [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d];
    const at = atOf(P);
    const lines: Part['lines'] = [];
    for (const [normal, y] of [
        [[0, 1], y1],
        [[0, -1], y0],
    ] as [Plane, number][]) {
        if (!facing(P, normal)) continue;
        const ribs: string[] = [];
        for (let x = x0 + 4; x < x1 - 1; x += 4) if (y === y0 || x < x0 + 11 || x > x0 + 25) ribs.push(pathOf([at([x, y, 0]), at([x, y, wall])]));
        lines.push({ d: ribs.join(''), tone: 'faint' });
        if (y === y1) lines.push({ d: panel(P, [x0 + 12, y], [x0 + 24, y], 0, 9) + pathOf([at([x0 + 18, y, 0]), at([x0 + 18, y, 9])]), tone: 'mid' });
    }
    for (const [normal, x] of [
        [[1, 0], x1],
        [[-1, 0], x0],
    ] as [Plane, number][]) {
        if (!facing(P, normal)) continue;
        lines.push({ d: panel(P, [x, y0 + 6], [x, y1 - 6], 6, 9), tone: 'lo' });
    }
    return [
        { id: 'walls', box: boxOfPlan(plan, 0, wall), solid: slabOf(plan, 0, wall, P, 4, 0.6), tone: 'mid', lines },
        { id: 'roof', box: boxOfPlan(roof, wall, wall + 1.6), solid: slabOf(roof, wall, 1.6, P, 4, 0.4), tone: 'mid' },
        { id: 'vent', box: boxOfPlan(vent, wall + 1.6, wall + 3), solid: slabOf(vent, wall + 1.6, 1.4, P, 4, 0.3), tone: 'mid' },
    ];
}

/** The water tower: a round tank with a cap on four legs and a deck. */
function towerParts(P: Projection, plan: Plan): Part[] {
    const cx = plan.x + plan.w / 2;
    const cy = plan.y + plan.d / 2;
    const legs: Plane[] = [
        [plan.x + 3, plan.y + 3],
        [plan.x + plan.w - 3, plan.y + 3],
        [plan.x + 3, plan.y + plan.d - 3],
        [plan.x + plan.w - 3, plan.y + plan.d - 3],
    ];
    const deck = { z: 13, h: 1.4 };
    const tank = { r: 10, z: deck.z + deck.h, h: 10 };
    const cap = { r: 10.8, z: tank.z + tank.h, h: 1.6 };
    const round = (r: number, z: number, h: number) => extrude(circleRing(cx, cy, r, 36), z, h, P, { convex: true });
    const roundBox = (r: number, z0: number, z1: number): Box => [cx - r, cx + r, cy - r, cy + r, z0, z1];
    const deckPlan = insetPlan(plan, 0.5);
    return [
        { id: 'pad', box: boxOfPlan(plan, 0, 0.8), solid: slabOf(plan, 0, 0.8, P, 4, 0.2), tone: 'lo' },
        ...legs.map(([x, y], index): Part => {
            const leg = boxPlan(x - 1.2, x + 1.2, y - 1.2, y + 1.2, 0.3);
            return { id: `leg-${index}`, box: boxOfPlan(leg, 0.8, deck.z), solid: slabOf(leg, 0.8, deck.z - 0.8, P, 2), tone: 'mid' };
        }),
        { id: 'deck', box: boxOfPlan(deckPlan, deck.z, deck.z + deck.h), solid: slabOf(deckPlan, deck.z, deck.h, P, 4, 0.3), tone: 'mid' },
        {
            id: 'tank',
            box: roundBox(tank.r, tank.z, tank.z + tank.h),
            solid: round(tank.r, tank.z, tank.h),
            tone: 'mid',
            lines: [{ d: ring(cx, cy, tank.r - 2.5, tank.z + tank.h, P, 32), tone: 'faint' }],
        },
        { id: 'cap', box: roundBox(cap.r, cap.z, cap.z + cap.h), solid: round(cap.r, cap.z, cap.h), tone: 'mid' },
        { id: 'knob', box: roundBox(1.6, cap.z + cap.h, cap.z + cap.h + 2), solid: round(1.5, cap.z + cap.h, 2), tone: 'mid' },
    ];
}


/** The two rails as one closed loop each, square at the corners; with the tile out, both stop at its edges. */
const RAIL_HALF = 6.4;
function railsOf(cut: boolean, P: Projection) {
    return [RAIL_HALF, -RAIL_HALF]
        .map(offset => {
            const [hx, hy] = [PATH[1]![0] + offset, PATH[2]![1] + offset];
            const loop: Plane[] = [
                [GAP_TILE.x0, hy],
                [-hx, hy],
                [-hx, -hy],
                [hx, -hy],
                [hx, hy],
                [GAP_TILE.x1, hy],
            ];
            return cut ? onTop(loop, BED, P) : onTop(loop.slice(1, 5), BED, P, true);
        })
        .join('');
}

export function artOf(P: Projection) {
    const plans = EXTRAS.map(extra => extra.plan);
    return {
        BASE_ART: baseArtOf(P, BASE),
        TILE_ART: TILES.map(({ plan, along }) => tileArt(plan, along, P)),
        RAILS: railsOf(false, P),
        RAILS_CUT: railsOf(true, P),
        GAP_GHOST: ghostBox(TILES.find(tile => tile.gap)!.plan, 0, GAP_Z, P),
        EXTRA_ART: EXTRAS.map(({ kind, plan, height }, index) => ({
            halo: slabOf(plans[index]!, 0, height * 0.7, P).fill,
            parts: sortedParts(kind === 'station' ? stationParts(P, plan) : kind === 'shed' ? shedParts(P, plan) : towerParts(P, plan), P),
            ghost: ghostBox(plan, 0, height, P),
        })),
        ...trainArtOf(P),
    };
}

export type Art = ReturnType<typeof artOf>;
