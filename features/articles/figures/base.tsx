import { circleRing, extrude, insetPlan, planOutline, ring, slabOf, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { Dots, Line, Solid } from '@/components/iso/draw';
import { atOf } from './orbit';

export const BASE_H = 9;
export const FOOT_H = 5;

/** The plate on four feet every figure stands on. */
export function baseArtOf(P: Projection, BASE: Plan) {
    const at = atOf(P);
    const FEET: Plane[] = [
        [BASE.x + 18, BASE.y + 16],
        [BASE.x + BASE.w - 18, BASE.y + 16],
        [BASE.x + 18, BASE.y + BASE.d - 16],
        [BASE.x + BASE.w - 18, BASE.y + BASE.d - 16],
    ];
    const SCREWS: Plane[] = [
        [BASE.x + 8, BASE.y + 8],
        [BASE.x + BASE.w - 8, BASE.y + 8],
        [BASE.x + 8, BASE.y + BASE.d - 8],
        [BASE.x + BASE.w - 8, BASE.y + BASE.d - 8],
    ];
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number) => extrude(circleRing(cx, cy, r, 28), z, h, P, { convex: true });
    return {
        halo: slabOf(BASE, -BASE_H - FOOT_H, BASE_H, P).fill,
        feet: FEET.map(([x, y]) => [cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6), cylinder(x, y, 5.5, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6)]),
        slab: slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6),
        groove: planOutline(insetPlan(BASE, 4.5), 0, P),
        screwRings: SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16)).join(''),
        screws: SCREWS.map(([x, y]) => at([x, y, 0])),
    };
}

export type BaseArt = ReturnType<typeof baseArtOf>;

export function BaseNode({ art }: { art: BaseArt }) {
    return (
        <g>
            <path className="iso-halo" d={art.halo} />
            {art.feet.map((parts, index) => (
                <g key={index}>
                    {parts.map((paths, part) => (
                        <Solid key={part} paths={paths} tone={part ? 'mid' : 'lo'} crease="faint" />
                    ))}
                </g>
            ))}
            <Solid paths={art.slab} tone="mid" crease="faint" />
            <Line d={art.groove} tone="lo" />
            <Line d={art.screwRings} tone="lo" />
            <Dots points={art.screws} size={0.5} tone="mid" />
        </g>
    );
}
