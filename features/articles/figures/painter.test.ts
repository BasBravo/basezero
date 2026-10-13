import { describe, expect, it } from 'vitest';
import { ordered, type Box } from './painter';

const P = (azimuth: number, elevation = 35) => ({ origin: [0, 0] as [number, number], scale: 1, azimuth, elevation });
const layer = (id: string, box: Box, extra = {}) => ({ id, box, node: id, ...extra });
const ids = (list: { id: string }[]) => list.map(item => item.id);

describe('painter', () => {
    const row = [layer('far', [-30, -20, 0, 10, 0, 10]), layer('middle', [-5, 5, 0, 10, 0, 10]), layer('near', [20, 30, 0, 10, 0, 10])];

    it('paints along x from far to near for a viewer on the +x side, and the reverse from the other side', () => {
        expect(ids(ordered([...row].reverse(), P(40)))).toEqual(['far', 'middle', 'near']);
        expect(ids(ordered(row, P(140)))).toEqual(['near', 'middle', 'far']);
    });

    it('paints what is higher later, and what is further in front later', () => {
        const stack = [layer('top', [0, 10, 0, 10, 10, 20]), layer('bottom', [0, 10, 0, 10, 0, 10])];
        expect(ids(ordered(stack, P(50)))).toEqual(['bottom', 'top']);
        const depth = [layer('front', [0, 10, 20, 30, 0, 10]), layer('back', [0, 10, 0, 10, 0, 10])];
        expect(ids(ordered(depth, P(70)))).toEqual(['back', 'front']);
        expect(ids(ordered(depth, P(-70)))).toEqual(['front', 'back']);
    });

    it('honours forced orders for overlapping layers and survives a cycle', () => {
        const overlap = [layer('piece', [0, 10, 0, 10, 0, 10], { after: ['block'] }), layer('block', [0, 10, 0, 10, 0, 10])];
        expect(ids(ordered(overlap, P(50)))).toEqual(['block', 'piece']);
        const cycle = [layer('a', [0, 1, 0, 1, 0, 1], { after: ['b'] }), layer('b', [0, 1, 0, 1, 0, 1], { after: ['a'] })];
        expect(ordered(cycle, P(50))).toHaveLength(2);
    });

    it('ignores pairs that never cover each other, so they cannot scramble the rest (a train at a corner)', () => {
        // The train at the back-left corner of a circuit, beside a building it never covers: planes x and y disagree about
        // that pair, and ordering it anyway used to close a cycle that painted the train under its own track.
        const scene = [
            layer('track-back', [-90, 90, -46, -26, 0, 2]),
            layer('track-left', [-90, -70, -26, 26, 0, 2]),
            layer('building', [-70, -34, -70, -52, 0, 14]),
            layer('train', [-90, -70, -46, -26, 2, 19]),
        ];
        const along = [...scene.slice(0, 3), layer('train', [-70, -50, -46, -26, 2, 19])];
        for (const azimuth of [8, 30, 58, 90, 108]) {
            for (const layers of [scene, along]) {
                const order = ids(ordered(layers, P(azimuth, 38)));
                expect(order.indexOf('train')).toBeGreaterThan(order.indexOf('track-back'));
            }
            const order = ids(ordered(along, P(azimuth, 38)));
            expect(order.indexOf('train')).toBeGreaterThan(order.indexOf('building'));
        }
    });
});
