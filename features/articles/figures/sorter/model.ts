export type Shape = 'circle' | 'square' | 'triangle' | 'hexagon';

export const SHAPES: readonly Shape[] = ['circle', 'square', 'triangle', 'hexagon'];
export const TARGET = 3;
export const fits = (piece: number) => piece === TARGET;

// World units: x across the tray, y front to back, z up.
export const HOLE = { x: 0, y: -30 };
export const HOLE_R = 26;
export const TOP = 40;
export const PIECE_H = 30;
export const TRAY_Y = 60;
export const REST_Z = 2;
export const HOVER = 54;
export const CRUISE = 60;
export const trayX = (piece: number) => -105 + piece * 70;

export const MOVE = 0.7;
export const PRESS = 0.3;
export const BUMP = 0.5;
export const BACK = 0.7;
export const SINK = 0.7;

export const durationOf = (piece: number) => (fits(piece) ? MOVE + PRESS + SINK : MOVE + PRESS + BUMP + BACK);

const ease = (t: number) => {
    const u = Math.min(1, Math.max(0, t));
    return u * u * (3 - 2 * u);
};
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export interface Pose {
    x: number;
    y: number;
    /** Height of the piece's underside. */
    z: number;
    /** True once the piece's underside is below the top of the block, so it has to be clipped by the hole. */
    sunk: boolean;
}

/** Where a piece is, `t` seconds after it was chosen. A wrong piece lands on the block, rattles and goes back; the right one goes in and stays. */
export function poseOf(piece: number, t: number): Pose {
    const home = { x: trayX(piece), y: TRAY_Y, z: REST_Z };
    if (t <= 0) return { ...home, sunk: false };
    if (t < MOVE) {
        const rise = ease(t / (MOVE * 0.3));
        const glide = ease((t - MOVE * 0.3) / (MOVE * 0.7));
        return { x: lerp(home.x, HOLE.x, glide), y: lerp(home.y, HOLE.y, glide), z: lerp(home.z, CRUISE, rise) + (HOVER - CRUISE) * glide, sunk: false };
    }
    const press = ease((t - MOVE) / PRESS);
    if (fits(piece)) {
        const sink = ease((t - MOVE - PRESS) / SINK);
        const z = lerp(HOVER, HOVER - 6, press) - (HOVER - 6 - (TOP - PIECE_H)) * sink;
        return { x: HOLE.x, y: HOLE.y, z, sunk: z < TOP };
    }
    const bump = t - MOVE - PRESS;
    const landed = lerp(HOVER, TOP + 0.5, press);
    if (bump < BUMP) {
        const shake = Math.sin((bump / BUMP) * Math.PI * 4) * 3 * (1 - bump / BUMP);
        return { x: HOLE.x + shake, y: HOLE.y, z: landed, sunk: false };
    }
    const k = (bump - BUMP) / BACK;
    const glide = ease(k / 0.7);
    const drop = ease((k - 0.7) / 0.3);
    return { x: lerp(HOLE.x, home.x, glide), y: lerp(HOLE.y, home.y, glide), z: k < 0.7 ? lerp(TOP + 0.5, CRUISE, ease(k / 0.25)) : lerp(CRUISE, home.z, drop), sunk: false };
}
