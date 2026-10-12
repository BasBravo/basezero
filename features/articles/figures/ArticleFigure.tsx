import '@/components/iso/iso.css';
import { CircuitFigure, type CircuitCopy } from './circuit/CircuitFigure';
import { BeamFigure, type BeamCopy } from './beam/BeamFigure';
import { IsoTheme } from './IsoTheme';
import { PipelineFigure, type PipelineCopy } from './pipeline/PipelineFigure';
import { RailsFigure, type RailsCopy } from './rails/RailsFigure';
import { SorterFigure, type SorterCopy } from './sorter/SorterFigure';
import { TankFigure, type TankCopy } from './tank/TankFigure';

export type FigureCopy = {
    sorter: SorterCopy;
    beam: BeamCopy;
    rails: RailsCopy;
    tank: TankCopy;
    circuit: CircuitCopy;
    pipeline: PipelineCopy;
};

export type FigureId = keyof FigureCopy;

export const FIGURE_PREFIX = 'figure:';
const IDS: readonly FigureId[] = ['sorter', 'beam', 'rails', 'tank', 'circuit', 'pipeline'];

export function figureIdOf(src: string): FigureId | null {
    if (!src.startsWith(FIGURE_PREFIX)) return null;
    const id = src.slice(FIGURE_PREFIX.length);
    return IDS.find(known => known === id) ?? null;
}

export function ArticleFigure({ id, copy }: { id: FigureId; copy: FigureCopy }) {
    return (
        <IsoTheme>
            {id === 'sorter' && <SorterFigure copy={copy.sorter} />}
            {id === 'beam' && <BeamFigure copy={copy.beam} />}
            {id === 'rails' && <RailsFigure copy={copy.rails} />}
            {id === 'tank' && <TankFigure copy={copy.tank} />}
            {id === 'circuit' && <CircuitFigure copy={copy.circuit} />}
            {id === 'pipeline' && <PipelineFigure copy={copy.pipeline} />}
        </IsoTheme>
    );
}
