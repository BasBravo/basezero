export type Branch = 0 | 1;

/** The station with the flag. The switch can be set to either branch, but only this one is where the train was meant to go. */
export const DESTINATION: Branch = 0;
export const BRANCHES: readonly Branch[] = [0, 1];
export const arrives = (branch: Branch) => branch === DESTINATION;

// World units: x along the line, y front to back (negative is the back), z up.
/** Where the engine waits, far enough from the buffer for its wagon to stand behind it. */
export const START: [number, number] = [-128, 0];
export const JUNCTION_X = -20;
export const BRANCH_Y = [-44, 44] as const;
export const STOP_X = 122;

export const routeOf = (branch: Branch): [number, number][] => [START, [JUNCTION_X, 0], [JUNCTION_X, BRANCH_Y[branch]], [STOP_X, BRANCH_Y[branch]]];

const SPEED = 80;
const DWELL = 0.9;
const BACK_SPEED = 170;

const length = (route: [number, number][]) => route.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - route[index]![0], point[1] - route[index]![1]), 0);

/** Where a point `distance` along the route lies. Before the start it carries on straight back towards the buffer. */
function along(route: [number, number][], distance: number): [number, number] {
    if (distance < 0) {
        const [from, to] = [route[0]!, route[1]!];
        const run = Math.hypot(to[0] - from[0], to[1] - from[1]);
        return [from[0] + ((to[0] - from[0]) * distance) / run, from[1] + ((to[1] - from[1]) * distance) / run];
    }
    let left = distance;
    for (let index = 1; index < route.length; index++) {
        const from = route[index - 1]!;
        const to = route[index]!;
        const run = Math.hypot(to[0] - from[0], to[1] - from[1]);
        if (left <= run) return [from[0] + ((to[0] - from[0]) * left) / run, from[1] + ((to[1] - from[1]) * left) / run];
        left -= run;
    }
    return route[route.length - 1]!;
}

export const goTime = (branch: Branch) => length(routeOf(branch)) / SPEED;
export const durationOf = (branch: Branch) => goTime(branch) + DWELL + length(routeOf(branch)) / BACK_SPEED;

export interface Pose {
    x: number;
    y: number;
    /** True from the moment the train reaches the end of the line until it is back at the start. */
    arrived: boolean;
}

/** The train `t` seconds after it was sent: it runs along the track, waits at the station and comes back. */
export function poseOf(branch: Branch, t: number): Pose {
    const route = routeOf(branch);
    const total = length(route);
    const go = goTime(branch);
    if (t <= 0) return { x: START[0], y: START[1], arrived: false };
    if (t < go) {
        const [x, y] = along(route, t * SPEED);
        return { x, y, arrived: false };
    }
    if (t < go + DWELL) {
        const [x, y] = along(route, total);
        return { x, y, arrived: true };
    }
    const [x, y] = along(route, Math.max(0, total - (t - go - DWELL) * BACK_SPEED));
    return { x, y, arrived: true };
}

/** How far along its route the engine is `t` seconds after it was sent. */
export function distanceOf(branch: Branch, t: number): number {
    const total = length(routeOf(branch));
    const go = goTime(branch);
    if (t <= 0) return 0;
    if (t < go) return t * SPEED;
    if (t < go + DWELL) return total;
    return Math.max(0, total - (t - go - DWELL) * BACK_SPEED);
}

/** A car `behind` units back along the route from the engine, and the way its stretch of track runs (it faces the way out, even when the train backs home). */
export function carAt(branch: Branch, distance: number, behind = 0): { x: number; y: number; dx: number; dy: number } {
    const route = routeOf(branch);
    const at = distance - behind;
    const [x, y] = along(route, at);
    let left = Math.max(0, at);
    for (let index = 1; index < route.length; index++) {
        const from = route[index - 1]!;
        const to = route[index]!;
        const run = Math.hypot(to[0] - from[0], to[1] - from[1]);
        if (left < run || index === route.length - 1) return { x, y, dx: to[0] - from[0], dy: to[1] - from[1] };
        left -= run;
    }
    return { x, y, dx: 1, dy: 0 };
}
