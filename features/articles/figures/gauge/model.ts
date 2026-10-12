// The limits written before launch, from the article: eight teams try the tool for a month. If fewer than half still
// use it in the third week, we change it; if fewer than two do, we stop.
export const TEAMS = 8;
export const STOP_BELOW = 2;
export const CHANGE_BELOW = 4;

export type Decision = 'stop' | 'change' | 'keep';

export function decisionOf(active: number): Decision {
    if (active < STOP_BELOW) return 'stop';
    if (active < CHANGE_BELOW) return 'change';
    return 'keep';
}

export const clampTeams = (value: number) => Math.min(TEAMS, Math.max(0, Math.round(value)));

/** The dial sweeps 240° in the plane of its face, through the side away from the viewer at the centre view. */
export const SWEEP = (240 * Math.PI) / 180;
/** Angle in the floor plane, measured from +x towards +y, where the needle points at zero teams. */
export const START = (100 * Math.PI) / 180;

export const angleOf = (teams: number) => START + (Math.min(TEAMS, Math.max(0, teams)) / TEAMS) * SWEEP;

/** One step of a damped spring that carries the needle towards `goal`; slightly underdamped, so it settles like a real meter. */
export function springStep(state: { value: number; speed: number }, goal: number, dt: number) {
    const stiffness = 90;
    const damping = 13;
    const speed = state.speed + (stiffness * (goal - state.value) - damping * state.speed) * dt;
    return { value: state.value + speed * dt, speed };
}
