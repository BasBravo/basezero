// World units: x across, y front to back (positive is the front), z up. The train runs round a rectangular circuit.
export const HALF_X = 80;
export const HALF_Y = 36;
export const PATH: [number, number][] = [
    [-HALF_X, -HALF_Y],
    [HALF_X, -HALF_Y],
    [HALF_X, HALF_Y],
    [-HALF_X, HALF_Y],
];
export const LENGTH = 2 * (2 * HALF_X + 2 * HALF_Y);
export const SPEED = 70;

/** The stretch of the front side that can be taken away, as distance along the circuit, and its tile on the ground. */
export const GAP = [292, 332] as const;
export const GAP_TILE = { x0: -20, x1: 20 };
/** Where the train waits when the circuit is cut: a train's length short of the gap. */
export const STOP = GAP[0] - 14;

export function pointAt(distance: number): [number, number] {
    let left = ((distance % LENGTH) + LENGTH) % LENGTH;
    for (let index = 0; index < PATH.length; index++) {
        const from = PATH[index]!;
        const to = PATH[(index + 1) % PATH.length]!;
        const run = Math.hypot(to[0] - from[0], to[1] - from[1]);
        if (left <= run) return [from[0] + ((to[0] - from[0]) * left) / run, from[1] + ((to[1] - from[1]) * left) / run];
        left -= run;
    }
    return PATH[0]!;
}

/** The train keeps going round; with a tile missing it stops before it and goes on again when the tile is back. */
export function advance(distance: number, dt: number, cut: boolean): number {
    let next = distance + SPEED * dt;
    if (cut && distance <= STOP) next = Math.min(next, STOP);
    return next >= LENGTH ? next - LENGTH : next;
}

export const stoppedAt = (distance: number, cut: boolean) => cut && distance >= STOP - 0.01 && distance <= STOP + 0.01;
