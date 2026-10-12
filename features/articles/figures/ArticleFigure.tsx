import '@/components/iso/iso.css';
import { IsoTheme } from './IsoTheme';
import { LockFigure, type LockFigureCopy } from './lock/figure';
import { TunnelFigure, type TunnelFigureCopy } from './tunnel/figure';

export type FigureCopy = {
    lock: LockFigureCopy;
    tunnel: TunnelFigureCopy;
};

export type FigureId = keyof FigureCopy;

export const FIGURE_PREFIX = 'figure:';

export function figureIdOf(src: string): FigureId | null {
    if (!src.startsWith(FIGURE_PREFIX)) return null;
    const id = src.slice(FIGURE_PREFIX.length);
    return id === 'lock' || id === 'tunnel' ? id : null;
}

export function ArticleFigure({ id, copy }: { id: FigureId; copy: FigureCopy }) {
    return (
        <IsoTheme>
            {id === 'lock' ? <LockFigure copy={copy.lock} /> : null}
            {id === 'tunnel' ? <TunnelFigure copy={copy.tunnel} /> : null}
        </IsoTheme>
    );
}
