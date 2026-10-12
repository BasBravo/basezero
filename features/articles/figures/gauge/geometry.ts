import { circleRing, dotGrid, extrude, insetPlan, onTop, pathOf, planOutline, radialTicks, ring, ringSeam, slabOf, type Flat, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { baseArtOf } from '../base';
import { atOf } from '../orbit';
import { angleOf, CHANGE_BELOW, START, STOP_BELOW, SWEEP, TEAMS, type Decision } from './model';
import { BASE, CALENDAR, CALENDAR_H, DIAL } from './view';

const TOP = DIAL.z;
const TICK_R = 58;
const BAND = [44, 47, 50] as const;
const PIN_R = 62;
const NEEDLE = { tail: -12, tip: 54, z: TOP + 1.2 };

/** A point on the dial face at angle `angle` (floor plane, from +x towards +y) and radius `r`. */
const onDial = (angle: number, r: number): Plane => [DIAL.x + Math.cos(angle) * r, DIAL.y + Math.sin(angle) * r];

export function artOf(P: Projection) {
    const at = atOf(P);
    const cylinder = (cx: number, cy: number, r: number, z: number, h: number, bevel = 0, steps = 40) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true, bevel });
    const arc = (from: number, to: number, r: number, z = TOP) => {
        const steps = Math.max(2, Math.ceil(Math.abs(to - from) / 0.05));
        return onTop(Array.from({ length: steps + 1 }, (_, index) => onDial(from + ((to - from) * index) / steps, r)), z, P);
    };

    const BASE_ART = baseArtOf(P, BASE);

    const PLATE: Plan = { x: BASE.x + 22, y: BASE.y + BASE.d - 24, w: 56, d: 11, r: 2 };
    const LABEL = {
        plate: slabOf(PLATE, 0, 0.8, P, 4),
        line: planOutline(insetPlan(PLATE, 1.6), 0.8, P),
        rule: [0, 1, 2].map(row => onTop([[PLATE.x + 8, PLATE.y + 3.4 + row * 2.1], [PLATE.x + (row === 1 ? 32 : 44), PLATE.y + 3.4 + row * 2.1]], 0.8, P)).join(''),
        screws: [at([PLATE.x + 3.5, PLATE.y + PLATE.d / 2, 0.8]), at([PLATE.x + PLATE.w - 3.5, PLATE.y + PLATE.d / 2, 0.8])],
    };

    // The drum: a foot ring, the body with a seam where the lid meets it, and the dial on top.
    const DRUM = {
        halo: cylinder(DIAL.x, DIAL.y, DIAL.r + 4, 0, TOP).fill,
        foot: cylinder(DIAL.x, DIAL.y, DIAL.r + 4, 0, 3, 0.4),
        body: cylinder(DIAL.x, DIAL.y, DIAL.r, 3, TOP - 3, 1.2),
        seam: ringSeam(circleRing(DIAL.x, DIAL.y, DIAL.r, 40), TOP - 6, P),
        bezel: ring(DIAL.x, DIAL.y, DIAL.r - 3.5, TOP, P, 48) + ring(DIAL.x, DIAL.y, DIAL.r - 6, TOP, P, 48),
    };

    // Every team is a major tick, with four minor ticks between; a short rule closes the scale at both ends.
    const ticks = radialTicks(DIAL.x, DIAL.y, TICK_R, TEAMS * 5, 5, TOP, [3, TICK_R - BAND[2]], P, START + Math.PI / 2, SWEEP);
    const SCALE = {
        minor: ticks.minor,
        major: ticks.major,
        rim: arc(START, START + SWEEP, TICK_R),
        // Small screws close the rim and the zone bands at both ends of the scale.
        stops: [0, TEAMS].flatMap(teams => [TICK_R, BAND[0], BAND[2]].map(r => at([...onDial(angleOf(teams), r), TOP]))),
    };

    // The three zones, as bands between the limits; the limits are screwed-in pins, set before anything was measured.
    const zone = (from: number, to: number) => BAND.map(r => arc(angleOf(from), angleOf(to), r)).join('');
    const limit = (teams: number) => onTop([onDial(angleOf(teams), BAND[0]), onDial(angleOf(teams), BAND[2])], TOP, P);
    const ZONES: Record<Decision, string> = {
        stop: zone(0, STOP_BELOW),
        change: zone(STOP_BELOW, CHANGE_BELOW),
        keep: zone(CHANGE_BELOW, TEAMS),
    };
    const ENDS = [limit(0), limit(STOP_BELOW), limit(CHANGE_BELOW), limit(TEAMS)].join('');
    const PINS = [STOP_BELOW, CHANGE_BELOW].map(teams => {
        const [x, y] = onDial(angleOf(teams), PIN_R);
        return { body: cylinder(x, y, 2, TOP, 5, 0.3, 16), head: at([x, y, TOP + 5]) };
    });

    // The needle: rebuilt every frame from its angle, with a counterweight tail. The hub sits on top of it.
    const needleOf = (teams: number): string => {
        const angle = angleOf(teams);
        const [cx, cy] = [Math.cos(angle), Math.sin(angle)];
        const [nx, ny] = [-cy, cx];
        const point = (along: number, across: number): Flat => at([DIAL.x + cx * along + nx * across, DIAL.y + cy * along + ny * across, NEEDLE.z]);
        return pathOf([point(NEEDLE.tail, -1.6), point(NEEDLE.tip - 6, -0.7), point(NEEDLE.tip, 0), point(NEEDLE.tip - 6, 0.7), point(NEEDLE.tail, 1.6)], true);
    };
    const HUB = {
        body: cylinder(DIAL.x, DIAL.y, 5.5, TOP, 3, 0.4, 24),
        cap: cylinder(DIAL.x, DIAL.y, 2.6, TOP + 3, 1, 0.2, 16),
    };

    // A desk calendar beside it: four weeks of days, with the day of the decision ringed.
    const GRID_X = CALENDAR.x + 7;
    const GRID_Y = CALENDAR.y + 10;
    const GAP = 4.6;
    const CAL = {
        halo: slabOf(CALENDAR, 0, CALENDAR_H, P, 4).fill,
        block: slabOf(CALENDAR, 0, CALENDAR_H, P, 4, 0.8),
        page: planOutline(insetPlan(CALENDAR, 3), CALENDAR_H, P, 4),
        binding: [0, 1, 2, 3].map(index => ring(CALENDAR.x + 9 + index * 8, CALENDAR.y + 5, 1.3, CALENDAR_H, P, 12)).join(''),
        rings: [0, 1, 2, 3].map(index => at([CALENDAR.x + 9 + index * 8, CALENDAR.y + 5, CALENDAR_H])),
        days: dotGrid(GRID_X, GRID_Y, 7, 4, GAP, CALENDAR_H, P),
        mark: ring(GRID_X + 6 * GAP, GRID_Y + 3 * GAP, 2.2, CALENDAR_H, P, 16),
    };

    return { BASE_ART, LABEL, DRUM, SCALE, ZONES, ENDS, PINS, needleOf, HUB, CAL };
}

export type Art = ReturnType<typeof artOf>;
