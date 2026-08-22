'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import { Icon } from '@/components/ui/icon';
import type { PortfolioProject } from '@/content/portfolio-projects';
import styles from './portfolio.module.css';

type ProjectDialogCopy = {
    close: string;
    visit: string;
};

type ProjectDialogProps = {
    project: PortfolioProject;
    copy: ProjectDialogCopy;
    onClose: () => void;
};

export function ProjectDialog({ project, copy, onClose }: ProjectDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const visitRef = useRef<HTMLAnchorElement>(null);
    const textRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const restRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const cursorRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const titleId = useId();
    const descriptionId = useId();
    const projectMeta = `${project.facets.join(' · ')} · ${project.year}`;
    const terminalSegments = useMemo(
        () => [projectMeta, ...project.story, copy.visit],
        [copy.visit, project.story, projectMeta],
    );

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const previousOverflow = document.documentElement.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', '');
        }

        const title = titleRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const characterInterval = 2.7;
        const segmentPause = 90;
        let frame = 0;

        function setVisitVisible(visible: boolean) {
            const visit = visitRef.current;
            if (!visit) return;
            visit.dataset.visible = visible ? 'true' : '';
            visit.setAttribute('aria-hidden', String(!visible));
            visit.tabIndex = visible ? 0 : -1;
        }

        function renderComplete() {
            terminalSegments.forEach((segment, index) => {
                const text = textRefs.current[index];
                const rest = restRefs.current[index];
                const cursor = cursorRefs.current[index];
                if (text) text.textContent = segment;
                if (rest) rest.textContent = '';
                if (cursor) cursor.style.visibility = 'hidden';
            });
        }

        if (reducedMotion) {
            if (title) title.dataset.visible = 'true';
            renderComplete();
            setVisitVisible(true);
        } else {
            const schedule = terminalSegments.map((segment, index) => {
                const previousDuration = terminalSegments
                    .slice(0, index)
                    .reduce((total, previous) => total + previous.length * characterInterval + segmentPause, 0);
                return {
                    start: previousDuration,
                    end: previousDuration + segment.length * characterInterval,
                };
            });
            const totalDuration = schedule.at(-1)?.end ?? 0;
            const visitStartsAt = schedule.at(-1)?.start ?? 0;
            let startedAt = 0;
            setVisitVisible(false);

            function draw(timestamp: number) {
                if (startedAt === 0) startedAt = timestamp;
                const elapsed = timestamp - startedAt;
                setVisitVisible(elapsed >= visitStartsAt);

                terminalSegments.forEach((segment, index) => {
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
                });

                if (elapsed < totalDuration) {
                    frame = window.requestAnimationFrame(draw);
                } else {
                    frame = 0;
                    renderComplete();
                }
            }

            frame = window.requestAnimationFrame((timestamp) => {
                if (title) title.dataset.visible = 'true';
                draw(timestamp);
            });
        }

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            document.documentElement.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [project.id, terminalSegments]);

    function closeDialog() {
        const dialog = dialogRef.current;
        if (dialog && typeof dialog.close === 'function') {
            dialog.close();
            return;
        }
        onClose();
    }

    function terminalLine(text: string, index: number) {
        return (
            <>
                <span className={styles.terminalMeasure} aria-hidden="true">
                    {text}
                    <span className={styles.terminalCursorMeasure} />
                </span>
                <span className={styles.terminalOutput}>
                    <span ref={(node) => { textRefs.current[index] = node; }} />
                    <span
                        ref={(node) => { cursorRefs.current[index] = node; }}
                        className={styles.typingCursor}
                        style={{ visibility: 'hidden' }}
                    />
                    <span
                        ref={(node) => { restRefs.current[index] = node; }}
                        className={styles.terminalPending}
                    >
                        {text}
                    </span>
                </span>
            </>
        );
    }

    return (
        <dialog
            ref={dialogRef}
            className={styles.projectDialog}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onCancel={(event) => {
                event.preventDefault();
                closeDialog();
            }}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) closeDialog();
            }}
        >
            <article className={styles.projectDialogPanel}>
                <header className={styles.projectDialogHeader}>
                    <span className={`${styles.projectDialogMeta} ${styles.terminalLine}`}>
                        {terminalLine(projectMeta, 0)}
                    </span>
                    <button
                        className={styles.projectDialogClose}
                        type="button"
                        aria-label={copy.close}
                        onClick={closeDialog}
                    >
                        <Icon name="close" />
                    </button>
                </header>

                <div className={styles.projectDialogIntro}>
                    <h2
                        ref={titleRef}
                        id={titleId}
                        className={`${styles.projectDialogTitle} ${styles.fadeInTitle}`}
                    >
                        {project.name}
                    </h2>
                </div>

                <div id={descriptionId} className={styles.projectDialogStory}>
                    {project.story.map((paragraph, index) => (
                        <p className={styles.terminalLine} key={paragraph}>
                            {terminalLine(paragraph, index + 1)}
                        </p>
                    ))}
                    <a
                        ref={visitRef}
                        className={styles.projectDialogVisit}
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className={`${styles.projectDialogVisitText} ${styles.terminalLine}`}>
                            {terminalLine(copy.visit, project.story.length + 1)}
                        </span>
                        <Icon name="arrow_outward" />
                    </a>
                </div>
            </article>
        </dialog>
    );
}
