'use client';

import Image from 'next/image';
import { useRef, type PointerEvent } from 'react';
import { Icon } from '@/components/ui/icon';
import type { CaseStudyCarousel } from '../types';
import styles from './case-study-carousel.module.css';

export type CarouselCopy = { label: string; previous: string; next: string };

export function CaseStudyCarousel({ carousel, copy, frame }: { carousel: CaseStudyCarousel; copy: CarouselCopy; frame?: string }) {
    const track = useRef<HTMLDivElement>(null);
    const drag = useRef({ pointerId: -1, startX: 0, startScrollLeft: 0, active: false });

    function stopDragging(event: PointerEvent<HTMLDivElement>) {
        const element = track.current;
        if (!element || event.pointerId !== drag.current.pointerId) return;
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
        drag.current.active = false;
        drag.current.pointerId = -1;
        delete element.dataset.dragging;
    }

    function startDragging(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const element = track.current;
        if (!element) return;
        drag.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: element.scrollLeft, active: true };
        element.setPointerCapture(event.pointerId);
        element.dataset.dragging = 'true';
    }

    function dragTrack(event: PointerEvent<HTMLDivElement>) {
        const element = track.current;
        if (!element || !drag.current.active || event.pointerId !== drag.current.pointerId) return;
        element.scrollLeft = drag.current.startScrollLeft - (event.clientX - drag.current.startX);
    }

    function move(direction: number) {
        const element = track.current;
        if (!element) return;
        const slide = element.querySelector('figure');
        if (slide) element.scrollBy({ left: direction * (slide.offsetWidth + 20), behavior: 'smooth' });
    }
    return (
        <section className={styles.carousel} aria-label={copy.label}>
            <div
                className={styles.track}
                ref={track}
                tabIndex={0}
                role="region"
                aria-label={copy.label}
                onPointerDown={startDragging}
                onPointerMove={dragTrack}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
            >
                {carousel.slides.map(slide => (
                    <figure className={styles.slide} key={slide.src}>
                        <div className={styles.phone} data-framed={frame ? 'true' : undefined}>
                            <div className={styles.screen}>
                                <Image src={slide.src} alt={`${slide.title}: ${slide.body}`} width={800} height={1739} sizes="220px" draggable={false} />
                            </div>
                            {frame ? <Image className={styles.frame} src={frame} alt="" width={440} height={916} draggable={false} /> : null}
                        </div>
                        <figcaption><h2>{slide.title}</h2><p>{slide.body}</p></figcaption>
                    </figure>
                ))}
            </div>
            <div className={styles.controls}>
                <button type="button" onClick={() => move(-1)} aria-label={copy.previous}><Icon name="arrow_back" /></button>
                <button type="button" onClick={() => move(1)} aria-label={copy.next}><Icon name="arrow_forward" /></button>
            </div>
        </section>
    );
}
