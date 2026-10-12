import { cameraOf, circleRing, depthOf, extrude, insetPlan, onTop, pathOf, planOutline, ring, slabOf, topTicks, type Flat, type Plan, type Point3, type Projection, type SolidPaths } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { atOf } from '../orbit';
import { viewOf } from '../painter';
import { MAX_OPINIONS, MAX_TILT, MAX_USES, tilted } from './model';
import { ARM, BASE, HANG, PAN_R, PIVOT_Z } from './view';

const box = (x0: number, x1: number, y0: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

export const BEAM = { half: ARM + 6, rise: 3.5, depth: 4.5 };
export const POST = box(-6, 6, -6, 6, 1);
export const PEDESTAL = box(-24, 24, -22, 22, 4);
export const YOKE = box(-9, 9, -7, 7, 1);
export const YOKE_Z = [PIVOT_Z - 10, PIVOT_Z - BEAM.rise] as const;
/** The scale plate in front of the post, and the pointer that sweeps it. */
export const DIAL_Y = 7.5;
export const POINTER = { y: 9, length: 44 };
export const DIAL_Z = [PIVOT_Z - POINTER.length - 4, PIVOT_Z - POINTER.length + 12] as const;
/** Where each pan hangs from, relative to the pivot, before the beam tilts. */
export const HOOK_X = ARM;
export const HOOK_Z = -BEAM.rise;
export const PAN_TOP = PIVOT_Z + HOOK_Z - HANG;

/** Opinions are big and hollow: three on the pan, three more stacked on them. Real use is small and solid, two by two. */
export const OPINION_R = 7;
export const OPINION_H = 9;
const TRIANGLE = [90, 210, 330].map(degrees => [Math.cos((degrees * Math.PI) / 180) * 8.4, Math.sin((degrees * Math.PI) / 180) * 8.4] as const);
export const OPINION_AT = Array.from({ length: MAX_OPINIONS }, (_, index) => ({ x: TRIANGLE[index % 3]![0], y: TRIANGLE[index % 3]![1], z: Math.floor(index / 3) * OPINION_H }));
export const USE_R = 3.6;
export const USE_H = 5;
export const USE_AT = Array.from({ length: MAX_USES }, (_, index) => ({ x: index % 2 ? 4.6 : -4.6, y: index < 2 ? -4.6 : 4.6, z: 0 }));

/** A box given by its eight corners, drawn as a kit solid: hull for fill and outline, the faces that look at the viewer shaded by facing. */
function hexahedron(corners: Point3[], P: Projection): SolidPaths {
    const at = atOf(P);
    const flat = corners.map(at);
    // Corner order: 0..3 the bottom ring, 4..7 the top ring, both counter-clockwise seen from above.
    const faces = [
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [4, 5, 6, 7],
    ];
    const view = viewOf(P);
    const { sinA, cosA } = cameraOf(P);
    const centre = corners.reduce((sum, [x, y, z]) => [sum[0] + x / 8, sum[1] + y / 8, sum[2] + z / 8], [0, 0, 0]);
    const shades = ['', '', '', ''];
    let top = '';
    const crease: string[] = [];
    for (const face of faces) {
        const [a, b, c] = face.map(index => corners[index]!);
        const u = [b![0] - a![0], b![1] - a![1], b![2] - a![2]];
        const v = [c![0] - a![0], c![1] - a![1], c![2] - a![2]];
        let n = [u[1]! * v[2]! - u[2]! * v[1]!, u[2]! * v[0]! - u[0]! * v[2]!, u[0]! * v[1]! - u[1]! * v[0]!];
        const mid = face.reduce((sum, index) => [sum[0] + corners[index]![0] / 4, sum[1] + corners[index]![1] / 4, sum[2] + corners[index]![2] / 4], [0, 0, 0]);
        if (n[0]! * (mid[0] - centre[0]) + n[1]! * (mid[1] - centre[1]) + n[2]! * (mid[2] - centre[2]) < 0) n = n.map(value => -value);
        if (n[0]! * view[0] + n[1]! * view[1] + n[2]! * view[2] <= 1e-9) continue;
        const d = pathOf(face.map(index => flat[index]!), true);
        crease.push(d);
        if (face[0] === 4) {
            top = d;
            continue;
        }
        const length = Math.hypot(n[0]!, n[1]!) || 1;
        const lit = ((n[0]! / length) * -sinA + (n[1]! / length) * cosA + 1) / 2;
        const shade = Math.min(3, Math.max(0, Math.floor(lit * 4)));
        shades[shade] += d;
    }
    const hull = convexHull(flat);
    return { fill: hull, outline: hull, crease: crease.join(''), top, shades };
}

function convexHull(points: Flat[]) {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower: Flat[] = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, point) <= 0) lower.pop();
        lower.push(point);
    }
    const upper: Flat[] = [];
    for (const point of sorted.reverse()) {
        while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, point) <= 0) upper.pop();
        upper.push(point);
    }
    return pathOf([...lower.slice(0, -1), ...upper.slice(0, -1)], true);
}

export function artOf(P: Projection) {
    const at = atOf(P);
    const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number, bevel = 0, steps = 32) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true, bevel });
    const line = (...points: Point3[]) => pathOf(points.map(point => at(point)));
    const pivot = (point: Point3, tilt: number): Point3 => {
        const [x, y, z] = tilted(point, tilt);
        return [x, y, PIVOT_Z + z];
    };

    const BASE_ART = baseArtOf(P, BASE);
    const PLATE = box(BASE.x + 22, BASE.x + 78, BASE.y + BASE.d - 24, BASE.y + BASE.d - 13, 2);
    const STRIP = box(40, 128, BASE.y + BASE.d - 18, BASE.y + BASE.d - 11, 1);
    const stripTicks = topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 4, 5, STRIP.y + 0.8, 0.6, [2, 3.6], P);
    const DETAIL = {
        plate: solid(PLATE, 0, 0.8),
        plateLine: planOutline(insetPlan(PLATE, 1.6), 0.8, P),
        plateRule: [0, 1, 2].map(row => onTop([[PLATE.x + 8, PLATE.y + 3.4 + row * 2.1], [PLATE.x + (row === 1 ? 34 : 44), PLATE.y + 3.4 + row * 2.1]], 0.8, P)).join(''),
        plateScrews: [at([PLATE.x + 3.5, PLATE.y + PLATE.d / 2, 0.8]), at([PLATE.x + PLATE.w - 3.5, PLATE.y + PLATE.d / 2, 0.8])],
        strip: solid(STRIP, 0, 0.6, 3),
        stripBase: onTop([[STRIP.x + 4, STRIP.y + 0.8], [STRIP.x + STRIP.w - 4, STRIP.y + 0.8]], 0.6, P),
        stripMinor: stripTicks.minor,
        stripMajor: stripTicks.major,
    };

    // The column: a pedestal with four screws, a square post and the yoke that carries the pivot.
    const STAND = {
        halo: solid(PEDESTAL, 0, 8).fill,
        pedestal: solid(PEDESTAL, 0, 8, 6, 1),
        groove: planOutline(insetPlan(PEDESTAL, 3.5), 8, P, 4),
        screws: [
            [PEDESTAL.x + 6, PEDESTAL.y + 6],
            [PEDESTAL.x + PEDESTAL.w - 6, PEDESTAL.y + 6],
            [PEDESTAL.x + 6, PEDESTAL.y + PEDESTAL.d - 6],
            [PEDESTAL.x + PEDESTAL.w - 6, PEDESTAL.y + PEDESTAL.d - 6],
        ].map(([x, y]) => at([x!, y!, 8])),
        collar: solid(box(-8, 8, -8, 8, 1.5), 8, 4, 4, 0.5),
        post: solid(POST, 12, YOKE_Z[0] - 12, 4, 0.6),
        yoke: solid(YOKE, YOKE_Z[0], YOKE_Z[1] - YOKE_Z[0], 4, 0.6),
    };

    // The scale plate the pointer sweeps: a tick every 2°, a long one at level and at the end stops.
    const ticks: string[] = [];
    const major: string[] = [];
    for (let degrees = -MAX_TILT; degrees <= MAX_TILT; degrees += 2) {
        const big = degrees === 0 || Math.abs(degrees) === MAX_TILT;
        const outer = POINTER.length - 1;
        const inner = outer - (big ? 6 : 3.5);
        const a = pivot([0, DIAL_Y, -inner], degrees);
        const b = pivot([0, DIAL_Y, -outer], degrees);
        (big ? major : ticks).push(line(a, b));
    }
    const SCALE_PLATE = box(-14, 14, DIAL_Y - 1.5, DIAL_Y, 1);
    const DIAL = {
        plate: solid(SCALE_PLATE, DIAL_Z[0], DIAL_Z[1] - DIAL_Z[0], 4, 0.4),
        minor: ticks.join(''),
        major: major.join(''),
        // Two arcs bound the scale: the ticks hang from the outer one and the long ticks reach the inner one.
        rule: [POINTER.length - 1, POINTER.length - 7]
            .map(r => pathOf(Array.from({ length: 21 }, (_, index) => at(pivot([0, DIAL_Y, -r], -MAX_TILT + (index / 20) * MAX_TILT * 2)))))
            .join(''),
        screws: [at([-11, DIAL_Y, DIAL_Z[1] - 3]), at([11, DIAL_Y, DIAL_Z[1] - 3])],
    };

    // The beam: rebuilt every frame from its tilt, with a hook eye at each end and the pointer hanging from its middle.
    const beamOf = (tilt: number) => {
        const { half, rise, depth } = BEAM;
        const corners: Point3[] = [
            [-half, -depth, -rise],
            [half, -depth, -rise],
            [half, depth, -rise],
            [-half, depth, -rise],
            [-half, -depth, rise],
            [half, -depth, rise],
            [half, depth, rise],
            [-half, depth, rise],
        ].map(point => pivot(point as Point3, tilt));
        return hexahedron(corners, P);
    };
    const beamDetailOf = (tilt: number) => ({
        rib: line(pivot([-BEAM.half, BEAM.depth, 0], tilt), pivot([BEAM.half, BEAM.depth, 0], tilt)),
        eyes: [-HOOK_X, HOOK_X].map(x => at(pivot([x, BEAM.depth, HOOK_Z + 1.4], tilt))),
        pointer: line(pivot([0, POINTER.y, 0], tilt), pivot([0, POINTER.y, -POINTER.length], tilt)),
    });
    const BOSS = [at([0, POINTER.y, PIVOT_Z])];

    // A pan hangs level from three cords that meet at the hook; it is drawn at rest and moved with the beam's end.
    const panOf = (side: -1 | 1) => {
        const cx = side * HOOK_X;
        const hook: Point3 = [cx, 0, PIVOT_Z + HOOK_Z];
        // The cords on the viewer's side of the hook are drawn over the weights, the others under the pan.
        const cords = [90, 210, 330].map(degrees => {
            const a = (degrees * Math.PI) / 180;
            const end: Point3 = [cx + Math.cos(a) * (PAN_R - 2), Math.sin(a) * (PAN_R - 2), PAN_TOP];
            return { d: line(hook, end), near: depthOf(end, P) > depthOf([cx, 0, PAN_TOP], P) };
        });
        return {
            halo: cylinder(cx, 0, PAN_R, PAN_TOP - 3, 3).fill,
            pan: cylinder(cx, 0, PAN_R, PAN_TOP - 3, 3, 0.6, 40),
            rim: ring(cx, 0, PAN_R - 2, PAN_TOP, P, 40),
            back: cords.filter(cord => !cord.near).map(cord => cord.d).join(''),
            front: cords.filter(cord => cord.near).map(cord => cord.d).join(''),
            ends: [90, 210, 330].map(degrees => at([cx + Math.cos((degrees * Math.PI) / 180) * (PAN_R - 2), Math.sin((degrees * Math.PI) / 180) * (PAN_R - 2), PAN_TOP])),
            hook: at(hook),
        };
    };

    const byDepth = <T extends { x: number; y: number; z: number }>(list: T[], cx: number) =>
        list
            .map((item, index) => ({ ...item, index }))
            .sort((a, b) => a.z - b.z || depthOf([cx + a.x, a.y, 0], P) - depthOf([cx + b.x, b.y, 0], P));

    const OPINIONS = byDepth(OPINION_AT, -HOOK_X).map(({ x, y, z, index }) => ({
        index,
        body: cylinder(-HOOK_X + x, y, OPINION_R, PAN_TOP + z, OPINION_H, 0.6, 32),
        hole: ring(-HOOK_X + x, y, OPINION_R - 2.6, PAN_TOP + z + OPINION_H, P, 28),
        inner: ring(-HOOK_X + x, y, OPINION_R - 3.6, PAN_TOP + z + OPINION_H, P, 28),
    }));
    const USES = byDepth(USE_AT, HOOK_X).map(({ x, y, z, index }) => ({
        index,
        body: cylinder(HOOK_X + x, y, USE_R, PAN_TOP + z, USE_H, 0.4, 24),
        knob: at([HOOK_X + x, y, PAN_TOP + z + USE_H]),
    }));

    return { BASE_ART, DETAIL, STAND, DIAL, beamOf, beamDetailOf, BOSS, LEFT: panOf(-1), RIGHT: panOf(1), OPINIONS, USES };
}

export type Art = ReturnType<typeof artOf>;
