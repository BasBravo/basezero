import { boxCorners, type Plan } from '@/components/iso/iso-kit';
import { BASE_H, FOOT_H } from '../base';
import { elevationRange, projectionFor as fit, type Camera } from '../orbit';

export const WIDTH = 640;
export const HEIGHT = 340;
export const AZIMUTH = 40;
export const ELEVATION = 40;

export const BASE: Plan = { x: -120, y: -96, w: 240, d: 192, r: 9 };

/** The meter: a round drum whose top is the dial. */
export const DIAL = { x: -16, y: -14, r: 70, z: 30 };
export const CALENDAR: Plan = { x: 62, y: 46, w: 42, d: 34, r: 2 };
export const CALENDAR_H = 12;

const CAMERA: Camera = {
    azimuth: AZIMUTH,
    elevation: ELEVATION,
    width: WIDTH,
    height: HEIGHT,
    pad: 22,
    points: [...boxCorners(BASE, -BASE_H - FOOT_H, 0), ...boxCorners({ x: DIAL.x - 74, y: DIAL.y - 74, w: 148, d: 148, r: 0 }, 0, DIAL.z + 6)],
};
export const CENTRE = { azimuth: AZIMUTH, elevation: ELEVATION, elevationRange: elevationRange(CAMERA) };
export const projectionFor = (azimuth: number, elevation: number) => fit(CAMERA, azimuth, elevation);
