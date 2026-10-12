export type Shape = 'circle' | 'square' | 'triangle' | 'hexagon';

export const SHAPES: readonly Shape[] = ['circle', 'square', 'triangle', 'hexagon'];
export const TARGET = 3;

export const fits = (piece: number) => piece === TARGET;

export const WIDTH = 640;
export const HEIGHT = 300;
export const HOLE = { x: 320, y: 104 };
export const TRAY_Y = 252;
export const trayX = (piece: number) => 140 + piece * 120;

export const MOVE = 0.62;
export const PRESS = 0.28;
export const BUMP = 0.5;
export const BACK = 0.62;
export const SINK = 0.55;

export const durationOf = (piece: number) => (fits(piece) ? MOVE + PRESS + SINK : MOVE + PRESS + BUMP + BACK);

const ease = (t: number) => {
    const u = Math.min(1, Math.max(0, t));
    return u * u * (3 - 2 * u);
};
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export interface Pose {
    x: number;
    y: number;
    scale: number;
    /** `in` once the piece has gone through the hole. */
    inside: boolean;
}

/** Where a piece is, `t` seconds after it was chosen. Wrong pieces bump the hole and go back; the right one sinks in and stays. */
export function poseOf(piece: number, t: number): Pose {
    const home = { x: trayX(piece), y: TRAY_Y };
    if (t <= 0) return { ...home, scale: 1, inside: false };
    if (t < MOVE) {
        const k = ease(t / MOVE);
        return { x: lerp(home.x, HOLE.x, k), y: lerp(home.y, HOLE.y, k) - Math.sin(k * Math.PI) * 18, scale: 1, inside: false };
    }
    const press = ease((t - MOVE) / PRESS);
    if (fits(piece)) {
        const sink = ease((t - MOVE - PRESS) / SINK);
        return { x: HOLE.x, y: HOLE.y, scale: lerp(1, 0.92, press) - 0.14 * sink, inside: t >= MOVE + PRESS + SINK };
    }
    const bump = t - MOVE - PRESS;
    if (bump < BUMP) {
        const shake = Math.sin((bump / BUMP) * Math.PI * 4) * 5 * (1 - bump / BUMP);
        return { x: HOLE.x + shake, y: HOLE.y, scale: lerp(1, 0.92, press), inside: false };
    }
    const k = ease((bump - BUMP) / BACK);
    return { x: lerp(HOLE.x, home.x, k), y: lerp(HOLE.y, home.y, k) - Math.sin(k * Math.PI) * 18, scale: lerp(0.92, 1, k), inside: false };
}

export const attemptsOf = (piece: number) => piece + 1;
