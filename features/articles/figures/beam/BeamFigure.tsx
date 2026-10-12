'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dots, IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { fill, LiveSolid, paintSolid } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, type Art } from './geometry';
import { shiftOf } from '../orbit';
import { useOrbit } from '../useOrbit';
import { dropOf, LIMIT_MM, limitZ, loadOf, passes, PLATES, REST_Z, sagOf, THICK } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, SUPPORT_W, SUPPORT_X, SUPPORT_Y, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface BeamCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    idle: string;
    status: string;
    pass: string;
    fail: string;
    decimal: string;
    aria: string;
    spoken: string;
    load: string;
    less: string;
    more: string;
    controls: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
const TOUR = [0, 2, 4, 5, 6, 8, 5, 0];
const HOLD = 1.6;
const LABEL =
    'A plank resting on two blocks on a base plate, with weight plates stacked on its middle. The plank sags under the load. A thin wire stretched under it between the blocks marks the limit that was set beforehand, and a pair of dotted towers and a cable in the background stand for the whole bridge that does not need to be built.';

const mm = (value: number, decimal: string) => value.toFixed(1).replace('.', decimal);

function nodesOf(art: Art) {
    const { BASE_ART, GHOST, SUPPORT_ART } = art;

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
            <Solid paths={BASE_ART.strip} tone="lo" crease="none" />
            <Line d={BASE_ART.stripBase} tone="faint" />
            <Line d={BASE_ART.stripMinor} tone="lo" />
            <Line d={BASE_ART.stripMajor} tone="mid" />
        </g>
    );

    const GHOST_LEFT = (
        <g key="ghost-left">
            <Line d={GHOST.far.legs} tone="mid" dotted free />
            <Line d={GHOST.far.top} tone="mid" dotted />
            <Line d={GHOST.far.deck} tone="mid" dotted free />
        </g>
    );

    const GHOST_RIGHT = (
        <g key="ghost-right">
            <Line d={GHOST.near.legs} tone="mid" dotted free />
            <Line d={GHOST.near.top} tone="mid" dotted />
            <Line d={GHOST.near.deck} tone="mid" dotted free />
        </g>
    );

    const CABLE = <Line key="cable" d={GHOST.cable} tone="mid" dotted />;

    const supportNode = (index: number) => {
        const art = SUPPORT_ART[index]!;
        return (
            <g key={`support-${index}`}>
                <path className="iso-halo" d={art.halo} />
                <Solid paths={art.foot} tone="lo" crease="faint" />
                <Solid paths={art.block} tone="mid" crease="faint" />
                <Line d={art.groove} tone="faint" />
                <Dots points={art.screws} size={0.5} tone="mid" />
            </g>
        );
    };

    const LEFT = supportNode(0);
    const RIGHT = supportNode(1);

    return { BASE, GHOST_LEFT, GHOST_RIGHT, CABLE, LEFT, RIGHT };
}

export function BeamFigure({ copy }: { copy: BeamCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const [plates, setPlates] = useState(0);
    const target = useRef(0);
    const shown = useRef(0);
    const clock = useRef(0);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: -1, wait: 1.4 });
    const frame = useRef(0);
    const last = useRef(0);
    const painted = useRef(-1);
    const plank = useRef<SVGGElement | null>(null);
    const grain = useRef<SVGPathElement | null>(null);
    const stack = useRef<SVGGElement | null>(null);
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

    const paint = useCallback((drop: number, force = false) => {
        if (!force && Math.abs(drop - painted.current) < 0.005) return;
        painted.current = drop;
        paintSolid(plank.current, artRef.current.plankOf(drop));
        grain.current?.setAttribute('d', artRef.current.GRAIN(drop));
        stack.current?.setAttribute('transform', shiftRef.current(0, 0, REST_Z + THICK - drop));
    }, []);

    useEffect(() => {
        artRef.current = art;
        shiftRef.current = shiftOf(P);
        paint(shown.current, true);
    }, [art, P, paint]);

    useEffect(() => {
        const goal = () => dropOf(sagOf(loadOf(target.current)));
        if (!inView) {
            shown.current = goal();
            paint(shown.current);
            return;
        }
        last.current = 0;
        const tick = (time: number) => {
            const dt = last.current ? Math.min((time - last.current) / 1000, 1 / 20) : 0;
            last.current = time;
            clock.current += dt;
            if (!calm && playingRef.current && clock.current - lastUser.current > IDLE_AFTER) {
                plan.current.wait -= dt;
                if (plan.current.wait <= 0) {
                    plan.current.index = (plan.current.index + 1) % TOUR.length;
                    target.current = TOUR[plan.current.index]!;
                    setPlates(target.current);
                    plan.current.wait = HOLD;
                }
            }
            const wanted = goal();
            shown.current = calm ? wanted : shown.current + (wanted - shown.current) * (1 - Math.exp(-dt / 0.14));
            if (Math.abs(wanted - shown.current) < 0.02) shown.current = wanted;
            paint(shown.current);
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, paint]);

    const set = (value: number) => {
        lastUser.current = clock.current;
        target.current = Math.min(PLATES, Math.max(0, Math.round(value)));
        setPlates(target.current);
    };

    const kg = loadOf(plates);
    const sag = sagOf(kg);
    const ok = passes(plates);
    const result = ok ? copy.pass : copy.fail;
    const status = plates === 0 ? copy.idle : fill(copy.status, { kg, sag: mm(sag, copy.decimal), result });

    useEffect(() => {
        say(status);
    }, [say, status]);

    const nearSide = Math.cos(((P.azimuth ?? 0) * Math.PI) / 180) >= 0 ? 1 : -1;
    const sx = SUPPORT_X + SUPPORT_W;
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'tower-left', box: [-173, -171, -14, 14, 0, 128], node: nodes.GHOST_LEFT },
        { id: 'tower-right', box: [171, 173, -14, 14, 0, 128], node: nodes.GHOST_RIGHT },
        { id: 'cable', box: [-172, 172, -1, 1, 74, 128], node: nodes.CABLE },
        { id: 'support-left', box: [-sx - 4, -SUPPORT_X + 4, -SUPPORT_Y - 4, SUPPORT_Y + 4, 0, REST_Z], node: nodes.LEFT },
        { id: 'support-right', box: [SUPPORT_X - 4, sx + 4, -SUPPORT_Y - 4, SUPPORT_Y + 4, 0, REST_Z], node: nodes.RIGHT },
        {
            id: 'plank',
            box: [-135, 135, -24, 24, REST_Z, REST_Z + THICK],
            node: (
                <>
                    <LiveSolid gref={node => void (plank.current = node)} tone="hi" />
                    <path ref={grain} className="iso-line" data-tone="faint" />
                </>
            ),
        },
        {
            id: 'plates',
            box: [-22, 22, -18, 18, REST_Z, REST_Z + THICK + 70],
            after: ['plank'],
            node: (
                <g ref={stack}>
                    {art.PLATE_ART.slice(0, plates).map((plate, index) => (
                        <g key={index}>
                            <Solid paths={plate.body} tone={plate.tone} crease="faint" />
                            <Line d={plate.band} tone="faint" />
                        </g>
                    ))}
                </g>
            ),
        },
        {
            id: 'wire',
            box: [-SUPPORT_X, SUPPORT_X, 24, 24.6, limitZ, limitZ + 0.6],
            after: ['plank'],
            ignore: ['support-left', 'support-right'],
            node: (
                <g clipPath="url(#beam-front)">
                    <Line d={art.WIRE} tone="lit" dotted={ok} />
                    <Dots points={art.WIRE_EYES} size={0.9} tone="hi" />
                </g>
            ),
        },
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
                        <clipPath id="beam-front">
                            <path d={`M-100 -100H900V600H-100Z${art.SUPPORT_ART[nearSide > 0 ? 1 : 0]!.block.outline}`} clipRule="evenodd" />
                        </clipPath>
                        {ordered(layers, P).map(layer => (
                            <Fragment key={layer.id}>{layer.node}</Fragment>
                        ))}
                    </IsoFigure>
                    </div>
                </div>
                <div className={styles.controls} role="group" aria-label={copy.controls}>
                    <button type="button" className={styles.button} aria-label={copy.less} disabled={plates === 0} onClick={() => set(plates - 1)}>
                        −
                    </button>
                    <label className={styles.slider}>
                        <span>{copy.load}</span>
                        <input
                            className={styles.range}
                            type="range"
                            min={0}
                            max={PLATES}
                            step={1}
                            value={plates}
                            aria-valuetext={fill(copy.spoken, { kg, sag: mm(sag, copy.decimal), limit: LIMIT_MM, result })}
                            onChange={event => set(Number(event.target.value))}
                        />
                        <span className={styles.value}>{kg} kg</span>
                    </label>
                    <button type="button" className={styles.button} aria-label={copy.more} disabled={plates === PLATES} onClick={() => set(plates + 1)}>
                        +
                    </button>
                    <span className={styles.chip} data-state={plates === 0 ? 'idle' : ok ? 'pass' : 'fail'} role="status">
                        {plates === 0 ? '—' : result}
                    </span>
                </div>
            </div>
        </Plate>
    );
}
