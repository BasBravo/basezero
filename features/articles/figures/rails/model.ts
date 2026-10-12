export type Branch = 0 | 1;

/** The station with the flag. The switch can be set to either branch, but only this one is where the train was meant to go. */
export const DESTINATION: Branch = 0;
export const BRANCHES: readonly Branch[] = [0, 1];
export const arrives = (branch: Branch) => branch === DESTINATION;

// World units: x along the line, y front to back (negative is the back), z up.
export const START: [number, number] = [-150, 0];
export const JUNCTION_X = -20;
export const BRANCH_Y = [-44, 44] as const;
export const STOP_X = 122;

export const routeOf = (branch: Branch): [number, number][] => [START, [JUNCTION_X, 0], [JUNCTION_X, BRANCH_Y[branch]], [STOP_X, BRANCH_Y[branch]]];

const SPEED = 80;
const DWELL = 0.9;
const BACK_SPEED = 170;

const length = (route: [number, number][]) => route.slice(1).reduce((sum, point, index) => sum + Math.hypot(point[0] - route[index]![0], point[1] - route[index]![1]), 0);

/** Where a point `distance` along the route lies. */
function along(route: [number, number][], distance: number): [number, number] {
    let left = Math.max(0, distance);
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
    const [x, y] = along(route, total - (t - go - DWELL) * BACK_SPEED);
    return { x, y, arrived: true };
}
