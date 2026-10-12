'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { fill } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, CUP, PIPE_TOP, SOURCE, STEPS_ART, type Art } from './geometry';
import { useOrbit } from '../useOrbit';
import { ALL, brokenAt, delivers, reachOf } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface PipelineCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    ok: string;
    broken: string;
    chipYes: string;
    chipNo: string;
    aria: string;
    steps: string[];
    names: string[];
    controls: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
/** The demo takes the second step away and puts it back, then the fourth. */
const TOUR: [number, number][] = [
    [1, 3.6],
    [1, 3.4],
    [3, 3.6],
    [3, 3.4],
];
const LABEL =
    'A route made of four pipe steps on a base plate. Water leaves a tank on the left, runs through the first three steps and comes back along the fourth to a cup next to the start, where the person who began it is waiting. If any step is missing, shown as a dotted outline, the water spills out at that point and the cup stays empty.';

function nodesOf(art: Art) {
    const BASE = <BaseNode key="base" art={art.BASE_ART} />;
    const PIPES = art.STEP_ART.map(step =>
        step.pieces.map((piece, index) => (
            <g key={piece.id}>
                <path className="iso-halo" d={piece.halo} />
                <Solid paths={piece.body} tone="mid" crease="faint" />
                {index === 0 && <Line d={step.bands} tone="hi" />}
            </g>
        )),
    );
    const SOURCE_NODE = (
        <g key="source">
            <path className="iso-halo" d={art.SOURCE.halo} />
            <Solid paths={art.SOURCE.body} tone="hi" crease="faint" />
            <Line d={art.SOURCE.top} tone="faint" />
        </g>
    );
    return { BASE, PIPES, SOURCE_NODE };
}

export function PipelineFigure({ copy }: { copy: PipelineCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const clock = useRef(0);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: 0, wait: 2.4 });
    const frame = useRef(0);
    const last = useRef(0);
    const [present, setPresent] = useState<boolean[]>([...ALL]);
    const presentRef = useRef<boolean[]>([...ALL]);
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

    const toggle = useCallback((step: number, byUser: boolean) => {
        if (byUser) lastUser.current = clock.current;
        presentRef.current = presentRef.current.map((item, index) => (index === step ? !item : item));
        setPresent(presentRef.current);
    }, []);

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
                    const [step, wait] = TOUR[plan.current.index % TOUR.length]!;
                    plan.current.index += 1;
                    plan.current.wait = wait;
                    toggle(step, false);
                }
            }
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, toggle]);

    const reach = reachOf(present);
    const whole = delivers(present);
    const broken = brokenAt(present);
    const status = whole ? copy.ok : fill(copy.broken, { name: copy.names[broken]! });
    useEffect(() => {
        say(status);
    }, [say, status]);

    const flow = art.flowOf(reach);
    const spill = whole ? null : art.spillOf(reach);
    const pipeIds = STEPS_ART.flatMap(step => step.pieces.map(piece => piece.id));
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'source', box: [SOURCE.x - SOURCE.r, SOURCE.x + SOURCE.r, SOURCE.y - SOURCE.r, SOURCE.y + SOURCE.r, 0, SOURCE.h], node: nodes.SOURCE_NODE },
        {
            id: 'cup',
            box: [CUP.x - CUP.r, CUP.x + CUP.r, CUP.y - CUP.r, CUP.y + CUP.r, 0, CUP.h],
            node: (
                <g key="cup">
                    <Solid paths={art.CUP.body} tone="hi" crease="faint" lit={whole} />
                    <Line d={art.CUP.top} tone="faint" />
                </g>
            ),
        },
        ...STEPS_ART.flatMap((step, index) =>
            step.pieces.map(
                (piece, pieceIndex): Layer<ReactNode> => ({
                    id: piece.id,
                    box: [piece.plan.x, piece.plan.x + piece.plan.w, piece.plan.y, piece.plan.y + piece.plan.d, 0, PIPE_TOP],
                    node: present[index] ? nodes.PIPES[index]![pieceIndex] : <Line key={piece.id} d={art.STEP_ART[index]!.pieces[pieceIndex]!.ghost} tone="lit" dotted />,
                }),
            ),
        ),
        {
            id: 'flow',
            box: [-150, 126, -46, 46, PIPE_TOP, PIPE_TOP + 1],
            node: <Fragment key="flow">{flow && <Line d={flow} tone="lit" flow />}</Fragment>,
        },
        {
            id: 'spill',
            box: [-160, 130, -60, 60, 0, 9],
            after: pipeIds,
            node: spill ? (
                <g key="spill">
                    <Solid paths={spill.puddle} tone="lo" crease="none" flat />
                    <Line d={spill.stream} tone="lit" flow free />
                </g>
            ) : (
                <Fragment key="spill" />
            ),
        },
    ];

    return (
        <Plate fig={copy.fig} lead={<CornerControls playing={playing} onToggle={() => setPlaying(value => !value)} zoom={zoom} reset={{ disabled: !orbit.turned && zoom.zoom === 1, onReset: () => {
                orbit.reset();
                zoom.reset();
            } }} labels={copy} />} title={copy.title} hint={copy.hint} readout={copy.ok} keys={copy.keys.map((label, index) => ({ mark: index ? 'raised' : 'lit', label }))} caption={copy.caption}>
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
                        {copy.steps.map((label, index) => (
                            <button key={label} type="button" className={styles.button} aria-pressed={present[index]} onClick={() => toggle(index, true)}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <span className={styles.chip} data-state={whole ? 'pass' : 'fail'} role="status">
                        {whole ? copy.chipYes : copy.chipNo}
                    </span>
                </div>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-live="polite">
                    {status}
                </span>
            </div>
        </Plate>
    );
}
