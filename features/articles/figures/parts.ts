import { iso, pathOf, towardViewer, type Plan, type Plane, type Projection, type SolidPaths } from '@/components/iso/iso-kit';
import { ordered, type Box, type Layer } from './painter';

/** A part of an assembly: a box in the world for the painter, and what to draw. */
export interface Part {
    id: string;
    box: Box;
    solid?: SolidPaths;
    tone?: 'hi' | 'mid' | 'lo';
    lit?: boolean;
    /** Flat shapes drawn as paper with an outline: a wheel, a window. */
    discs?: { d: string; tone: 'hi' | 'mid' | 'lo' | 'faint' }[];
    lines?: { d: string; tone: 'hi' | 'mid' | 'lo' | 'faint' | 'lit' }[];
}


export const boxOfPlan = (plan: Plan, z0: number, z1: number): Box => [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d, z0, z1];

/** True when a vertical face with this outward normal turns towards the viewer. */
export const facing = (P: Projection, [nx, ny]: Plane) => {
    const [vx, vy] = towardViewer(P);
    return nx * vx + ny * vy > 1e-6;
};

/** A rectangle on a vertical face, given by two world points on the face and a height band. */
export function panel(P: Projection, a: Plane, b: Plane, z0: number, z1: number) {
    return pathOf([iso([a[0], a[1], z0], P), iso([b[0], b[1], z0], P), iso([b[0], b[1], z1], P), iso([a[0], a[1], z1], P)], true);
}


/** An assembly's parts in painter's order: the same separating planes as the scene, applied inside one object. */
export const sortedParts = (parts: Part[], P: Projection) => ordered(parts.map((part): Layer<Part> => ({ id: part.id, box: part.box, node: part })), P).map(layer => layer.node);

/** The world box an assembly takes, for the scene's painter. */
export const boxOfParts = (parts: Part[]): Box => [
    Math.min(...parts.map(part => part.box[0])),
    Math.max(...parts.map(part => part.box[1])),
    Math.min(...parts.map(part => part.box[2])),
    Math.max(...parts.map(part => part.box[3])),
    Math.min(...parts.map(part => part.box[4])),
    Math.max(...parts.map(part => part.box[5])),
];
