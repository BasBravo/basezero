import { boxCorners, type Plan } from '@/components/iso/iso-kit';
import { BASE_H, FOOT_H } from '../base';
import { elevationRange, projectionFor as fit, type Camera } from '../orbit';

export const WIDTH = 640;
export const HEIGHT = 340;
export const AZIMUTH = 58;
export const ELEVATION = 38;

export const BASE: Plan = { x: -140, y: -76, w: 280, d: 152, r: 9 };

const CAMERA: Camera = { azimuth: AZIMUTH, elevation: ELEVATION, width: WIDTH, height: HEIGHT, pad: 22, points: [...boxCorners(BASE, -BASE_H - FOOT_H, 0), [0, 0, 30]] };
export const CENTRE = { azimuth: AZIMUTH, elevation: ELEVATION, elevationRange: elevationRange(CAMERA) };
export const projectionFor = (azimuth: number, elevation: number) => fit(CAMERA, azimuth, elevation);
