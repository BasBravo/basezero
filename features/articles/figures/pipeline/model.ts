export const STEPS = 4;

/** How many steps in a row, from the first, are in place. */
export const reachOf = (present: readonly boolean[]) => {
    const missing = present.findIndex(item => !item);
    return missing < 0 ? present.length : missing;
};

/** The result gets back to the person only when every step is there. */
export const delivers = (present: readonly boolean[]) => reachOf(present) === present.length;

/** The first step that is missing, or -1. */
export const brokenAt = (present: readonly boolean[]) => (delivers(present) ? -1 : reachOf(present));

export const ALL: readonly boolean[] = Array.from({ length: STEPS }, () => true);
