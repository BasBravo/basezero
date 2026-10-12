'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { fill } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { ARM, ARM_Z, artOf, PIPE, STUB, STUB_Z, TANK, TANK_H, type Art } from './geometry';
import { useOrbit } from '../useOrbit';
import { EMPTY, pour, pouring, percent, reached, step, TARGET, type Tank } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface TankCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    idle: string;
    status: string;
    stuck: string;
    chipYes: string;
    chipNo: string;
    aria: string;
    controls: string;
    pour: string;
    plug: string;
    unplug: string;
    empty: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
const LABEL =
    'A glass tank on a base plate with a dotted mark at the level to reach. A tap above it pours buckets of water in. A small leak near the bottom lets water out onto the plate, and it can be plugged. The water level shows whether the buckets are enough.';

type Op = 'pour' | 'plug' | 'drain';
/** The demo: eight buckets that never get the tank to the mark, then the leak is plugged and three more do. */
const TOUR: [Op, number][] = [
    ...Array.from({ length: 7 }, (): [Op, number] => ['pour', 1.1]),
    ['pour', 2.8],
    ['plug', 1.4],
    ['pour', 1.1],
    ['pour', 1.1],
    ['pour', 3.4],
    ['drain', 1.2],
];

function nodesOf(art: Art) {
    const BASE = <BaseNode key="base" art={art.BASE_ART} />;

    const TAP_PIPE = (
        <g key="pipe">
            <Solid paths={art.TAP.pipe} tone="mid" crease="faint" />
            <Line d={art.TAP.collar} tone="faint" />
        </g>
    );
    const TAP_ARM = (
        <g key="arm">
            <path className="iso-halo" d={art.TAP.halo} />
            <Solid paths={art.TAP.arm} tone="mid" crease="faint" />
            <Solid paths={art.TAP.spout} tone="hi" crease="faint" />
        </g>
    );

    return { BASE, TAP_PIPE, TAP_ARM };
}

interface View {
    tank: Tank;
    plugged: boolean;
}

export function TankFigure({ copy }: { copy: TankCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const clock = useRef(0);
    const tank = useRef<Tank>(EMPTY);
    const plugged = useRef(false);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: 0, wait: 1.4 });
    const frame = useRef(0);
    const last = useRef(0);
    const [view, setView] = useState<View>({ tank: EMPTY, plugged: false });
    const orbit = useOrbit(CENTRE, calm);
    const zoom = useZoom();
    const P = useMemo(() => projectionFor(orbit.azimuth, orbit.elevation), [orbit.azimuth, orbit.elevation]);
    const [playing, setPlaying] = useState(true);
    const playingRef = useRef(true);
    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);
    const art = useMemo(() => artOf(P), [P]);
    const nodes = useMemo(() => nodesOf(art), [art]);

    const snapshot = useCallback(() => setView({ tank: tank.current, plugged: plugged.current }), []);

    const act = useCallback(
        (op: Op, byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            if (op === 'pour') {
                tank.current = pour(tank.current);
                if (calm) tank.current = step(tank.current, 10, !plugged.current);
            } else if (op === 'plug') plugged.current = !plugged.current;
            else {
                tank.current = EMPTY;
                plugged.current = false;
            }
            snapshot();
        },
        [calm, snapshot],
    );

    useEffect(() => {
        if (!inView || calm) return;
        last.current = 0;
        const tick = (time: number) => {
            const dt = last.current ? Math.min((time - last.current) / 1000, 1 / 20) : 0;
            last.current = time;
            clock.current += dt;
            if (playingRef.current && clock.current - lastUser.current > IDLE_AFTER) {
                plan.current.wait -= dt;
                if (plan.current.wait <= 0) {
                    const [op, wait] = TOUR[plan.current.index % TOUR.length]!;
                    plan.current.index += 1;
                    plan.current.wait = wait;
                    // The demo only plugs a leak that is open, and only drains when there is something to drain.
                    if (op !== 'plug' || !plugged.current) act(op, false);
                }
            }
            const before = tank.current;
            const next = step(before, dt, !plugged.current);
            if (next.level !== before.level || next.pending !== before.pending) {
                tank.current = next;
                snapshot();
            }
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, act, snapshot]);

    const now = view.tank;
    const leaking = !view.plugged && now.level > 0.5;
    const stuck = !view.plugged && !pouring(now) && now.buckets >= 5 && !reached(now);
    const status = now.buckets === 0 ? copy.idle : stuck ? fill(copy.stuck, { n: now.buckets }) : fill(copy.status, { n: now.buckets, level: percent(now), target: TARGET });

    useEffect(() => {
        say(status);
    }, [say, status]);

    const water = art.TANK_ART.waterOf(now.level);
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'pipe', box: [PIPE.x, PIPE.x + PIPE.w, PIPE.y, PIPE.y + PIPE.d, 0, ARM_Z[1]], node: nodes.TAP_PIPE },
        { id: 'arm', box: [ARM.x, ARM.x + ARM.w, ARM.y, ARM.y + ARM.d, ARM_Z[0], ARM_Z[1]], node: nodes.TAP_ARM },
        {
            id: 'tank',
            box: [TANK.x, TANK.x + TANK.w, TANK.y, TANK.y + TANK.d, 0, TANK_H],
            node: (
                <g key="tank">
                    <Solid paths={art.TANK_ART.floor} tone="lo" crease="faint" />
                    {water && <Solid paths={water} tone="hi" crease="faint" />}
                    {pouring(now) && <Line d={art.TANK_ART.streamOf(now.level)} tone="hi" flow />}
                    <Line d={art.TANK_ART.edges} tone="mid" />
                    <Line d={art.TANK_ART.rim} tone="mid" />
                    <Line d={art.TANK_ART.lip} tone="faint" />
                    <Line d={art.TANK_ART.target} tone="lit" dotted />
                </g>
            ),
        },
        {
            id: 'leak',
            box: [STUB.x, STUB.x + STUB.w + 18, -12, 12, 0, STUB_Z[1] + 2],
            node: (
                <g key="leak">
                    <Solid paths={art.LEAK.stub} tone="mid" crease="faint" />
                    {view.plugged ? <Solid paths={art.LEAK.plug} tone="hi" crease="faint" lit /> : leaking && <Line d={art.LEAK.stream} tone="hi" flow />}
                    {leaking && <Solid paths={art.LEAK.puddle} tone="lo" crease="none" flat />}
                </g>
            ),
        },
    ];

    const reachedNow = reached(now);
    const chip = now.buckets === 0 ? '—' : reachedNow ? copy.chipYes : copy.chipNo;

    return (
        <Plate fig={copy.fig} lead={<CornerControls playing={playing} onToggle={() => setPlaying(value => !value)} zoom={zoom} reset={{ disabled: !orbit.turned && zoom.zoom === 1, onReset: () => {
                orbit.reset();
                zoom.reset();
            } }} labels={copy} />} title={copy.title} hint={copy.hint} readout={copy.idle} keys={copy.keys.map((label, index) => ({ mark: index ? 'raised' : 'lit', label }))} caption={copy.caption}>
            <div ref={anchor}>
                <div className={`${styles.orbit} ${styles.viewport}`} data-dragging={orbit.dragging ? '' : undefined} {...orbit.handlers}>
                    <div className={styles.zoomed} style={{ transform: `scale(${zoom.zoom})` }}>
                        <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
                            {ordered(layers, P).map(layer => (
                                <Fragment key={layer.id}>{layer.node}</Fragment>
                            ))}
                        </IsoFigure>
                    </div>
                </div>
                <div className={styles.controls} role="group" aria-label={copy.controls}>
                    <div className={styles.group}>
                        <button type="button" className={styles.button} onClick={() => act('pour', true)}>
                            {copy.pour}
                        </button>
                        <button type="button" className={styles.button} aria-pressed={view.plugged} onClick={() => act('plug', true)}>
                            {view.plugged ? copy.unplug : copy.plug}
                        </button>
                        <button type="button" className={styles.button} disabled={now.buckets === 0 && !view.plugged} onClick={() => act('drain', true)}>
                            {copy.empty}
                        </button>
                    </div>
                    <span className={styles.chip} data-state={now.buckets === 0 ? 'idle' : reachedNow ? 'pass' : 'fail'} role="status">
                        {chip}
                    </span>
                </div>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-live="polite">
                    {status}
                </span>
            </div>
        </Plate>
    );
}
