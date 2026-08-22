import { describe, expect, it } from 'vitest';
import {
    DRAG_INERTIA_DAMPING,
    DRAG_INERTIA_MAX_SPEED,
    DRAG_SENSITIVITY,
    DRAG_VELOCITY_WINDOW_MS,
    pushDragSample,
    releaseDragVelocity,
    rotationFromDragDelta,
    stepDragInertia,
    type DragSample,
} from './drag-inertia';

describe('drag-inertia', () => {
    it('convierte el desplazamiento horizontal con la misma sensibilidad del arrastre', () => {
        expect(rotationFromDragDelta(120)).toBeCloseTo(120 * DRAG_SENSITIVITY, 8);
        expect(rotationFromDragDelta(-40)).toBeCloseTo(-40 * DRAG_SENSITIVITY, 8);
    });

    it('estima la velocidad de suelta a partir de la ventana reciente', () => {
        const samples: DragSample[] = [
            { x: 100, time: 1000 },
            { x: 148, time: 1080 },
        ];

        expect(releaseDragVelocity(samples)).toBeCloseTo(((48 / 80) * 1000) * DRAG_SENSITIVITY, 8);
    });

    it('conserva el signo en un flick hacia la izquierda', () => {
        expect(
            releaseDragVelocity([
                { x: 200, time: 0 },
                { x: 152, time: 80 },
            ]),
        ).toBeCloseTo(((-48 / 80) * 1000) * DRAG_SENSITIVITY, 8);
    });

    it('ignora impulsos sin recorrido o demasiado cortos', () => {
        expect(releaseDragVelocity([])).toBe(0);
        expect(releaseDragVelocity([{ x: 10, time: 1 }])).toBe(0);
        expect(
            releaseDragVelocity([
                { x: 0, time: 0 },
                { x: 40, time: 10 },
            ]),
        ).toBe(0);
    });

    it('descarta impulsos por debajo de la velocidad mínima', () => {
        expect(
            releaseDragVelocity([
                { x: 0, time: 0 },
                { x: 0.2, time: 80 },
            ]),
        ).toBe(0);
    });

    it('limita la velocidad máxima de inercia', () => {
        const samples: DragSample[] = [
            { x: 0, time: 0 },
            { x: 4000, time: 80 },
        ];

        expect(releaseDragVelocity(samples)).toBe(DRAG_INERTIA_MAX_SPEED);
    });

    it('conserva una muestra de base al recortar la ventana', () => {
        const samples: DragSample[] = [];
        pushDragSample(samples, 0, 0);
        pushDragSample(samples, 20, 40);
        pushDragSample(samples, 80, 40 + DRAG_VELOCITY_WINDOW_MS + 10);

        expect(samples[0]).toEqual({ x: 20, time: 40 });
        expect(samples.at(-1)).toEqual({ x: 80, time: 40 + DRAG_VELOCITY_WINDOW_MS + 10 });
    });

    it('sigue el sentido del impulso y lo frena de forma exponencial', () => {
        const delta = 0.2;
        const started = stepDragInertia(1.2, 4, delta);

        expect(started.rotation).toBeGreaterThan(1.2);
        expect(started.velocity).toBeCloseTo(4 * Math.exp(-DRAG_INERTIA_DAMPING * delta), 8);
        expect(started.velocity).toBeLessThan(4);
        expect(started.velocity).toBeGreaterThan(0);
    });

    it('se detiene al caer por debajo de la velocidad mínima', () => {
        const settled = stepDragInertia(0, 0.03, 1 / 60);

        expect(settled.velocity).toBe(0);
        expect(settled.rotation).toBeGreaterThan(0);
    });
});
