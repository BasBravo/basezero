'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dots, IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { fill } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { artOf, type Art } from './geometry';
import { useOrbit } from '../useOrbit';
import { clampTeams, decisionOf, springStep, TEAMS, type Decision } from './model';
import { BASE as BASE_PLAN, CALENDAR, CALENDAR_H, CENTRE, DIAL, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface GaugeCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    status: string;
    names: string[];
    aria: string;
    spoken: string;
    active: string;
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
const START_TEAMS = 3;
/** The demo: the reading after four weeks, from a clear yes down to a clear no and back. */
const TOUR = [6, 5, 4, 3, 2, 1, 0, 2, 3, 5, 8];
const HOLD = 1.8;
const ORDER: Decision[] = ['stop', 'change', 'keep'];
const LABEL =
    'A round meter on a base plate, its dial divided into three zones: stop, change and keep going. Two pins screwed into the dial mark the limits between the zones, set before launch. The needle points at how many of eight teams still use the tool in the third week. Beside it, a desk calendar with the day of the decision ringed.';

function nodesOf(art: Art) {
    const BASE = (
        <g key="base">
            <BaseNode art={art.BASE_ART} />
            <Solid paths={art.LABEL.plate} tone="lo" crease="none" />
            <Line d={art.LABEL.line} tone="faint" />
            <Line d={art.LABEL.rule} tone="lo" free />
            <Dots points={art.LABEL.screws} size={0.45} tone="mid" />
        </g>
    );

    const CALENDAR_NODE = (
        <g key="calendar">
            <path className="iso-halo" d={art.CAL.halo} />
            <Solid paths={art.CAL.block} tone="mid" crease="faint" />
            <Line d={art.CAL.page} tone="faint" />
            <Line d={art.CAL.binding} tone="lo" />
            <Dots points={art.CAL.rings} size={0.45} tone="mid" />
            <Dots points={art.CAL.days} size={0.42} tone="lo" />
            <Line d={art.CAL.mark} tone="hi" />
        </g>
    );

    const DRUM = (
        <g key="drum">
            <path className="iso-halo" d={art.DRUM.halo} />
            <Solid paths={art.DRUM.foot} tone="lo" crease="faint" />
            <Solid paths={art.DRUM.body} tone="mid" crease="faint" />
            <Line d={art.DRUM.seam} tone="faint" />
            <Line d={art.DRUM.bezel} tone="faint" />
            <Line d={art.SCALE.rim} tone="lo" />
            <Line d={art.SCALE.minor} tone="lo" />
            <Line d={art.SCALE.major} tone="mid" />
            <Line d={art.ENDS} tone="lo" />
            <Dots points={art.SCALE.stops} size={0.45} tone="mid" />
        </g>
    );

    const PINS = (
        <g key="pins">
            {art.PINS.map((pin, index) => (
                <g key={index}>
                    <Solid paths={pin.body} tone="hi" crease="faint" />
                    <Dots points={[pin.head]} size={0.4} tone="mid" />
                </g>
            ))}
        </g>
    );

    const HUB = (
        <g key="hub">
            <Solid paths={art.HUB.body} tone="mid" crease="faint" />
            <Solid paths={art.HUB.cap} tone="hi" crease="faint" />
        </g>
    );

    return { BASE, CALENDAR_NODE, DRUM, PINS, HUB };
}

export function GaugeFigure({ copy }: { copy: GaugeCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const [teams, setTeams] = useState(START_TEAMS);
    const target = useRef(START_TEAMS);
    const needle = useRef({ value: START_TEAMS, speed: 0 });
    const clock = useRef(0);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: -1, wait: 1.4 });
    const frame = useRef(0);
    const last = useRef(0);
    const painted = useRef(Number.NaN);
    const fillRef = useRef<SVGPathElement | null>(null);
    const edgeRef = useRef<SVGPathElement | null>(null);
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

    const paint = useCallback((value: number, force = false) => {
        if (!force && Math.abs(value - painted.current) < 0.002) return;
        painted.current = value;
        const d = artRef.current.needleOf(value);
        fillRef.current?.setAttribute('d', d);
        edgeRef.current?.setAttribute('d', d);
    }, []);

    useEffect(() => {
        artRef.current = art;
        paint(needle.current.value, true);
    }, [art, paint]);

    useEffect(() => {
        if (!inView || calm) {
            needle.current = { value: target.current, speed: 0 };
            paint(needle.current.value);
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
                    plan.current.index = (plan.current.index + 1) % TOUR.length;
                    target.current = TOUR[plan.current.index]!;
                    setTeams(target.current);
                    plan.current.wait = HOLD;
                }
            }
            // Small steps keep the spring stable even when a frame comes late.
            for (let step = 0; step < 4; step++) needle.current = springStep(needle.current, target.current, dt / 4);
            if (Math.abs(needle.current.value - target.current) < 0.001 && Math.abs(needle.current.speed) < 0.001) needle.current = { value: target.current, speed: 0 };
            paint(needle.current.value);
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, paint]);

    // Under reduced motion there is no loop, so the needle jumps straight to each new reading.
    useEffect(() => {
        if (!calm) return;
        needle.current = { value: teams, speed: 0 };
        paint(teams);
    }, [calm, teams, paint]);

    const set = (value: number) => {
        lastUser.current = clock.current;
        target.current = clampTeams(value);
        setTeams(target.current);
    };

    const decision = decisionOf(teams);
    const name = copy.names[ORDER.indexOf(decision)]!;
    const status = fill(copy.status, { n: teams, total: TEAMS, decision: name });

    useEffect(() => {
        say(status);
    }, [say, status]);

    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        { id: 'calendar', box: [CALENDAR.x, CALENDAR.x + CALENDAR.w, CALENDAR.y, CALENDAR.y + CALENDAR.d, 0, CALENDAR_H], node: nodes.CALENDAR_NODE },
        {
            id: 'drum',
            box: [DIAL.x - DIAL.r - 4, DIAL.x + DIAL.r + 4, DIAL.y - DIAL.r - 4, DIAL.y + DIAL.r + 4, 0, DIAL.z + 6],
            node: (
                <g key="dial">
                    {nodes.DRUM}
                    {ORDER.map(zone => (
                        <Line key={zone} d={art.ZONES[zone]} tone={zone === decision ? 'hi' : 'faint'} />
                    ))}
                    {nodes.PINS}
                    <g className="iso-solid" data-lit="">
                        <path ref={fillRef} className="iso-fill" />
                        <path ref={edgeRef} className="iso-line iso-edge" data-tone="lit" />
                    </g>
                    {nodes.HUB}
                </g>
            ),
        },
    ];

    return (
        <Plate fig={copy.fig} lead={<CornerControls playing={playing} onToggle={() => setPlaying(value => !value)} zoom={zoom} reset={{ disabled: !orbit.turned && zoom.zoom === 1, onReset: () => {
                orbit.reset();
                zoom.reset();
            } }} labels={copy} />} title={copy.title} hint={copy.hint} readout={status} keys={copy.keys.map((label, index) => ({ mark: index ? 'raised' : 'lit', label }))} caption={copy.caption}>
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
                    <button type="button" className={styles.button} aria-label={copy.less} disabled={teams === 0} onClick={() => set(teams - 1)}>
                        −
                    </button>
                    <label className={styles.slider}>
                        <span>{copy.active}</span>
                        <input
                            className={styles.range}
                            type="range"
                            min={0}
                            max={TEAMS}
                            step={1}
                            value={teams}
                            aria-valuetext={fill(copy.spoken, { n: teams, total: TEAMS, decision: name })}
                            onChange={event => set(Number(event.target.value))}
                        />
                        <span className={styles.value}>
                            {teams} / {TEAMS}
                        </span>
                    </label>
                    <button type="button" className={styles.button} aria-label={copy.more} disabled={teams === TEAMS} onClick={() => set(teams + 1)}>
                        +
                    </button>
                    <span className={styles.chip} data-state={decision === 'keep' ? 'pass' : decision === 'stop' ? 'fail' : 'idle'} role="status">
                        {name}
                    </span>
                </div>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-live="polite">
                    {status}
                </span>
            </div>
        </Plate>
    );
}
