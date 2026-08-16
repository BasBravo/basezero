'use client';

import { useEffect, useRef } from 'react';
import { FadeInTitle } from './FadeInTitle';
import styles from './portfolio.module.css';

type TerminalAboutProps = {
    title: string;
    paragraphs: string[];
};

export function TerminalAbout({ title, paragraphs }: TerminalAboutProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const textRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const restRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const cursorRefs = useRef<Array<HTMLSpanElement | null>>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const aboutSection = section;

        const segments = paragraphs;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const characterInterval = 2.7;
        const segmentPause = 90;
        let frame = 0;
        let hasStarted = false;

        function renderComplete() {
            segments.forEach((segment, index) => {
                const text = textRefs.current[index];
                const rest = restRefs.current[index];
                const cursor = cursorRefs.current[index];
                if (text) text.textContent = segment;
                if (rest) rest.textContent = '';
                if (cursor) cursor.style.visibility = 'hidden';
            });
            aboutSection.dataset.typing = 'complete';
        }

        function startTyping() {
            if (hasStarted) return;
            hasStarted = true;

            if (reducedMotion) {
                renderComplete();
                return;
            }

            aboutSection.dataset.typing = 'active';
            const schedule = segments.map((segment, index) => {
                const previousDuration = segments
                    .slice(0, index)
                    .reduce((total, previous) => total + previous.length * characterInterval + segmentPause, 0);
                return {
                    start: previousDuration,
                    end: previousDuration + segment.length * characterInterval,
                };
            });
            const totalDuration = schedule.at(-1)?.end ?? 0;
            const startedAt = performance.now();

            function draw(timestamp: number) {
                const elapsed = timestamp - startedAt;
                let activeSegment = segments.length - 1;

                segments.forEach((segment, index) => {
                    const text = textRefs.current[index];
                    const rest = restRefs.current[index];
                    const cursor = cursorRefs.current[index];
                    const timing = schedule[index];
                    if (!text || !rest || !cursor || !timing) return;

                    const visibleCharacters = Math.max(
                        0,
                        Math.min(segment.length, Math.ceil((elapsed - timing.start) / characterInterval)),
                    );
                    text.textContent = segment.slice(0, visibleCharacters);
                    rest.textContent = segment.slice(visibleCharacters);

                    const nextStart = schedule[index + 1]?.start ?? Number.POSITIVE_INFINITY;
                    const isActive = elapsed >= timing.start && elapsed < nextStart;
                    cursor.style.visibility = isActive ? 'visible' : 'hidden';
                    if (isActive) activeSegment = index;
                });

                aboutSection.dataset.activeLine = String(activeSegment + 1);

                if (elapsed < totalDuration) {
                    frame = window.requestAnimationFrame(draw);
                } else {
                    frame = 0;
                    renderComplete();
                }
            }

            frame = window.requestAnimationFrame(draw);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                startTyping();
                observer.disconnect();
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.18 },
        );
        observer.observe(aboutSection);

        return () => {
            observer.disconnect();
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [paragraphs]);

    function terminalLine(text: string, index: number) {
        return (
            <>
                <span className={styles.terminalMeasure}>
                    {text}
                    <span className={styles.terminalCursorMeasure} />
                </span>
                <span className={styles.terminalOutput}>
                    <span
                        ref={(node) => {
                            textRefs.current[index] = node;
                        }}
                    />
                    <span
                        ref={(node) => {
                            cursorRefs.current[index] = node;
                        }}
                        className={styles.typingCursor}
                        style={{ visibility: 'hidden' }}
                    />
                    <span
                        ref={(node) => {
                            restRefs.current[index] = node;
                        }}
                        className={styles.terminalPending}
                    >
                        {text}
                    </span>
                </span>
            </>
        );
    }

    return (
        <section ref={sectionRef} id="about" className={styles.aboutSection} data-terminal-about>
            <div className={styles.visuallyHidden}>
                <h2>{title}</h2>
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <div className={styles.aboutTerminal} aria-hidden="true">
                <div className={styles.aboutCopy}>
                    <FadeInTitle className={styles.aboutTitle}>{title}</FadeInTitle>
                    {paragraphs.map((paragraph, index) => (
                        <p className={`${styles.aboutParagraph} ${styles.terminalLine}`} key={paragraph}>
                            {terminalLine(paragraph, index)}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
