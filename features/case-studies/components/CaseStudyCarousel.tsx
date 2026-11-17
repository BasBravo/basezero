'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Icon } from '@/components/ui/icon';
import type { CaseStudyCarousel } from '../types';
import styles from './case-study-carousel.module.css';

export type CarouselCopy = { label: string; previous: string; next: string };

export function CaseStudyCarousel({ carousel, copy, frame }: { carousel: CaseStudyCarousel; copy: CarouselCopy; frame?: string }) {
    const track = useRef<HTMLDivElement>(null);
    function move(direction: number) {
        const element = track.current;
        if (!element) return;
        const slide = element.querySelector('figure');
        if (slide) element.scrollBy({ left: direction * (slide.offsetWidth + 20), behavior: 'smooth' });
    }
    return (
        <section className={styles.carousel} aria-label={copy.label}>
            <div className={styles.track} ref={track} tabIndex={0} role="region" aria-label={copy.label}>
                {carousel.slides.map(slide => (
                    <figure className={styles.slide} key={slide.src}>
                        <div className={styles.phone} data-framed={frame ? 'true' : undefined}>
                            <div className={styles.screen}>
                                <Image src={slide.src} alt={`${slide.title}: ${slide.body}`} width={800} height={1739} sizes="220px" />
                            </div>
                            {frame ? <Image className={styles.frame} src={frame} alt="" width={440} height={916} /> : null}
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
