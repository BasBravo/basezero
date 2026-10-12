'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dots, Line, Plate, Solid, IsoFigure } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { fill } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, type Art } from './geometry';
import { shiftOf } from '../orbit';
import { useOrbit } from '../useOrbit';
import { durationOf, fits, PIECE_H, poseOf, SHAPES, TARGET, TRAY_Y, trayX, type Pose } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Box, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface SorterCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    idle: string;
    trying: string;
    no: string;
    yes: string;
    aria: string;
    pieces: string[];
    names: string[];
    controls: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
const FIRST = 1.4;
const TOUR = [0, 1, 2, 3];
const LABEL =
    'A shape sorter on a base plate: a block with one hexagonal hole in its top and a row of four pieces in front of it, a cylinder, a cube, a triangular prism and a hexagonal prism. A chosen piece lifts, flies over the hole and is pressed in. The three wrong ones rest on the block, rattle and go back to their pads. The hexagonal one sinks in and stays.';

const GLYPHS: ReactNode[] = [
    <circle key="c" cx={7} cy={7} r={5.5} />,
    <rect key="s" x={2} y={2} width={10} height={10} rx={1.5} />,
    <polygon key="t" points="7,1.5 13,12 1,12" />,
    <polygon key="h" points="3.5,1.8 10.5,1.8 13.5,7 10.5,12.2 3.5,12.2 0.5,7" />,
];

function nodesOf(art: Art) {
    const { BASE_ART, BLOCK_ART, PADS, PIECE_ART } = art;

    const BASE = (
        <g key="base">
            <path className="iso-halo" d={BASE_ART.halo} />
            {BASE_ART.feet.map((parts, index) => (
                <g key={index}>
                    {parts.map((paths, part) => (
                        <Solid key={part} paths={paths} tone={part ? 'mid' : 'lo'} crease="faint" />
                    ))}
                </g>
            ))}
            <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
            <Line d={BASE_ART.groove} tone="lo" />
            <Line d={BASE_ART.screwRings} tone="lo" />
            <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
            <Solid paths={BASE_ART.plate} tone="lo" crease="none" />
            <Line d={BASE_ART.plateLine} tone="faint" />
            <Line d={BASE_ART.plateRule} tone="lo" free />
            <Dots points={BASE_ART.plateScrews} size={0.45} tone="mid" />
        </g>
    );

    const BLOCK = (
        <g key="block">
            <path className="iso-halo" d={BLOCK_ART.halo} />
            <Solid paths={BLOCK_ART.block} tone="mid" crease="faint" />
            <Line d={BLOCK_ART.groove} tone="faint" />
            <Dots points={BLOCK_ART.screws} size={0.5} tone="mid" />
            <Solid paths={BLOCK_ART.hole} tone="lo" crease="none" flat />
            <clipPath id="sorter-opening">
                <path d={BLOCK_ART.opening} />
            </clipPath>
            <g clipPath="url(#sorter-opening)">
                <Solid paths={BLOCK_ART.holeFloor} tone="faint" crease="none" flat />
                <Line d={BLOCK_ART.wall} tone="lo" />
            </g>
            <Line d={BLOCK_ART.rim} tone="hi" />
        </g>
    );

    const PAD_NODES = PADS.map((pad, index) => (
        <g key={`pad-${index}`}>
            <Solid paths={pad.pad} tone="lo" crease="faint" />
            <Line d={pad.line} tone="faint" />
            <Dots points={pad.dots} size={0.55} tone="mid" />
        </g>
    ));

    const piece = (index: number, lit: boolean) => {
        const art = PIECE_ART[index]!;
        return (
            <g key={`piece-${index}-${lit ? 'lit' : 'rest'}`}>
                <Solid paths={art.body} tone="hi" crease="faint" lit={lit} />
                <Line d={art.ribs} tone="faint" />
                <Line d={art.seam} tone="faint" />
                <Line d={art.top} tone="lo" />
            </g>
        );
    };

    const PIECES = SHAPES.map((_, index) => piece(index, false));
    const PIECE_LIT = piece(TARGET, true);

    return { BASE, BLOCK, PAD_NODES, PIECES, PIECE_LIT };
}

type Result = { piece: number; state: 'trying' | 'done' } | null;

interface View {
    poses: Pose[];
    moving: number;
    placed: boolean;
    result: Result;
}

const REST: View = { poses: SHAPES.map((_, index) => poseOf(index, 0)), moving: -1, placed: false, result: null };

export function SorterFigure({ copy }: { copy: SorterCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const clock = useRef(0);
    const attempt = useRef<{ piece: number; start: number } | null>(null);
    const placed = useRef(false);
    const result = useRef<Result>(null);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: -1, wait: FIRST });
    const frame = useRef(0);
    const last = useRef(0);
    const [view, setView] = useState<View>(REST);
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
    const shift = shiftOf(P);

    const snapshot = useCallback(() => {
        const now = attempt.current;
        const poses = SHAPES.map((_, index) => {
            if (now?.piece === index) return poseOf(index, clock.current - now.start);
            if (index === TARGET && placed.current) return poseOf(index, 99);
            return poseOf(index, 0);
        });
        setView({ poses, moving: now?.piece ?? (placed.current ? TARGET : -1), placed: placed.current && !now, result: result.current });
    }, []);

    const choose = useCallback(
        (index: number, byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            placed.current = false;
            if (calm) {
                attempt.current = null;
                placed.current = fits(index);
                result.current = { piece: index, state: 'done' };
            } else {
                attempt.current = { piece: index, start: clock.current };
                result.current = { piece: index, state: 'trying' };
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
            const now = attempt.current;
            if (now && clock.current - now.start >= durationOf(now.piece)) {
                placed.current = fits(now.piece);
                result.current = { piece: now.piece, state: 'done' };
                attempt.current = null;
                plan.current.wait = fits(now.piece) ? 3 : 0.8;
            }
            if (!attempt.current && playingRef.current && clock.current - lastUser.current > IDLE_AFTER) {
                plan.current.wait -= dt;
                if (plan.current.wait <= 0) {
                    plan.current.index = (plan.current.index + 1) % TOUR.length;
                    choose(TOUR[plan.current.index]!, false);
                }
            }
            if (attempt.current) snapshot();
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, choose, snapshot]);

    const status = (() => {
        const r = view.result;
        if (!r) return copy.idle;
        const n = r.piece + 1;
        if (r.state === 'trying') return fill(copy.trying, { n });
        return fill(fits(r.piece) ? copy.yes : copy.no, { n });
    })();

    useEffect(() => {
        say(status);
    }, [say, status]);

    const draw = (index: number) => {
        const pose = view.poses[index]!;
        const lit = index === TARGET && view.placed;
        const group = (
            <g key={`group-${index}`} data-part={`piece-${index}`} transform={shift(pose.x, pose.y, pose.z)}>
                {lit ? nodes.PIECE_LIT : nodes.PIECES[index]}
            </g>
        );
        return pose.sunk ? (
            <g key={`clip-${index}`} clipPath={`url(#sorter-chimney)`}>
                {group}
            </g>
        ) : (
            group
        );
    };

    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'block', box: [-72, 72, -70, 10, 0, 40], node: nodes.BLOCK },
        ...nodes.PAD_NODES.map((node, index) => ({ id: `pad-${index}`, box: [trayX(index) - 31, trayX(index) + 31, TRAY_Y - 31, TRAY_Y + 31, 0, 2] as Box, node })),
        ...SHAPES.map((_, index): Layer<ReactNode> => {
            const pose = view.poses[index]!;
            return { id: `piece-${index}`, box: [pose.x - 28, pose.x + 28, pose.y - 28, pose.y + 28, pose.z, pose.z + PIECE_H], node: draw(index), after: pose.sunk ? ['block'] : undefined };
        }),
    ];

    return (
        <Plate fig={copy.fig} lead={<CornerControls playing={playing} onToggle={() => setPlaying(value => !value)} zoom={zoom} reset={{ disabled: !orbit.turned && zoom.zoom === 1, onReset: () => {
                orbit.reset();
                zoom.reset();
            } }} labels={copy} />} title={copy.title} hint={copy.hint} readout={copy.idle} keys={copy.keys.map((label, index) => ({ mark: index ? 'raised' : 'lit', label }))} caption={copy.caption}>
            <div
                ref={anchor}
            >
                <div className={`${styles.orbit} ${styles.viewport}`} data-dragging={orbit.dragging ? '' : undefined} {...orbit.handlers}>
                    <div className={styles.zoomed} style={{ transform: `scale(${zoom.zoom})` }}>
                    <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
                        <clipPath id="sorter-chimney">
                            <path d={art.BLOCK_ART.chimney} />
                        </clipPath>
                        {ordered(layers, P).map(layer => (
                            <Fragment key={layer.id}>{layer.node}</Fragment>
                        ))}
                    </IsoFigure>
                    </div>
                </div>
                <div className={styles.controls} role="group" aria-label={copy.controls}>
                    <div className={styles.group}>
                        {SHAPES.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={styles.button}
                                aria-pressed={view.result?.piece === index}
                                aria-label={copy.pieces[index]}
                                onClick={() => choose(index, true)}
                            >
                                <svg className={styles.glyph} viewBox="0 0 14 14" aria-hidden="true">
                                    {GLYPHS[index]}
                                </svg>
                                {copy.names[index]}
                            </button>
                        ))}
                    </div>
                </div>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-live="polite">
                    {status}
                </span>
            </div>
        </Plate>
    );
}
