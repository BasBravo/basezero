'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IsoFigure, Line, Plate, Solid } from '@/components/iso/draw';
import { useReadout } from '@/components/iso/live';
import { BaseNode } from '../base';
import { fill } from '../shared';
import { useInView, useReducedMotion } from '../hooks';
import styles from '../figures.module.css';
import { ARM_CLOSED, ARM_OPEN, ARM_H, artOf, BUFFER, BUFFER_H, GATE_POST_H, GATE_Y, STATION_X, TILES, FLAG_TOP, type Art } from './geometry';
import { shiftOf } from '../orbit';
import { useOrbit } from '../useOrbit';
import { arrives, BRANCHES, durationOf, goTime, poseOf, type Branch, type Pose } from './model';
import { BASE as BASE_PLAN, CENTRE, HEIGHT, projectionFor, WIDTH } from './view';
import { ordered, type Box, type Layer } from '../painter';
import { CornerControls } from '../PlayButton';
import { useZoom } from '../useZoom';

export interface RailsCopy {
    fig: string;
    title: string;
    hint: string;
    keys: string[];
    caption: string;
    idle: string;
    going: string;
    wrong: string;
    right: string;
    chipWrong: string;
    chipRight: string;
    aria: string;
    names: string[];
    branches: string[];
    send: string;
    controls: string;
    reset: string;
    play: string;
    pause: string;
    zoomIn: string;
    zoomOut: string;
}

const IDLE_AFTER = 7;
const FIRST = 1.6;
const BREATH = 1.7;
/** The demo: the switch is left on the wrong branch and the train goes there; then it is changed and the train goes again. */
const TOUR: ({ select: Branch } | 'send')[] = [{ select: 1 }, 'send', { select: 0 }, 'send'];
const LABEL =
    'A small railway on a base plate. One line splits at a junction into two branches that each end at a station. Only the station at the back has a flag. Two barriers decide which branch is open. A small train runs to the end of the open branch, waits and comes back.';

function nodesOf(art: Art) {
    const BASE = <BaseNode key="base" art={art.BASE_ART} />;

    const TILE_NODES = art.TILE_ART.map((tile, index) => (
        <g key={`tile-${index}`}>
            <Solid paths={tile.slab} tone="lo" crease="faint" />
            <Line d={tile.sleepers} tone="faint" />
            <Line d={tile.rails} tone="mid" />
        </g>
    ));

    const BUFFER_NODE = (
        <g key="buffer">
            <Solid paths={art.BUFFER_ART.block} tone="mid" crease="faint" />
            <Line d={art.BUFFER_ART.top} tone="faint" />
        </g>
    );

    const POSTS = art.GATES.map((gate, index) =>
        gate.posts.map((post, side) => (
            <g key={`post-${index}-${side}`}>
                <Solid paths={post.body} tone="mid" crease="faint" />
                <Line d={post.cap} tone="faint" />
            </g>
        )),
    );

    const STATION_NODES = art.STATIONS.map((station, index) => (
        <g key={`station-${index}`}>
            <path className="iso-halo" d={station.halo} />
            <Solid paths={station.body} tone={index ? 'lo' : 'mid'} crease="faint" />
            <Solid paths={station.roof} tone="hi" crease="faint" />
            <Line d={station.roofLine} tone="faint" />
            {index === 0 && (
                <>
                    <Solid paths={art.FLAG.pole} tone="hi" crease="none" />
                    <Solid paths={art.FLAG.cloth} tone="hi" crease="faint" lit />
                </>
            )}
        </g>
    ));

    const CART = (
        <g key="cart">
            <Solid paths={art.CART.body} tone="hi" crease="faint" />
            <Solid paths={art.CART.cabin} tone="hi" crease="faint" />
            <Solid paths={art.CART.chimney} tone="lo" crease="faint" />
        </g>
    );

    return { BASE, TILE_NODES, BUFFER_NODE, POSTS, STATION_NODES, CART };
}

interface View {
    selected: Branch;
    pose: Pose;
    gates: [number, number];
    state: 'idle' | 'going' | 'done';
    branch: Branch;
    running: boolean;
}

const gateOf = (selected: Branch, gate: Branch) => (selected === gate ? ARM_OPEN : ARM_CLOSED);
const REST: View = { selected: 1, pose: poseOf(1, 0), gates: [gateOf(1, 0), gateOf(1, 1)], state: 'idle', branch: 1, running: false };

export function RailsFigure({ copy }: { copy: RailsCopy }) {
    const { anchor, say } = useReadout<HTMLDivElement>();
    const inView = useInView(anchor);
    const calm = useReducedMotion();
    const clock = useRef(0);
    const selected = useRef<Branch>(1);
    const attempt = useRef<{ branch: Branch; start: number } | null>(null);
    const outcome = useRef<{ branch: Branch; state: 'going' | 'done' } | null>(null);
    const gates = useRef<[number, number]>([gateOf(1, 0), gateOf(1, 1)]);
    const lastUser = useRef(-Infinity);
    const plan = useRef({ index: 0, wait: FIRST });
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
        const result = outcome.current;
        const pose = now ? poseOf(now.branch, clock.current - now.start) : result && calm ? poseOf(result.branch, goTime(result.branch)) : poseOf(selected.current, 0);
        const state = !result ? 'idle' : now && !pose.arrived ? 'going' : 'done';
        setView({ selected: selected.current, pose, gates: [gates.current[0], gates.current[1]], state, branch: result?.branch ?? selected.current, running: Boolean(now) });
    }, [calm]);

    const select = useCallback(
        (branch: Branch, byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            if (attempt.current) return;
            selected.current = branch;
            outcome.current = null;
            if (calm) gates.current = [gateOf(branch, 0), gateOf(branch, 1)];
            snapshot();
        },
        [calm, snapshot],
    );

    const send = useCallback(
        (byUser: boolean) => {
            if (byUser) lastUser.current = clock.current;
            if (attempt.current) return;
            const branch = selected.current;
            outcome.current = { branch, state: 'going' };
            attempt.current = calm ? null : { branch, start: clock.current };
            if (calm) outcome.current = { branch, state: 'done' };
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
            if (now && clock.current - now.start >= durationOf(now.branch)) {
                attempt.current = null;
                outcome.current = { branch: now.branch, state: 'done' };
                plan.current.wait = BREATH;
            }
            if (!attempt.current && playingRef.current && clock.current - lastUser.current > IDLE_AFTER) {
                plan.current.wait -= dt;
                if (plan.current.wait <= 0) {
                    const op = TOUR[plan.current.index % TOUR.length]!;
                    plan.current.index += 1;
                    plan.current.wait = BREATH;
                    if (op === 'send') send(false);
                    else select(op.select, false);
                }
            }
            let moving = false;
            for (const gate of BRANCHES) {
                const goal = gateOf(selected.current, gate);
                const next = gates.current[gate] + (goal - gates.current[gate]) * (1 - Math.exp(-dt / 0.12));
                gates.current[gate] = Math.abs(goal - next) < 0.05 ? goal : next;
                if (gates.current[gate] !== goal) moving = true;
            }
            if (attempt.current || moving) snapshot();
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [inView, calm, select, send, snapshot]);

    const name = copy.names[view.branch]!;
    const status = view.state === 'idle' ? copy.idle : view.state === 'going' ? fill(copy.going, { name }) : arrives(view.branch) ? copy.right : copy.wrong;

    useEffect(() => {
        say(status);
    }, [say, status]);

    const { pose } = view;
    const layers: Layer<ReactNode>[] = [
        { id: 'base', box: [BASE_PLAN.x, BASE_PLAN.x + BASE_PLAN.w, BASE_PLAN.y, BASE_PLAN.y + BASE_PLAN.d, -14, 0], node: nodes.BASE },
        ...TILES.map(({ id, plan }, index): Layer<ReactNode> => ({ id, box: [plan.x, plan.x + plan.w, plan.y, plan.y + plan.d, 0, 2], node: nodes.TILE_NODES[index] })),
        { id: 'buffer', box: [BUFFER.x, BUFFER.x + BUFFER.w, BUFFER.y, BUFFER.y + BUFFER.d, 0, BUFFER_H], node: nodes.BUFFER_NODE },
        ...GATE_Y.flatMap((y, gate) => [
            ...[-36, -8].map((x, side): Layer<ReactNode> => ({ id: `post-${gate}-${side}`, box: [x, x + 4, y - 2, y + 2, 0, GATE_POST_H], node: nodes.POSTS[gate]![side] })),
            {
                id: `arm-${gate}`,
                box: [-32, -8, y - 1, y + 1, view.gates[gate]!, view.gates[gate]! + ARM_H] as Box,
                node: (
                    <g key={`arm-${gate}`} transform={shift(0, 0, view.gates[gate]!)}>
                        <Solid paths={art.GATES[gate]!.arm} tone={view.gates[gate]! > (ARM_OPEN + ARM_CLOSED) / 2 ? 'lo' : 'hi'} crease="faint" />
                        <Line d={art.GATES[gate]!.stripes} tone="faint" />
                    </g>
                ),
            },
        ]),
        ...art.STATIONS.map((_, index): Layer<ReactNode> => {
            const y0 = index ? 26 : -62;
            return { id: `station-${index}`, box: [STATION_X[0] - 4, STATION_X[1] + 4, y0 - 4, y0 + 40, 0, index ? 28 : FLAG_TOP], node: nodes.STATION_NODES[index] };
        }),
        { id: 'cart', box: [pose.x - 10, pose.x + 10, pose.y - 10, pose.y + 10, 2, 19], node: <g key="cart" data-part="cart" transform={shift(pose.x, pose.y, 0)}>{nodes.CART}</g> },
    ];

    const busy = view.running;
    const chip = view.state === 'idle' ? '—' : view.state === 'going' ? '…' : arrives(view.branch) ? copy.chipRight : copy.chipWrong;

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
                        {BRANCHES.map(branch => (
                            <button key={branch} type="button" className={styles.button} aria-pressed={view.selected === branch} disabled={busy} onClick={() => select(branch, true)}>
                                {copy.branches[branch]}
                            </button>
                        ))}
                    </div>
                    <button type="button" className={styles.button} disabled={busy} onClick={() => send(true)}>
                        {copy.send}
                    </button>
                    <span className={styles.chip} data-state={view.state === 'done' ? (arrives(view.branch) ? 'pass' : 'fail') : 'idle'} role="status">
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
