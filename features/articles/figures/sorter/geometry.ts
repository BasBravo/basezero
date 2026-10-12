import { circleRing, depthOf, extrude, insetPlan, onTop, pathOf, planOutline, ring, sideArc, slabOf, type Flat, type Plan, type Plane, type Projection } from '@/components/iso/iso-kit';
import { HOLE, HOLE_R, PIECE_H, TOP, TRAY_Y, trayX } from './model';
import { BASE, BASE_H, FOOT_H } from './view';
import { atOf } from '../orbit';

export function artOf(P: Projection) {
  const at = atOf(P);

  const box = (x0: number, x1: number, y0: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
  const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
  const cylinder = (cx: number, cy: number, r: number, z: number, h: number, steps = 32) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true });
  const polygon = (cx: number, cy: number, r: number, count: number, turn: number): Plane[] =>
      Array.from({ length: count }, (_, index) => [cx + r * Math.cos(turn + (index / count) * Math.PI * 2), cy + r * Math.sin(turn + (index / count) * Math.PI * 2)]);
  const join = (paths: string[]) => paths.join('');
  const RADIANS = Math.PI / 180;

  function hull(points: Flat[]): Flat[] {
      const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const build = (list: Flat[]) => {
          const out: Flat[] = [];
          for (const point of list) {
              while (out.length >= 2 && cross(out[out.length - 2]!, out[out.length - 1]!, point) <= 0) out.pop();
              out.push(point);
          }
          out.pop();
          return out;
      };
      return [...build(sorted), ...build([...sorted].reverse())];
  }

  const FEET: Plane[] = [
      [BASE.x + 18, BASE.y + 16],
      [BASE.x + BASE.w - 18, BASE.y + 16],
      [BASE.x + 18, BASE.y + BASE.d - 16],
      [BASE.x + BASE.w - 18, BASE.y + BASE.d - 16],
  ];
  const SCREWS: Plane[] = [
      [BASE.x + 8, BASE.y + 8],
      [BASE.x + BASE.w - 8, BASE.y + 8],
      [BASE.x + 8, BASE.y + BASE.d - 8],
      [BASE.x + BASE.w - 8, BASE.y + BASE.d - 8],
  ];
  const PLATE: Plan = { x: BASE.x + 22, y: BASE.y + 14, w: 56, d: 11, r: 2 };

  const BASE_ART = {
      halo: solid(BASE, -BASE_H - FOOT_H, BASE_H).fill,
      feet: FEET.map(([x, y]) => [cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6), cylinder(x, y, 5.5, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6)]),
      slab: solid(BASE, -BASE_H, BASE_H, 8, 1.6),
      groove: planOutline(insetPlan(BASE, 4.5), 0, P),
      screwRings: join(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
      screws: SCREWS.map(([x, y]) => at([x, y, 0])),
      plate: solid(PLATE, 0, 0.8, 4),
      plateLine: planOutline(insetPlan(PLATE, 1.6), 0.8, P),
      plateRule: join([0, 1, 2].map(row => onTop([[PLATE.x + 8, PLATE.y + 3.4 + row * 2.1], [PLATE.x + (row === 1 ? 34 : 44), PLATE.y + 3.4 + row * 2.1]], 0.8, P))),
      plateScrews: [at([PLATE.x + 3.5, PLATE.y + PLATE.d / 2, 0.8]), at([PLATE.x + PLATE.w - 3.5, PLATE.y + PLATE.d / 2, 0.8])],
  };

  const BLOCK: Plan = box(-72, 72, -70, 10, 8);
  const HOLE_RING = polygon(HOLE.x, HOLE.y, HOLE_R, 6, 0);
  const FLOOR_RING = polygon(HOLE.x, HOLE.y, HOLE_R * 0.92, 6, 0);

  const BLOCK_ART = {
      halo: solid(BLOCK, 0, TOP).fill,
      block: solid(BLOCK, 0, TOP, 8, 1.2),
      groove: planOutline(insetPlan(BLOCK, 5), TOP, P, 8),
      screws: [
          [BLOCK.x + 9, BLOCK.y + 9],
          [BLOCK.x + BLOCK.w - 9, BLOCK.y + 9],
          [BLOCK.x + 9, BLOCK.y + BLOCK.d - 9],
          [BLOCK.x + BLOCK.w - 9, BLOCK.y + BLOCK.d - 9],
      ].map(([x, y]) => at([x!, y!, TOP])),
      hole: extrude(HOLE_RING, TOP, 0.3, P, { convex: true }),
      holeFloor: extrude(FLOOR_RING, TOP - 16, 0.3, P, { convex: true }),
      rim: onTop(HOLE_RING, TOP, P, true),
        wall: join(
      HOLE_RING.map(([x, y], index) => ({ x, y, index, depth: depthOf([x, y, TOP], P) }))
        .sort((a, b) => a.depth - b.depth)
        .slice(0, 3)
        .map(({ x, y, index }) => pathOf([at([x, y, TOP]), at([FLOOR_RING[index]![0], FLOOR_RING[index]![1], TOP - 16])])),
    ),
      opening: pathOf(HOLE_RING.map(([x, y]) => at([x, y, TOP])), true),
      chimney: pathOf(hull([...HOLE_RING.map(([x, y]) => at([x, y, TOP])), ...HOLE_RING.map(([x, y]) => at([x, y, TOP + 90]))]), true),
      side: join([-1, 1].map(side => pathOf([at([BLOCK.x + (side < 0 ? 0 : BLOCK.w), BLOCK.y + BLOCK.d, TOP - 8]), at([BLOCK.x + (side < 0 ? 0 : BLOCK.w), BLOCK.y + BLOCK.d, 4])]))),
      face: pathOf([at([BLOCK.x, BLOCK.y + BLOCK.d, 8]), at([BLOCK.x + BLOCK.w, BLOCK.y + BLOCK.d, 8])]),
  };

  const PADS = [0, 1, 2, 3].map(piece => ({
      pad: solid(box(trayX(piece) - 31, trayX(piece) + 31, TRAY_Y - 31, TRAY_Y + 31, 7), 0, 2, 5, 0.4),
      line: planOutline(box(trayX(piece) - 27, trayX(piece) + 27, TRAY_Y - 27, TRAY_Y + 27, 5), 2, P, 5),
      dots: Array.from({ length: piece + 1 }, (_, dot) => at([trayX(piece) - 8 + dot * 5.4 - piece * 2.7, TRAY_Y + 36, 0])),
  }));

  // Pieces are built at the origin with their underside on z = 0 and moved into place.
  const FACING = (P.azimuth ?? 0) * RADIANS;

  function knurl(r: number, z0: number, z1: number, count: number) {
      const lines: string[] = [];
      for (let index = 0; index < count; index++) {
          const angle = (index / count) * Math.PI * 2;
          if (Math.cos(angle) * Math.cos(FACING) + Math.sin(angle) * Math.sin(FACING) < 0.15) continue;
          lines.push(pathOf([at([r * Math.cos(angle), r * Math.sin(angle), z0 + 0.4]), at([r * Math.cos(angle), r * Math.sin(angle), z1 - 0.4])]));
      }
      return join(lines);
  }

  const CUBE = box(-20, 20, -20, 20, 3);
  const TRI = polygon(0, 0, 27, 3, -Math.PI / 2);
  const HEX = polygon(0, 0, HOLE_R - 3, 6, 0);

  const PIECE_ART = [
      { body: cylinder(0, 0, 22, 0, PIECE_H, 40), top: ring(0, 0, 15, PIECE_H, P, 30), seam: sideArc(0, 0, 22, 9, P, 24) + sideArc(0, 0, 22, 21, P, 24), ribs: knurl(22, 9, 21, 28) },
      { body: solid(CUBE, 0, PIECE_H, 3, 0.8), top: planOutline(insetPlan(CUBE, 6), PIECE_H, P, 3), seam: '', ribs: '' },
      { body: extrude(TRI, 0, PIECE_H, P, { convex: true }), top: onTop(polygon(0, 0, 14, 3, -Math.PI / 2), PIECE_H, P, true), seam: '', ribs: '' },
      { body: extrude(HEX, 0, PIECE_H, P, { convex: true }), top: onTop(polygon(0, 0, 14, 6, 0), PIECE_H, P, true), seam: '', ribs: '' },
  ];


  return { BASE_ART, BLOCK_ART, PADS, PIECE_ART };
}

export type Art = ReturnType<typeof artOf>;
