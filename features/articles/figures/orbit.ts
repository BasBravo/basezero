import { fitProjection, iso, translateAlong, type Flat, type Point3, type Projection } from '@/components/iso/iso-kit';

/** How far a drag may turn the view either side of the centre, in degrees, around the vertical (azimuth) and the horizontal (elevation) axis. */
export const TURN = 50;
export const TURN_STEP = 0.25;
/** Looking from below the table or straight down the edge helps nobody, so the elevation is kept in a usable band. */
export const ELEVATION_MIN = 8;
export const ELEVATION_MAX = 86;

export interface Camera {
    azimuth: number;
    elevation: number;
    width: number;
    height: number;
    pad: number;
    points: Point3[];
}

export const elevationRange = (camera: Camera): [number, number] => [Math.max(ELEVATION_MIN, camera.elevation - TURN), Math.min(ELEVATION_MAX, camera.elevation + TURN)];

/** Fits the scene to the card at this view, so it always fills it however it is turned. */
export function projectionFor(camera: Camera, azimuth: number, elevation: number): Projection {
    return fitProjection(camera.points, camera.width, camera.height, { pad: camera.pad, azimuth, elevation });
}

export const shiftOf = (P: Projection) => (x: number, y = 0, z = 0) => translateAlong(P, [x, y, z]);
export const atOf = (P: Projection) => (point: Point3): Flat => iso(point, P);
