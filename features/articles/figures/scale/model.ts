// Two kinds of signal on one balance. Opinions and visits are big and hollow; real use (coming back, sharing it, missing it)
// is small and solid. On this balance one sign of real use weighs as much as four opinions.
export const OPINION = 1;
export const USE = 4;
export const MAX_OPINIONS = 6;
export const MAX_USES = 4;

/** The beam stops against its end stops at this tilt, in degrees. */
export const MAX_TILT = 10;
/** How far one unit of difference tips the beam: tan θ = K · (right − left), from the torque on a beam whose centre of mass hangs below the pivot. */
export const K = 0.045;

export interface Pans {
    opinions: number;
    uses: number;
}

export const weightOf = ({ opinions, uses }: Pans) => ({ left: opinions * OPINION, right: uses * USE });

/** The beam's tilt in degrees; positive means the right pan, real use, is lower. */
export function tiltOf(pans: Pans) {
    const { left, right } = weightOf(pans);
    const free = (Math.atan(K * (right - left)) * 180) / Math.PI;
    return Math.min(MAX_TILT, Math.max(-MAX_TILT, free));
}

export type Heavier = 'left' | 'right' | 'even';

export function heavierOf(pans: Pans): Heavier {
    const { left, right } = weightOf(pans);
    if (left === right) return 'even';
    return right > left ? 'right' : 'left';
}

/** Rotates a point given relative to the pivot by the beam's tilt about the y axis; positive tilt lowers +x. */
export function tilted([x, y, z]: [number, number, number], degrees: number): [number, number, number] {
    const t = (degrees * Math.PI) / 180;
    return [x * Math.cos(t) + z * Math.sin(t), y, -x * Math.sin(t) + z * Math.cos(t)];
}
