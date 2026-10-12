import { insetPlan, planOutline, slabOf, type Plan, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { boxPlan, cartArt, ghostBox, tileArt } from '../track';
import { GAP_TILE } from './model';
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
export const EXTRA_H = 14;
/** The extras around the circuit: nothing the train needs. */
export const EXTRAS: Plan[] = [boxPlan(-70, -34, -70, -52, 2), boxPlan(18, 54, -70, -52, 2), boxPlan(102, 126, -16, 16, 2)];

export function artOf(P: Projection) {
    const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    return {
        BASE_ART: baseArtOf(P, BASE),
        TILE_ART: TILES.map(({ plan, along }) => tileArt(plan, along, P)),
        GAP_GHOST: ghostBox(TILES.find(tile => tile.gap)!.plan, 0, GAP_Z, P),
        EXTRA_ART: EXTRAS.map(plan => ({
            halo: solid(plan, 0, EXTRA_H).fill,
            body: solid(plan, 0, EXTRA_H, 4, 0.8),
            roof: planOutline(insetPlan(plan, 3), EXTRA_H, P, 4),
            ghost: ghostBox(plan, 0, EXTRA_H, P),
        })),
        CART: cartArt(P),
    };
}

export type Art = ReturnType<typeof artOf>;
