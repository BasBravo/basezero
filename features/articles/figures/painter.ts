import { towardViewer, type Projection } from '@/components/iso/iso-kit';

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

/** Far to near, by separating planes where there is one and by centre depth where there is not. */
export function ordered<T>(layers: Layer<T>[], P: Projection): Layer<T>[] {
    const v = viewOf(P);
    const count = layers.length;
    const before: Set<number>[] = layers.map(() => new Set());
    const index = new Map(layers.map((layer, position) => [layer.id, position]));
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            if (layers[i]!.ignore?.includes(layers[j]!.id) || layers[j]!.ignore?.includes(layers[i]!.id)) continue;
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
    while (done.size < count) {
        let pick = -1;
        for (let i = 0; i < count; i++) {
            if (done.has(i) || [...before[i]!].some(other => !done.has(other))) continue;
            if (pick < 0 || depth[i]! < depth[pick]!) pick = i;
        }
        if (pick < 0) for (let i = 0; i < count; i++) if (!done.has(i) && (pick < 0 || depth[i]! < depth[pick]!)) pick = i;
        done.add(pick);
        out.push(layers[pick]!);
    }
    return out;
}
