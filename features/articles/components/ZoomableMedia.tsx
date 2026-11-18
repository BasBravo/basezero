'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './article.module.css';

type ZoomableMediaProps = {
    src: string;
    alt: string;
    title?: string;
    size?: { width: number; height: number };
};

type ZoomBounds = { left: number; top: number; width: number; height: number; targetLeft: number; targetTop: number; targetWidth: number; targetHeight: number };

/** A document image that keeps its inline size but can be inspected at full size. */
export function ZoomableMedia({ src, alt, title, size }: ZoomableMediaProps) {
    const [zoom, setZoom] = useState<ZoomBounds | null>(null);
    const [expanded, setExpanded] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const closeTimeout = useRef<number | null>(null);

    const close = useCallback(() => {
        if (!zoom || closeTimeout.current !== null) return;
        setExpanded(false);
        closeTimeout.current = window.setTimeout(() => {
            setZoom(null);
            closeTimeout.current = null;
        }, 220);
    }, [zoom]);

    useEffect(() => {
        if (!zoom) return;
        const triggerElement = trigger.current;
        const previousOverflow = document.body.style.overflow;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        let expansionFrame = 0;
        const animationFrame = window.requestAnimationFrame(() => {
            expansionFrame = window.requestAnimationFrame(() => setExpanded(true));
        });
        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.cancelAnimationFrame(expansionFrame);
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
            triggerElement?.focus();
        };
    }, [close, zoom]);

    useEffect(() => () => {
        if (closeTimeout.current !== null) window.clearTimeout(closeTimeout.current);
    }, []);

    function open() {
        const image = trigger.current?.querySelector('img');
        const origin = image?.getBoundingClientRect() ?? trigger.current?.getBoundingClientRect();
        if (!origin) return;
        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
        const aspectRatio = origin.width / origin.height;
        const maxWidth = window.innerWidth * 0.94;
        const maxHeight = window.innerHeight * 0.88;
        const targetWidth = Math.min(maxWidth, maxHeight * aspectRatio);
        const targetHeight = targetWidth / aspectRatio;
        setExpanded(false);
        setZoom({
            left: origin.left,
            top: origin.top,
            width: origin.width,
            height: origin.height,
            targetLeft: (window.innerWidth - targetWidth) / 2,
            targetTop: (window.innerHeight - targetHeight) / 2,
            targetWidth,
            targetHeight,
        });
    }

    const isPhone = size ? size.height > size.width : false;
    const zoomStyle = zoom ? {
        '--media-origin-left': `${zoom.left}px`,
        '--media-origin-top': `${zoom.top}px`,
        '--media-origin-width': `${zoom.width}px`,
        '--media-origin-height': `${zoom.height}px`,
        '--media-target-left': `${zoom.targetLeft}px`,
        '--media-target-top': `${zoom.targetTop}px`,
        '--media-target-width': `${zoom.targetWidth}px`,
        '--media-target-height': `${zoom.targetHeight}px`,
    } as CSSProperties : undefined;

    return (
        <span className={styles.proseImage} data-shot={isPhone ? 'phone' : 'screen'} data-zooming={zoom ? 'true' : undefined}>
            <button ref={trigger} className={styles.zoomTrigger} type="button" onClick={open} aria-label={alt || 'Ampliar imagen'}>
                {size ? (
                    <span className={styles.proseShotFrame}>
                        <Image src={src} alt={alt} width={size.width} height={size.height} sizes="(max-width: 800px) 100vw, 70vw" />
                    </span>
                ) : (
                    <span className={styles.proseImageFrame}>
                        <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 70vw" />
                    </span>
                )}
            </button>
            {title ? <span className={styles.proseImageCaption}>{title}</span> : null}
            {zoom ? createPortal(
                <div className={styles.mediaLightbox} data-expanded={expanded ? 'true' : undefined} role="dialog" aria-modal="true" aria-label={alt || 'Imagen ampliada'} onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
                    <button className={styles.mediaLightboxClose} type="button" onClick={close} aria-label="Cerrar imagen ampliada">×</button>
                    <div className={styles.mediaLightboxImage} style={zoomStyle}>
                        <Image src={src} alt={alt} fill sizes="94vw" priority />
                    </div>
                </div>,
                document.body,
            ) : null}
        </span>
    );
}
