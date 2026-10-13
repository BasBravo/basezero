import { iso, towardViewer, type Flat, type Projection } from '@/components/iso/iso-kit';

export type Box = [number, number, number, number, number, number];

export interface Layer<T> {
    id: string;
    box: Box;
    node: T;
    /** Drawn after these layers whatever their boxes say (a piece standing in a hole, a plate on a plank). */
    after?: string[];
    /** Pairs this layer is not ordered against; the figure fixes them another way (a clip). */
    ignore?: string[];
}

const EPS = 1e-6;
/** Screen footprints closer than this (in px) count as touching, not overlapping: a tile beside a tile, a train on its bed. */
const TOUCH = 0.5;

/** The direction to the viewer: a layer further along it is nearer and is painted later. */
export function viewOf(P: Projection): [number, number, number] {
    const [vx, vy] = towardViewer(P);
    const e = ((P.elevation ?? 30) * Math.PI) / 180;
    return [vx * Math.cos(e), vy * Math.cos(e), Math.sin(e)];
}

const centreDepth = (box: Box, v: [number, number, number]) => ((box[0] + box[1]) / 2) * v[0] + ((box[2] + box[3]) / 2) * v[1] + ((box[4] + box[5]) / 2) * v[2];

/** +1 when `a` is nearer than `b`, −1 when `b` is nearer, 0 when no plane separates them. A separating plane orders two convex bodies for any view. */
function nearer(a: Box, b: Box, v: [number, number, number]) {
    for (let axis = 0; axis < 3; axis++) {
        if (Math.abs(v[axis]!) < 1e-4) continue;
        const aLow = a[axis * 2]!;
        const aHigh = a[axis * 2 + 1]!;
        const bLow = b[axis * 2]!;
        const bHigh = b[axis * 2 + 1]!;
        if (aHigh <= bLow + EPS) return v[axis]! > 0 ? -1 : 1;
        if (bHigh <= aLow + EPS) return v[axis]! > 0 ? 1 : -1;
    }
    return 0;
}

/** The convex outline a box casts on the screen (monotone chain over its eight corners). */
function footprint(box: Box, P: Projection): Flat[] {
    const corners: Flat[] = [];
    for (const x of [box[0], box[1]]) for (const y of [box[2], box[3]]) for (const z of [box[4], box[5]]) corners.push(iso([x, y, z], P));
    corners.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const half = (points: Flat[]) => {
        const out: Flat[] = [];
        for (const point of points) {
            while (out.length >= 2 && cross(out[out.length - 2]!, out[out.length - 1]!, point) <= 0) out.pop();
            out.push(point);
        }
        out.pop();
        return out;
    };
    return [...half(corners), ...half([...corners].reverse())];
}

/** Separating-axis test on two convex outlines: true only when they share more than an edge. */
function overlap(a: Flat[], b: Flat[]) {
    for (const shape of [a, b]) {
        for (let i = 0; i < shape.length; i++) {
            const p = shape[i]!;
            const q = shape[(i + 1) % shape.length]!;
            const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
            if (length < EPS) continue;
            const nx = (p[1] - q[1]) / length;
            const ny = (q[0] - p[0]) / length;
            let aMin = Infinity;
            let aMax = -Infinity;
            let bMin = Infinity;
            let bMax = -Infinity;
            for (const [x, y] of a) {
                const d = x * nx + y * ny;
                aMin = Math.min(aMin, d);
                aMax = Math.max(aMax, d);
            }
            for (const [x, y] of b) {
                const d = x * nx + y * ny;
                bMin = Math.min(bMin, d);
                bMax = Math.max(bMax, d);
            }
            if (aMax <= bMin + TOUCH || bMax <= aMin + TOUCH) return false;
        }
    }
    return true;
}

/**
 * Far to near. Only layers whose outlines overlap on the screen are ordered against each other, by a separating plane; pairs
 * that never cover one another add no constraint, so they can't close a cycle that would scramble the rest. What is left
 * free goes by centre depth.
 */
export function ordered<T>(layers: Layer<T>[], P: Projection): Layer<T>[] {
    const v = viewOf(P);
    const count = layers.length;
    const before: Set<number>[] = layers.map(() => new Set());
    const index = new Map(layers.map((layer, position) => [layer.id, position]));
    const outlines = layers.map(layer => footprint(layer.box, P));
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            if (layers[i]!.ignore?.includes(layers[j]!.id) || layers[j]!.ignore?.includes(layers[i]!.id)) continue;
            if (!overlap(outlines[i]!, outlines[j]!)) continue;
            const side = nearer(layers[i]!.box, layers[j]!.box, v);
            if (side > 0) before[i]!.add(j);
            else if (side < 0) before[j]!.add(i);
        }
        for (const id of layers[i]!.after ?? []) {
            const other = index.get(id);
            if (other !== undefined) before[i]!.add(other);
        }
    }
    const depth = layers.map(layer => centreDepth(layer.box, v));
    const done = new Set<number>();
    const out: Layer<T>[] = [];
    const waiting = (i: number) => [...before[i]!].filter(other => !done.has(other)).length;
    while (done.size < count) {
        let pick = -1;
        for (let i = 0; i < count; i++) {
            if (done.has(i) || waiting(i)) continue;
            if (pick < 0 || depth[i]! < depth[pick]!) pick = i;
        }
        // A true cycle (only forced orders can make one now): break it where the fewest constraints are left unmet.
        if (pick < 0)
            for (let i = 0; i < count; i++) {
                if (done.has(i)) continue;
                if (pick < 0 || waiting(i) < waiting(pick) || (waiting(i) === waiting(pick) && depth[i]! < depth[pick]!)) pick = i;
            }
        done.add(pick);
        out.push(layers[pick]!);
    }
    return out;
}
