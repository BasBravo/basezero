'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dots, IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { fill, LiveSolid, paintSolid } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, BEAM, DIAL_Y, DIAL_Z, HOOK_X, HOOK_Z, PAN_TOP, PEDESTAL, POINTER, YOKE_Z, type Art } from './geometry';
import { shiftOf } from '../orbit';
import { useOrbit } from '../useOrbit';
import { heavierOf, MAX_OPINIONS, MAX_TILT, MAX_USES, tiltOf, tilted, type Heavier, type Pans } from './model';
import { ARM, BASE as BASE_PLAN, CENTRE, HEIGHT, PAN_R, PIVOT_Z, projectionFor, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface ScaleCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    idle: string;
    status: string;
    verdicts: string[];
    chips: string[];
    aria: string;
    controls: string;
    opinion: string;
    use: string;
    empty: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
const EMPTY: Pans = { opinions: 0, uses: 0 };
const VERDICTS: Heavier[] = ['left', 'even', 'right'];
type Op = 'opinion' | 'use' | 'empty';
/** The demo: six opinions tip the beam, one sign of real use is not enough, the second outweighs them all. */
const TOUR: [Op, number][] = [...Array.from({ length: MAX_OPINIONS }, (): [Op, number] => ['opinion', 0.9]), ['use', 1.8], ['use', 1.8], ['use', 3.2], ['empty', 1.6]];
const LABEL =
    'A balance on a base plate: a beam on a post with a pan hanging from each end and a pointer over a small scale. The left pan holds big hollow weights, opinions and visits. The right pan holds small solid weights, signs of real use. Two small weights outweigh six big ones.';

/** How far a pan's hook moves when the beam tilts, from where the pan was drawn at rest. */
const hookShift = (side: -1 | 1, tilt: number) => {
    const [x, , z] = tilted([side * HOOK_X, 0, HOOK_Z], tilt);
    return [x - side * HOOK_X, z - HOOK_Z] as const;
};

function nodesOf(art: Art) {
    const BASE = (
        <g key="base">
            <BaseNode art={art.BASE_ART} />
            <Solid paths={art.DETAIL.plate} tone="lo" crease="none" />
            <Line d={art.DETAIL.plateLine} tone="faint" />
            <Line d={art.DETAIL.plateRule} tone="lo" free />
            <Dots points={art.DETAIL.plateScrews} size={0.45} tone="mid" />
            <Solid paths={art.DETAIL.strip} tone="lo" crease="none" />
            <Line d={art.DETAIL.stripBase} tone="faint" />
            <Line d={art.DETAIL.stripMinor} tone="lo" />
            <Line d={art.DETAIL.stripMajor} tone="mid" />
        </g>
    );

    const STAND = (
        <g key="stand">
            <path className="iso-halo" d={art.STAND.halo} />
            <Solid paths={art.STAND.pedestal} tone="mid" crease="faint" />
            <Line d={art.STAND.groove} tone="faint" />
            <Dots points={art.STAND.screws} size={0.5} tone="mid" />
            <Solid paths={art.STAND.collar} tone="lo" crease="faint" />
            <Solid paths={art.STAND.post} tone="mid" crease="faint" />
            <Solid paths={art.STAND.yoke} tone="hi" crease="faint" />
        </g>
    );

    const DIAL = (
        <g key="dial">
            <Solid paths={art.DIAL.plate} tone="lo" crease="faint" />
            <Line d={art.DIAL.minor} tone="lo" />
            <Line d={art.DIAL.major} tone="mid" />
            <Line d={art.DIAL.rule} tone="lo" />
            <Dots points={art.DIAL.screws} size={0.45} tone="mid" />
        </g>
    );

    const pan = (side: Art['LEFT']) => (
        <>
            <Line d={side.back} tone="lo" />
            <path className="iso-halo" d={side.halo} />
            <Solid paths={side.pan} tone="mid" crease="faint" />
            <Line d={side.rim} tone="faint" />
        </>
    );
    const cords = (side: Art['LEFT']) => (
        <>
            <Line d={side.front} tone="lo" />
            <Dots points={side.ends} size={0.55} tone="mid" />
            <Dots points={[side.hook]} size={0.9} tone="hi" />
        </>
    );

    return { BASE, STAND, DIAL, LEFT_PAN: pan(art.LEFT), RIGHT_PAN: pan(art.RIGHT), LEFT_CORDS: cords(art.LEFT), RIGHT_CORDS: cords(art.RIGHT) };
}

export function ScaleFigure({ copy }: { copy: ScaleCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const [pans, setPans] = useState<Pans>(EMPTY);
    const pansRef = useRef<Pans>(EMPTY);
    const tilt = useRef({ value: 0, speed: 0 });
    const clock = useRef(0);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: 0, wait: 1.4 });
    const frame = useRef(0);
    const last = useRef(0);
    const painted = useRef(Number.NaN);
    const beam = useRef<SVGGElement | null>(null);
    const rib = useRef<SVGPathElement | null>(null);
    const pointer = useRef<SVGPathElement | null>(null);
    const eyes = useRef<(SVGCircleElement | null)[]>([]);
    const left = useRef<SVGGElement | null>(null);
    const right = useRef<SVGGElement | null>(null);
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
    const artRef = useRef(art);
    const shiftRef = useRef(shiftOf(P));

    const paint = useCallback((degrees: number, force = false) => {
        if (!force && Math.abs(degrees - painted.current) < 0.005) return;
        painted.current = degrees;
        const a = artRef.current;
        paintSolid(beam.current, a.beamOf(degrees));
        const detail = a.beamDetailOf(degrees);
        rib.current?.setAttribute('d', detail.rib);
        pointer.current?.setAttribute('d', detail.pointer);
        detail.eyes.forEach(([x, y], index) => {
            eyes.current[index]?.setAttribute('cx', x.toFixed(1));
            eyes.current[index]?.setAttribute('cy', y.toFixed(1));
        });
        const [lx, lz] = hookShift(-1, degrees);
        const [rx, rz] = hookShift(1, degrees);
        left.current?.setAttribute('transform', shiftRef.current(lx, 0, lz));
        right.current?.setAttribute('transform', shiftRef.current(rx, 0, rz));
    }, []);

    useEffect(() => {
        artRef.current = art;
        shiftRef.current = shiftOf(P);
        paint(tilt.current.value, true);
    }, [art, P, paint]);

    const act = useCallback(
        (op: Op, byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            const now = pansRef.current;
            if (op === 'opinion') pansRef.current = { ...now, opinions: Math.min(MAX_OPINIONS, now.opinions + 1) };
            else if (op === 'use') pansRef.current = { ...now, uses: Math.min(MAX_USES, now.uses + 1) };
            else pansRef.current = EMPTY;
            setPans(pansRef.current);
            if (calm) {
                tilt.current = { value: tiltOf(pansRef.current), speed: 0 };
                paint(tilt.current.value);
            }
        },
        [calm, paint],
    );

    useEffect(() => {
        if (!inView || calm) {
            tilt.current = { value: tiltOf(pansRef.current), speed: 0 };
            paint(tilt.current.value);
            return;
        }
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
                    act(op, false);
                }
            }
            // A lightly damped beam: it overshoots a little and settles, like a real balance.
            const goal = tiltOf(pansRef.current);
            for (let step = 0; step < 4; step++) {
                const h = dt / 4;
                const speed = tilt.current.speed + (40 * (goal - tilt.current.value) - 7 * tilt.current.speed) * h;
                const value = Math.min(MAX_TILT, Math.max(-MAX_TILT, tilt.current.value + speed * h));
                // The end stops take the swing out of the beam instead of letting it pass through them.
                tilt.current = { value, speed: Math.abs(value) === MAX_TILT ? 0 : speed };
            }
            if (Math.abs(goal - tilt.current.value) < 0.002 && Math.abs(tilt.current.speed) < 0.002) tilt.current = { value: goal, speed: 0 };
            paint(tilt.current.value);
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, act, paint]);

    const heavier = heavierOf(pans);
    const total = pans.opinions + pans.uses;
    const verdict = copy.verdicts[VERDICTS.indexOf(heavier)]!;
    const status = total === 0 ? copy.idle : fill(copy.status, { opinions: pans.opinions, uses: pans.uses, verdict });

    useEffect(() => {
        say(status);
    }, [say, status]);

    const drop = Math.sin((MAX_TILT * Math.PI) / 180) * ARM;
    const panBox = (side: -1 | 1): Layer<ReactNode>['box'] => [side * HOOK_X - PAN_R - 4, side * HOOK_X + PAN_R + 4, -PAN_R, PAN_R, PAN_TOP - 3 - drop, PIVOT_Z + HOOK_Z + drop];
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'stand', box: [PEDESTAL.x, PEDESTAL.x + PEDESTAL.w, PEDESTAL.y, PEDESTAL.y + PEDESTAL.d, 0, YOKE_Z[1]], node: nodes.STAND },
        { id: 'dial', box: [-14, 14, DIAL_Y - 1.5, DIAL_Y, DIAL_Z[0], DIAL_Z[1]], after: ['stand'], node: nodes.DIAL },
        {
            id: 'beam',
            box: [-BEAM.half, BEAM.half, -BEAM.depth, BEAM.depth, PIVOT_Z - drop - 4, PIVOT_Z + drop + 4],
            after: ['stand'],
            node: (
                <>
                    <LiveSolid gref={node => void (beam.current = node)} tone="hi" />
                    <path ref={rib} className="iso-line" data-tone="faint" />
                    <g className="iso-dots" data-tone="mid">
                        {[0, 1].map(index => (
                            <circle key={index} ref={node => void (eyes.current[index] = node)} r={0.9} />
                        ))}
                    </g>
                </>
            ),
        },
        {
            id: 'pointer',
            box: [-10, 10, POINTER.y - 0.5, POINTER.y + 0.5, DIAL_Z[0], PIVOT_Z + 1],
            after: ['beam', 'dial', 'stand'],
            node: (
                <>
                    <path ref={pointer} className="iso-line" data-tone="lit" data-free="end" />
                    <Dots points={art.BOSS} size={1.6} tone="hi" />
                </>
            ),
        },
        {
            id: 'pan-left',
            box: panBox(-1),
            after: ['beam'],
            node: (
                <g ref={left}>
                    {nodes.LEFT_PAN}
                    {art.OPINIONS.filter(weight => weight.index < pans.opinions).map(weight => (
                        <g key={weight.index}>
                            <Solid paths={weight.body} tone="lo" crease="faint" />
                            <Line d={weight.hole} tone="lo" />
                            <Line d={weight.inner} tone="faint" />
                        </g>
                    ))}
                    {nodes.LEFT_CORDS}
                </g>
            ),
        },
        {
            id: 'pan-right',
            box: panBox(1),
            after: ['beam'],
            node: (
                <g ref={right}>
                    {nodes.RIGHT_PAN}
                    {art.USES.filter(weight => weight.index < pans.uses).map(weight => (
                        <g key={weight.index}>
                            <Solid paths={weight.body} tone="hi" crease="faint" />
                            <Dots points={[weight.knob]} size={0.5} tone="mid" />
                        </g>
                    ))}
                    {nodes.RIGHT_CORDS}
                </g>
            ),
        },
    ];

    const chip = total === 0 ? '—' : copy.chips[VERDICTS.indexOf(heavier)]!;

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
                        <button type="button" className={styles.button} disabled={pans.opinions === MAX_OPINIONS} onClick={() => act('opinion', true)}>
                            {copy.opinion}
                        </button>
                        <button type="button" className={styles.button} disabled={pans.uses === MAX_USES} onClick={() => act('use', true)}>
                            {copy.use}
                        </button>
                        <button type="button" className={styles.button} disabled={total === 0} onClick={() => act('empty', true)}>
                            {copy.empty}
                        </button>
                    </div>
                    <span className={styles.chip} data-state={total === 0 ? 'idle' : heavier === 'right' ? 'pass' : heavier === 'left' ? 'fail' : 'idle'} role="status">
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
