export const MIN_TICK_COUNT = 13;
export const TICK_STRIDE_PX = 8;
export const TICK_MIN_WIDTH_PX = 6;
export const TICK_MAX_WIDTH_PX = 16;
export const TICK_MIN_OPACITY = 0.14;
export const TICK_MAX_OPACITY = 1;
export const LENS_SIGMA = 1.65;

export function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}

export function tickCountForHeight(height: number) {
    if (!Number.isFinite(height) || height <= 0) return MIN_TICK_COUNT;
    return Math.max(MIN_TICK_COUNT, Math.round(height / TICK_STRIDE_PX));
}

export function tickAppearance(index: number, progress: number, tickCount: number) {
    const lastIndex = Math.max(tickCount - 1, 1);
    const focus = clamp01(progress) * lastIndex;
    const distance = Math.abs(index - focus);
    const falloff = Math.exp(-(distance * distance) / (2 * LENS_SIGMA * LENS_SIGMA));
    const filled = clamp01(focus - index + 1);

    return {
        width: TICK_MIN_WIDTH_PX + (TICK_MAX_WIDTH_PX - TICK_MIN_WIDTH_PX) * falloff,
        opacity: TICK_MIN_OPACITY + (TICK_MAX_OPACITY - TICK_MIN_OPACITY) * filled,
    };
}
