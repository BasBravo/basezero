'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, EXTRAS, GAP_Z, headingAt, TILES, type Art } from './geometry';
import { COUPLING, engineBox, wagonBox } from '../train';
import { PartsNode } from '../shared';
import { shiftOf } from '../orbit';
import { useOrbit } from '../useOrbit';
import { advance, pointAt } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface CircuitCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    full: string;
    small: string;
    cutStatus: string;
    chipWhole: string;
    chipCut: string;
    aria: string;
    extras: string;
    track: string;
    controls: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
type Op = 'small' | 'cut' | 'fix' | 'full';
/** The demo: leave the extras out, then take a tile away, then put everything back. */
const TOUR: [Op, number][] = [
    ['small', 4],
    ['cut', 5.5],
    ['fix', 2.5],
    ['full', 3.5],
];
const LABEL =
    'A small toy railway: a closed circuit of track on a base plate with a train running round it, and three small buildings around it that the train does not need. The buildings can be left out, shown as dotted outlines, and the circuit keeps working. If one tile of the track is taken away, the train stops in front of the gap.';

function nodesOf(art: Art) {
    const BASE = <BaseNode key="base" art={art.BASE_ART} />;
    const TILE_NODES = art.TILE_ART.map((tile, index) => (
        <g key={`tile-${index}`}>
            <Solid paths={tile.slab} tone="lo" crease="faint" />
            <Line d={tile.sleepers} tone="faint" />
        </g>
    ));
    const EXTRA_NODES = art.EXTRA_ART.map((extra, index) => (
        <g key={`extra-${index}`}>
            <path className="iso-halo" d={extra.halo} />
            <PartsNode parts={extra.parts} />
        </g>
    ));
    const ENGINE = art.ENGINE.map((parts, heading) => <PartsNode key={`engine-${heading}`} parts={parts} lit />);
    const WAGON = art.WAGON.map((parts, heading) => <PartsNode key={`wagon-${heading}`} parts={parts} />);
    return { BASE, TILE_NODES, EXTRA_NODES, ENGINE, WAGON };
}

interface View {
    distance: number;
    extras: boolean;
    cut: boolean;
}

export function CircuitFigure({ copy }: { copy: CircuitCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const clock = useRef(0);
    const distance = useRef(0);
    const extras = useRef(true);
    const cut = useRef(false);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: 0, wait: 2 });
    const frame = useRef(0);
    const last = useRef(0);
    const [view, setView] = useState<View>({ distance: 0, extras: true, cut: false });
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

    const snapshot = useCallback(() => setView({ distance: distance.current, extras: extras.current, cut: cut.current }), []);

    const act = useCallback(
        (op: Op, byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            if (op === 'small') extras.current = false;
            else if (op === 'full') extras.current = true;
            else cut.current = op === 'cut';
            snapshot();
        },
        [snapshot],
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
                    act(op, false);
                }
            }
            const before = distance.current;
            distance.current = advance(before, dt, cut.current);
            if (distance.current !== before) snapshot();
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, act, snapshot]);

    const status = view.cut ? copy.cutStatus : view.extras ? copy.full : copy.small;
    useEffect(() => {
        say(status);
    }, [say, status]);

    const engineAt = pointAt(view.distance);
    const wagonAt = pointAt(view.distance - COUPLING);
    const engineHeading = headingAt(engineAt);
    const wagonHeading = headingAt(wagonAt);
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        ...TILES.map(({ id, plan, gap }, index): Layer<ReactNode> => ({
            id,
            box: [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d, 0, gap && view.cut ? GAP_Z : 2],
            node: gap && view.cut ? <Line key={id} d={art.GAP_GHOST} tone="red" dotted /> : nodes.TILE_NODES[index],
        })),
        { id: 'rails', box: [-90, 90, -46, 46, 2, 2], node: <Line key="rails" d={view.cut ? art.RAILS_CUT : art.RAILS} tone="hi" /> },
        ...EXTRAS.map(({ plan, height }, index): Layer<ReactNode> => ({
            id: `extra-${index}`,
            box: [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d, 0, height],
            node: view.extras ? nodes.EXTRA_NODES[index] : <Line key={`ghost-${index}`} d={art.EXTRA_ART[index]!.ghost} tone="mid" dotted />,
        })),
        { id: 'wagon', box: wagonBox(wagonHeading, wagonAt), node: <g key="wagon" transform={shift(wagonAt[0], wagonAt[1], 0)}>{nodes.WAGON[wagonHeading]}</g> },
        { id: 'engine', box: engineBox(engineHeading, engineAt), node: <g key="engine" data-part="engine" transform={shift(engineAt[0], engineAt[1], 0)}>{nodes.ENGINE[engineHeading]}</g> },
    ];

    return (
        <Plate fig={copy.fig} status={{ state: view.cut ? 'fail' : 'pass', label: view.cut ? copy.chipCut : copy.chipWhole }} lead={<CornerControls playing={playing} onToggle={() => setPlaying(value => !value)} zoom={zoom} reset={{ disabled: !orbit.turned && zoom.zoom === 1, onReset: () => {
                orbit.reset();
                zoom.reset();
            } }} labels={copy} />} title={copy.title} hint={copy.hint} readout={copy.full} keys={copy.keys.map((label, index) => ({ mark: index ? 'dotted' : 'lit', label }))} caption={copy.caption}>
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
                        <button type="button" className={styles.button} aria-pressed={view.extras} onClick={() => act(view.extras ? 'small' : 'full', true)}>
                            {copy.extras}
                        </button>
                        <button type="button" className={styles.button} aria-pressed={!view.cut} onClick={() => act(view.cut ? 'fix' : 'cut', true)}>
                            {copy.track}
                        </button>
                    </div>
                </div>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-live="polite">
                    {status}
                </span>
            </div>
        </Plate>
    );
}
