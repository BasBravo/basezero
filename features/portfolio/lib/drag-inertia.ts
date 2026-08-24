export const DRAG_SENSITIVITY = 0.009;
export const DRAG_VELOCITY_WINDOW_MS = 90;
export const DRAG_INERTIA_DAMPING = 3.1;
export const DRAG_INERTIA_MIN_SPEED = 0.04;
export const DRAG_INERTIA_MAX_SPEED = 9;
export const DRAG_INERTIA_MIN_DISTANCE = 2;
export const DRAG_VELOCITY_MIN_DURATION_MS = 16;

export type DragSample = {
    x: number;
    time: number;
};

export function rotationFromDragDelta(deltaX: number) {
    return deltaX * DRAG_SENSITIVITY;
}

export function pushDragSample(
    samples: DragSample[],
    x: number,
    time: number,
    windowMs = DRAG_VELOCITY_WINDOW_MS,
) {
    samples.push({ x, time });
    const cutoff = time - windowMs;
    let dropCount = 0;
    while (dropCount < samples.length - 1 && samples[dropCount + 1].time < cutoff) {
        dropCount += 1;
    }
    if (dropCount > 0) samples.splice(0, dropCount);
}

export function releaseDragVelocity(samples: readonly DragSample[]) {
    if (samples.length < 2) return 0;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const distance = last.x - first.x;
    if (Math.abs(distance) < DRAG_INERTIA_MIN_DISTANCE) return 0;
    const dt = Math.max(last.time - first.time, DRAG_VELOCITY_MIN_DURATION_MS);
    const velocity = (distance / dt) * 1000 * DRAG_SENSITIVITY;
    if (Math.abs(velocity) < DRAG_INERTIA_MIN_SPEED) return 0;
    return Math.max(-DRAG_INERTIA_MAX_SPEED, Math.min(DRAG_INERTIA_MAX_SPEED, velocity));
}

export function stepDragInertia(rotation: number, velocity: number, delta: number) {
    if (delta <= 0 || velocity === 0) return { rotation, velocity };

    const decay = Math.exp(-DRAG_INERTIA_DAMPING * delta);
    const nextRotation = rotation + (velocity * (1 - decay)) / DRAG_INERTIA_DAMPING;
    const nextVelocity = velocity * decay;

    if (Math.abs(nextVelocity) < DRAG_INERTIA_MIN_SPEED) {
        return { rotation: nextRotation, velocity: 0 };
    }

    return { rotation: nextRotation, velocity: nextVelocity };
}
