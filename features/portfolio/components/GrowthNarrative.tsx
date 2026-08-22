'use client';

import { useEffect, useMemo, useRef } from 'react';
import styles from './portfolio.module.css';

type NarrativeStep = {
    number: string;
    title: string;
    body: string;
};

type GrowthNarrativeProps = {
    introTitle: string;
    introBody: string;
    introViewWork: string;
    processLabel: string;
    processSteps: NarrativeStep[];
};

const narrativeTimings = [
    { start: -0.03, fadeStart: 0.1, end: 0.14 },
    { start: 0.14, fadeStart: 0.24, end: 0.28 },
    { start: 0.28, fadeStart: 0.38, end: 0.42 },
    { start: 0.42, fadeStart: 0.52, end: 0.56 },
    { start: 0.56, fadeStart: 0.63, end: 0.66 },
    { start: 0.66, fadeStart: 0.82, end: 0.9 },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothCurve = (value: number) => value * value * (3 - 2 * value);

export function GrowthNarrative({
    introTitle,
    introBody,
    introViewWork,
    processLabel,
    processSteps,
}: GrowthNarrativeProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const introCtaRef = useRef<HTMLAnchorElement>(null);
    const introBodyRef = useRef<HTMLParagraphElement>(null);
    const stageRefs = useRef<Array<HTMLLIElement | null>>([]);
    const bodyRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const bodyRestRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const bodyCursorRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const narrativeItems = useMemo(
        () => [
            { number: '00', title: introTitle ?? '', body: introBody ?? '' },
            ...processSteps.map((step) => ({
                ...step,
                title: step.title ?? '',
                body: step.body ?? '',
            })),
        ],
        [introBody, introTitle, processSteps],
    );

    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const narrativeOverlay = overlay;

        let frame = 0;
        let targetProgress = 0;
        let progress = 0;
        let sceneIsVisible = false;
        let activeStage = -1;
        let typingStartedAt = performance.now();
        let previousTimestamp = performance.now();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function queueFrame() {
            if (frame === 0 && !document.hidden) frame = window.requestAnimationFrame(draw);
        }

        function updateProgress() {
            const growthSection = document.getElementById('growth');
            if (!growthSection) return;
            const rect = growthSection.getBoundingClientRect();
            const travel = Math.max(rect.height - window.innerHeight, 1);
            targetProgress = clamp01(-rect.top / travel);
            sceneIsVisible = rect.bottom > 0 && rect.top <= window.innerHeight;
            queueFrame();
        }

        function draw(timestamp: number) {
            frame = 0;
            const delta = Math.min(Math.max((timestamp - previousTimestamp) / 1000, 0), 0.1);
            previousTimestamp = timestamp;
            const easing = reducedMotion ? 1 : 1 - Math.exp(-15 * delta);
            progress += (targetProgress - progress) * easing;

            const nextActiveStage = sceneIsVisible
                ? narrativeTimings.findIndex(({ start, end }) => progress >= start && progress < end)
                : -1;

            if (nextActiveStage !== activeStage) {
                activeStage = nextActiveStage;
                typingStartedAt = timestamp;
                narrativeOverlay.dataset.activeStage = activeStage >= 0 ? String(activeStage) : '';
                const introCta = introCtaRef.current;
                if (introCta) {
                    const isVisible = activeStage === 0;
                    introCta.dataset.visible = isVisible ? 'true' : '';
                    introCta.setAttribute('aria-hidden', String(!isVisible));
                    introCta.tabIndex = isVisible ? 0 : -1;
                }
            }

            let typingIsRunning = false;

            narrativeItems.forEach((item, index) => {
                const timing = narrativeTimings[index];
                const stage = stageRefs.current[index];
                const body = bodyRefs.current[index];
                const bodyRest = bodyRestRefs.current[index];
                const bodyCursor = bodyCursorRefs.current[index];
                if (!timing || !stage || !body || !bodyRest || !bodyCursor) return;

                const appear = smoothCurve(clamp01((progress - timing.start) / 0.022));
                const disappear = 1 - smoothCurve(clamp01((progress - timing.fadeStart) / (timing.end - timing.fadeStart)));
                const opacity = sceneIsVisible ? appear * disappear : 0;
                stage.style.opacity = opacity.toFixed(3);
                stage.style.transform = `translate3d(0, calc(var(--stage-center-offset) + ${(1 - opacity) * 0.65}rem), 0)`;
                stage.dataset.visible = opacity > 0.05 ? 'true' : 'false';

                const isActive = index === activeStage;
                const characterCount = item.body.length;
                const typingDuration = Math.min(680, 140 + characterCount * 2.4);
                const typingProgress = isActive
                    ? reducedMotion
                        ? 1
                        : clamp01((timestamp - typingStartedAt) / typingDuration)
                    : 0;
                const visibleCharacters = isActive ? Math.ceil(characterCount * typingProgress) : 0;
                body.textContent = item.body.slice(0, visibleCharacters);
                bodyRest.textContent = item.body.slice(visibleCharacters);
                const isTyping = isActive && typingProgress < 1;
                bodyCursor.style.visibility = isTyping ? 'visible' : 'hidden';

                if (isTyping) typingIsRunning = true;
            });

            if (activeStage === 0) {
                const introCta = introCtaRef.current;
                const introBody = introBodyRef.current;
                if (introCta && introBody) {
                    const bodyRect = introBody.getBoundingClientRect();
                    const gap = window.innerWidth <= 800 ? 18 : 22;
                    introCta.style.top = `${Math.round(bodyRect.bottom + gap)}px`;
                    introCta.style.left = `${Math.round(bodyRect.left)}px`;
                }
            }

            if (typingIsRunning || Math.abs(progress - targetProgress) > 0.001) queueFrame();
        }

        updateProgress();
        window.addEventListener('resize', updateProgress, { passive: true });
        window.addEventListener('scroll', updateProgress, { passive: true });

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', updateProgress);
            window.removeEventListener('scroll', updateProgress);
        };
    }, [narrativeItems]);

    return (
        <>
            <div ref={overlayRef} className={styles.processOverlay} aria-hidden="true">
                <ol className={styles.processStageList}>
                    {narrativeItems.map((item, index) => (
                        <li
                            ref={(node) => {
                                stageRefs.current[index] = node;
                            }}
                            className={styles.processStage}
                            key={item.number}
                        >
                            <div className={styles.processStageTitle}>
                                {item.title}
                            </div>
                            <p
                                ref={(node) => {
                                    if (index === 0) introBodyRef.current = node;
                                }}
                                className={styles.processStageBody}
                            >
                                <span ref={(node) => { bodyRefs.current[index] = node; }} />
                                <span
                                    ref={(node) => { bodyCursorRefs.current[index] = node; }}
                                    className={styles.typingCursor}
                                    style={{ visibility: 'hidden' }}
                                />
                                <span
                                    ref={(node) => { bodyRestRefs.current[index] = node; }}
                                    className={styles.terminalPending}
                                >
                                    {item.body}
                                </span>
                            </p>
                        </li>
                    ))}
                </ol>
            </div>

            <a
                ref={introCtaRef}
                className={styles.introScrollCta}
                href="#work"
                aria-hidden="true"
                tabIndex={-1}
            >
                <span>{introViewWork}</span>
                <span aria-hidden="true">↓</span>
            </a>

            <div className={styles.visuallyHidden}>
                <h1>{introTitle}</h1>
                <p>{introBody}</p>
                <h2>{processLabel}</h2>
                <ol>
                    {processSteps.map((step) => (
                        <li key={step.number}>
                            <h3>{step.title}</h3>
                            <p>{step.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}
