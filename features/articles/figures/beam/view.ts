import { boxCorners, type Plan } from '@/components/iso/iso-kit';
import { elevationRange, projectionFor as fit, type Camera } from '../orbit';

export const WIDTH = 640;
export const HEIGHT = 340;
export const AZIMUTH = 52;
export const ELEVATION = 34;

export const BASE: Plan = { x: -196, y: -84, w: 392, d: 168, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

export const SUPPORT_X = 110;
export const SUPPORT_W = 40;
export const SUPPORT_Y = 32;

const CAMERA: Camera = { azimuth: AZIMUTH, elevation: ELEVATION, width: WIDTH, height: HEIGHT, pad: 22, points: [...boxCorners(BASE, -BASE_H - FOOT_H, 0), [-172, 0, 132], [172, 0, 132]] };
export const CENTRE = { azimuth: AZIMUTH, elevation: ELEVATION, elevationRange: elevationRange(CAMERA) };
export const projectionFor = (azimuth: number, elevation: number) => fit(CAMERA, azimuth, elevation);
