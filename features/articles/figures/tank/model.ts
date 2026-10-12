export const CAP = 100;
export const TARGET = 75;
/** Water added by one bucket, and how fast it runs in (units per second). */
export const BUCKET = 14;
export const POUR_RATE = 30;
/** Share of the water that leaks away each second while the leak is open. */
export const LEAK = 0.2;

export interface Tank {
    level: number;
    /** Water from buckets that is still running in. */
    pending: number;
    buckets: number;
}

export const EMPTY: Tank = { level: 0, pending: 0, buckets: 0 };

export const pour = (tank: Tank): Tank => ({ ...tank, pending: tank.pending + BUCKET, buckets: tank.buckets + 1 });

export function step(tank: Tank, dt: number, leaking: boolean): Tank {
    const added = Math.min(tank.pending, POUR_RATE * dt);
    const lost = leaking ? LEAK * tank.level * dt : 0;
    return { level: Math.min(CAP, Math.max(0, tank.level + added - lost)), pending: tank.pending - added, buckets: tank.buckets };
}

export const reached = (tank: Tank) => tank.level >= TARGET - 0.5;
export const pouring = (tank: Tank) => tank.pending > 0.05;
export const percent = (tank: Tank) => Math.round(tank.level);

/** Lets the model run for `seconds` in small steps. */
export function run(tank: Tank, seconds: number, leaking: boolean, dt = 1 / 30): Tank {
    let now = tank;
    for (let t = 0; t < seconds; t += dt) now = step(now, dt, leaking);
    return now;
}
