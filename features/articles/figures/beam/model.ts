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

// World units: the drawing exaggerates the sag so it can be seen.
export const UNITS_PER_MM = 4;
export const HALF = 135;
export const REST_Z = 56;
export const THICK = 8;
export const DEPTH = 24;
export const limitZ = REST_Z - LIMIT_MM * UNITS_PER_MM;

export const dropOf = (mm: number) => mm * UNITS_PER_MM;

/** Height of the plank's underside at `x`, with the middle sagging `drop` units (a parabola, close to the real curve). */
export function undersideAt(x: number, drop: number) {
    const k = x / HALF;
    return REST_Z - drop * (1 - k * k);
}
