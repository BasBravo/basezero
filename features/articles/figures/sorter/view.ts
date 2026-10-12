import { boxCorners, type Plan } from '@/components/iso/iso-kit';
import { elevationRange, projectionFor as fit, type Camera } from '../orbit';

export const WIDTH = 640;
export const HEIGHT = 340;
export const AZIMUTH = 50;
export const ELEVATION = 36;

export const BASE: Plan = { x: -172, y: -96, w: 344, d: 192, r: 9 };
export const BASE_H = 9;
export const FOOT_H = 5;

const CAMERA: Camera = { azimuth: AZIMUTH, elevation: ELEVATION, width: WIDTH, height: HEIGHT, pad: 26, points: [...boxCorners(BASE, -BASE_H - FOOT_H, 0), [0, -30, 120]] };
export const CENTRE = { azimuth: AZIMUTH, elevation: ELEVATION, elevationRange: elevationRange(CAMERA) };
export const projectionFor = (azimuth: number, elevation: number) => fit(CAMERA, azimuth, elevation);
