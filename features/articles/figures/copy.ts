import { getTranslations } from 'next-intl/server';
import type { FigureCopy } from './ArticleFigure';

export async function getFigureCopy(locale: string): Promise<FigureCopy> {
    const t = await getTranslations({ locale, namespace: 'Figures' });
    const raw = <T,>(key: string) => t.raw(key) as T;

    const group = (name: string, keys: string[]) => Object.fromEntries(keys.map(key => [key, raw(`${name}.${key}`)]));

    return {
        sorter: group('sorter', ['fig', 'title', 'hint', 'keys', 'caption', 'idle', 'trying', 'no', 'yes', 'aria', 'pieces', 'names', 'controls', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['sorter'],
        beam: group('beam', ['fig', 'title', 'hint', 'keys', 'caption', 'idle', 'status', 'pass', 'fail', 'decimal', 'aria', 'spoken', 'load', 'less', 'more', 'controls', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['beam'],
        rails: group('rails', ['fig', 'title', 'hint', 'keys', 'caption', 'idle', 'going', 'wrong', 'right', 'chipWrong', 'chipRight', 'aria', 'names', 'branches', 'send', 'controls', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['rails'],
        tank: group('tank', ['fig', 'title', 'hint', 'keys', 'caption', 'idle', 'status', 'stuck', 'chipYes', 'chipNo', 'aria', 'controls', 'pour', 'plug', 'unplug', 'empty', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['tank'],
        circuit: group('circuit', ['fig', 'title', 'hint', 'keys', 'caption', 'full', 'small', 'cutStatus', 'chipWhole', 'chipCut', 'aria', 'extrasOn', 'extrasOff', 'cut', 'fix', 'controls', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['circuit'],
        pipeline: group('pipeline', ['fig', 'title', 'hint', 'keys', 'caption', 'ok', 'broken', 'chipYes', 'chipNo', 'aria', 'steps', 'names', 'controls', 'reset', 'play', 'pause', 'zoomIn', 'zoomOut']) as FigureCopy['pipeline'],
    };
}
