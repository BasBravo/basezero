import { getTranslations } from 'next-intl/server';
import type { FigureCopy } from './ArticleFigure';

export async function getFigureCopy(locale: string): Promise<FigureCopy> {
    const t = await getTranslations({ locale, namespace: 'Figures' });
    const raw = <T,>(key: string) => t.raw(key) as T;

    return {
        lock: {
            fig: raw('lock.fig'),
            title: raw('lock.title'),
            hint: raw('lock.hint'),
            keys: raw('lock.keys'),
            caption: raw('lock.caption'),
            aria: raw('lock.aria'),
            idle: raw('lock.idle'),
            moving: raw('lock.moving'),
            settled: raw('lock.settled'),
            turns: raw('lock.turns'),
            stuck: raw('lock.stuck'),
            spoken: raw('lock.spoken'),
            fails: raw('lock.fails'),
            pins: raw('lock.pins'),
        },
        tunnel: {
            fig: raw('tunnel.fig'),
            title: raw('tunnel.title'),
            hint: raw('tunnel.hint'),
            keys: raw('tunnel.keys'),
            caption: raw('tunnel.caption'),
            idle: raw('tunnel.idle'),
            aria: raw('tunnel.aria'),
            decimal: raw('tunnel.decimal'),
            readout: raw('tunnel.readout'),
            spoken: raw('tunnel.spoken'),
            over: raw('tunnel.over'),
            under: raw('tunnel.under'),
            stalled: raw('tunnel.stalled'),
        },
    };
}
