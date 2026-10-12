'use client';

import type { SolidPaths } from '@/components/iso/iso-kit';

export const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, name: string) => `${values[name] ?? ''}`);

/** Writes a kit solid into a `LiveSolid` group: fill, four shades, top, crease, edge. */
export function paintSolid(group: SVGGElement | null, paths: SolidPaths) {
    if (!group) return;
    const nodes = group.children;
    nodes[0]?.setAttribute('d', paths.fill);
    for (let shade = 0; shade < 4; shade++) nodes[1 + shade]?.setAttribute('d', paths.shades[shade] ?? '');
    nodes[5]?.setAttribute('d', paths.top);
    nodes[6]?.setAttribute('d', paths.crease);
    nodes[7]?.setAttribute('d', paths.outline);
}

export function LiveSolid({ gref, tone = 'mid' }: { gref: (node: SVGGElement | null) => void; tone?: 'hi' | 'mid' | 'lo' }) {
    return (
        <g ref={gref} className="iso-solid">
            <path className="iso-fill" />
            {[0, 1, 2, 3].map(shade => (
                <path key={shade} className="iso-shade" data-shade={shade} />
            ))}
            <path className="iso-top" />
            <path className="iso-line iso-crease" data-tone="faint" />
            <path className="iso-line iso-edge" data-tone={tone} />
        </g>
    );
}
