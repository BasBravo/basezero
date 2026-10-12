import { circleRing, extrude, insetPlan, onTop, pathOf, planOutline, ring, slabOf, topTicks, type Flat, type Plan, type Plane, type Point3, type Projection, type SolidPaths } from '@/components/iso/iso-kit';
import { DEPTH, HALF, limitZ, PLATES, REST_Z, THICK, undersideAt } from './model';
import { BASE, BASE_H, FOOT_H, SUPPORT_W, SUPPORT_X, SUPPORT_Y } from './view';
import { atOf } from '../orbit';

export function artOf(P: Projection) {
  const at = atOf(P);

  const box = (x0: number, x1: number, y0: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
  const solid = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
  const cylinder = (cx: number, cy: number, r: number, z: number, h: number, steps = 28) => extrude(circleRing(cx, cy, r, steps), z, h, P, { convex: true });
  const join = (paths: string[]) => paths.join('');
  const segment = (a: Point3, b: Point3) => pathOf([at(a), at(b)]);

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
  const PLATE: Plan = { x: BASE.x + 22, y: BASE.y + BASE.d - 22, w: 56, d: 11, r: 2 };
  const STRIP: Plan = { x: -100, y: BASE.y + BASE.d - 17, w: 200, d: 7, r: 1 };
  const STRIP_TICKS = topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 4, 5, STRIP.y + 0.8, 0.6, [2, 3.6], P);

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
      strip: solid(STRIP, 0, 0.6, 3),
      stripBase: onTop([[STRIP.x + 4, STRIP.y + 0.8], [STRIP.x + STRIP.w - 4, STRIP.y + 0.8]], 0.6, P),
      stripMinor: STRIP_TICKS.minor,
      stripMajor: STRIP_TICKS.major,
  };

  const SUPPORTS: Plan[] = [-1, 1].map(side => box(side < 0 ? -SUPPORT_X - SUPPORT_W : SUPPORT_X, side < 0 ? -SUPPORT_X : SUPPORT_X + SUPPORT_W, -SUPPORT_Y, SUPPORT_Y, 5));

  const SUPPORT_ART = SUPPORTS.map(plan => ({
      halo: solid(plan, 0, REST_Z).fill,
      block: solid(plan, 0, REST_Z, 6, 1),
      groove: planOutline(insetPlan(plan, 4), REST_Z, P, 5),
      screws: [
          [plan.x + 7, plan.y + 7],
          [plan.x + plan.w - 7, plan.y + 7],
          [plan.x + 7, plan.y + plan.d - 7],
          [plan.x + plan.w - 7, plan.y + plan.d - 7],
      ].map(([x, y]) => at([x!, y!, REST_Z])),
      foot: solid(box(plan.x - 4, plan.x + plan.w + 4, plan.y - 4, plan.y + plan.d + 4, 6), 0, 3, 5, 0.4),
  }));

  const RIGHT_HULL = SUPPORT_ART[1]!.block.outline;

  // The plank is rebuilt every frame: a front face, a top ribbon and an end cap that follow the sag.
  const STEPS = 36;
  const xs = Array.from({ length: STEPS + 1 }, (_, index) => -HALF + (index / STEPS) * HALF * 2);

  function plankOf(drop: number): SolidPaths {
      const under = xs.map(x => undersideAt(x, drop));
      const front = pathOf([...xs.map((x, index): Flat => at([x, DEPTH, under[index]! + THICK])), ...xs.map((x, index): Flat => at([x, DEPTH, under[index]!])).reverse()], true);
      const top = pathOf([...xs.map((x, index): Flat => at([x, DEPTH, under[index]! + THICK])), ...xs.map((x, index): Flat => at([x, -DEPTH, under[index]! + THICK])).reverse()], true);
      const end = under[STEPS]!;
      const side = Math.cos(((P.azimuth ?? 0) * Math.PI) / 180) >= 0 ? 1 : -1;
      const capX = side * HALF;
      const cap = pathOf([at([capX, -DEPTH, end + THICK]), at([capX, DEPTH, end + THICK]), at([capX, DEPTH, end]), at([capX, -DEPTH, end])], true);
      const topEdge = pathOf(xs.map((x, index): Flat => at([x, DEPTH, under[index]! + THICK])));
      const capEdge = pathOf([at([capX, DEPTH, end + THICK]), at([capX, -DEPTH, end + THICK])]);
      const capFront = pathOf([at([capX, DEPTH, end + THICK]), at([capX, DEPTH, end])]);
      return { fill: front + top + cap, outline: front + top + cap, crease: topEdge + capEdge + capFront, top, shades: ['', cap, front, ''] };
  }

  const GRAIN = (drop: number) =>
      join([-8, 0, 8].map(y => pathOf(xs.map((x): Flat => at([x, y, undersideAt(x, drop) + THICK])))));

  const PLATE_ART = Array.from({ length: PLATES }, (_, index) => ({
      body: solid(box(-22, 22, -18, 18, 3), index * 7, 6, 3, 0.5),
      band: onTop([[-22, 0], [22, 0]], index * 7 + 6, P),
      tone: index % 2 ? ('mid' as const) : ('lo' as const),
  }));

  const WIRE = pathOf([at([-SUPPORT_X, DEPTH + 0.3, limitZ]), at([SUPPORT_X, DEPTH + 0.3, limitZ])]);
  const WIRE_EYES = [-SUPPORT_X, SUPPORT_X].map(x => at([x, DEPTH + 0.3, limitZ]));

  const TOWER_X = 172;
  const TOP_Z = 128;
  const legs = (side: number) => join([-14, 14].map(y => segment([side * TOWER_X, y, 0], [side * TOWER_X, y, TOP_Z])));
  const top = (side: number) => segment([side * TOWER_X, -14, TOP_Z], [side * TOWER_X, 14, TOP_Z]);
  const GHOST = {
      far: { legs: legs(-1), top: top(-1), deck: segment([-(HALF + 6), 0, REST_Z + THICK], [-(BASE.w / 2 - 6), 0, REST_Z + THICK]) },
      near: { legs: legs(1), top: top(1), deck: segment([HALF + 6, 0, REST_Z + THICK], [BASE.w / 2 - 6, 0, REST_Z + THICK]) },
      cable: pathOf(Array.from({ length: 41 }, (_, index) => {
          const x = -TOWER_X + (index / 40) * TOWER_X * 2;
          return at([x, 0, TOP_Z - 54 * (1 - (x / TOWER_X) ** 2)]);
      })),
  };
  return { BASE_ART, SUPPORT_ART, RIGHT_HULL, plankOf, GRAIN, PLATE_ART, WIRE, WIRE_EYES, GHOST };
}

export type Art = ReturnType<typeof artOf>;
