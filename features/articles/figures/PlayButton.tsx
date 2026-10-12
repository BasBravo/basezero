import styles from './figures.module.css';

/** Autoplay is on by default; pausing stops only the automatic demo, never what the user does by hand. It sits in the same corner of every figure. */
export function PlayButton({ playing, onToggle, play, pause }: { playing: boolean; onToggle: () => void; play: string; pause: string }) {
    return (
        <button type="button" className={styles.play} aria-pressed={!playing} aria-label={playing ? pause : play} title={playing ? pause : play} onClick={onToggle}>
            <svg viewBox="0 0 14 14" aria-hidden="true">
                {playing ? (
                    <>
                        <rect x={3} y={2} width={2.8} height={10} />
                        <rect x={8.2} y={2} width={2.8} height={10} />
                    </>
                ) : (
                    <polygon points="3.5,2 12,7 3.5,12" />
                )}
            </svg>
        </button>
    );
}

export interface ZoomControls {
    closer: () => void;
    further: () => void;
    atMax: boolean;
    atMin: boolean;
}

/** The small bordered icon controls shared by every figure, in one corner: play/pause, zoom out, zoom in, reset view. */
export function CornerControls({
    playing,
    onToggle,
    zoom,
    reset,
    labels,
}: {
    playing: boolean;
    onToggle: () => void;
    zoom: ZoomControls;
    reset: { onReset: () => void; disabled: boolean };
    labels: { play: string; pause: string; zoomIn: string; zoomOut: string; reset: string };
}) {
    return (
        <>
            <PlayButton playing={playing} onToggle={onToggle} play={labels.play} pause={labels.pause} />
            <span className={styles.tiny} role="group" aria-label={`${labels.zoomOut} / ${labels.zoomIn} / ${labels.reset}`}>
                <button type="button" className={styles.play} aria-label={labels.zoomOut} title={labels.zoomOut} disabled={zoom.atMin} onClick={zoom.further}>
                    <svg viewBox="0 0 14 14" aria-hidden="true">
                        <rect x={2.5} y={6.2} width={9} height={1.6} />
                    </svg>
                </button>
                <button type="button" className={styles.play} aria-label={labels.zoomIn} title={labels.zoomIn} disabled={zoom.atMax} onClick={zoom.closer}>
                    <svg viewBox="0 0 14 14" aria-hidden="true">
                        <rect x={2.5} y={6.2} width={9} height={1.6} />
                        <rect x={6.2} y={2.5} width={1.6} height={9} />
                    </svg>
                </button>
                <button type="button" className={styles.play} aria-label={labels.reset} title={labels.reset} disabled={reset.disabled} onClick={reset.onReset}>
                    <svg className={styles.stroke} viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M11.5 7a4.5 4.5 0 1 1-1.4-3.25" />
                        <path d="M11.8 1.8v2.9H8.9" />
                    </svg>
                </button>
            </span>
        </>
    );
}
