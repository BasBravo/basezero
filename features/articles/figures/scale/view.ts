import { boxCorners, type Plan } from '@/components/iso/iso-kit';
import { BASE_H, FOOT_H } from '../base';
import { elevationRange, projectionFor as fit, type Camera } from '../orbit';

export const WIDTH = 640;
export const HEIGHT = 340;
export const AZIMUTH = 80;
export const ELEVATION = 26;

export const BASE: Plan = { x: -150, y: -56, w: 300, d: 112, r: 9 };

/** The beam turns about a pivot on top of the post; the pans hang from its ends. */
export const PIVOT_Z = 120;
export const ARM = 104;
export const HANG = 60;
export const PAN_R = 26;

const CAMERA: Camera = {
    azimuth: AZIMUTH,
    elevation: ELEVATION,
    width: WIDTH,
    height: HEIGHT,
    pad: 22,
    points: [...boxCorners(BASE, -BASE_H - FOOT_H, 0), [-ARM - PAN_R, 0, PIVOT_Z + 24], [ARM + PAN_R, 0, PIVOT_Z + 24], [-ARM - PAN_R, -PAN_R, 30], [ARM + PAN_R, PAN_R, 30]],
};
export const CENTRE = { azimuth: AZIMUTH, elevation: ELEVATION, elevationRange: elevationRange(CAMERA) };
export const projectionFor = (azimuth: number, elevation: number) => fit(CAMERA, azimuth, elevation);
