// A pine plank, 1 m between supports, 200 mm wide and 30 mm thick, carrying a load at its middle.
export const SPAN_M = 1;
export const WIDTH_M = 0.2;
export const THICK_M = 0.03;
export const YOUNG = 10e9;
export const GRAVITY = 9.81;
export const PLATE_KG = 20;
export const PLATES = 10;
export const LIMIT_MM = 5;

const INERTIA = (WIDTH_M * THICK_M ** 3) / 12;

/** Sag at the middle of a simply supported beam with a point load: δ = F·L³ / (48·E·I), in millimetres. */
export const sagOf = (kg: number) => ((kg * GRAVITY * SPAN_M ** 3) / (48 * YOUNG * INERTIA)) * 1000;

export const loadOf = (plates: number) => plates * PLATE_KG;
export const passes = (plates: number) => sagOf(loadOf(plates)) <= LIMIT_MM;
export const mostPlates = () => {
    let plates = 0;
    while (plates < PLATES && passes(plates + 1)) plates++;
    return plates;
};

export const WIDTH = 640;
export const HEIGHT = 300;
export const GROUND = 256;
export const PLANK = { x0: 150, x1: 490, top: 150, thick: 14 };
export const PX_PER_MM = 7;
export const MID_X = (PLANK.x0 + PLANK.x1) / 2;

export const sagPx = (mm: number) => mm * PX_PER_MM;
export const limitY = PLANK.top + PLANK.thick + LIMIT_MM * PX_PER_MM;

/** Height of the plank's top face at `x`, with the middle sagging `drop` px (a parabola, as the real curve is close to one). */
export function topAt(x: number, drop: number) {
    const half = (PLANK.x1 - PLANK.x0) / 2;
    const k = (x - MID_X) / half;
    return PLANK.top + drop * (1 - k * k);
}
