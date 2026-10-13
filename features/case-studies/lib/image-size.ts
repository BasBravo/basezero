import { readFileSync } from 'node:fs';
import path from 'node:path';

export type ImageSize = { width: number; height: number };

/** Width and height of a WebP file from its header (lossy VP8, lossless VP8L or extended VP8X), without decoding it. */
export function webpSize(buffer: Buffer): ImageSize | null {
    if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
        const bits = buffer.readUInt32LE(21);
        return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    return null;
}

/** Sizes of the local images a Markdown body uses, keyed by their src. */
export function imageSizesOf(markdown: string): Record<string, ImageSize> {
    const sizes: Record<string, ImageSize> = {};
    for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\((\/[^)\s]+\.webp)/g)) {
        const size = webpSize(readFileSync(path.join(process.cwd(), 'public', src!)));
        if (size) sizes[src!] = size;
    }
    return sizes;
}
