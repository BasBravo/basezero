'use client';

import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { PortfolioProject } from '@/content/portfolio-projects';
import styles from './portfolio.module.css';

type ProjectDialogCopy = {
    close: string;
    challenge: string;
    solution: string;
    contribution: string;
    visit: string;
};

type ProjectDialogProps = {
    project: PortfolioProject;
    copy: ProjectDialogCopy;
    onClose: () => void;
};

export function ProjectDialog({ project, copy, onClose }: ProjectDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();

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

        return () => {
            document.documentElement.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [project.id]);

    function closeDialog() {
        const dialog = dialogRef.current;
        if (dialog && typeof dialog.close === 'function') {
            dialog.close();
            return;
        }
        onClose();
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
                    <span className={styles.projectDialogMeta}>{project.discipline} · {project.year}</span>
                    <button
                        className={styles.projectDialogClose}
                        type="button"
                        aria-label={copy.close}
                        onClick={closeDialog}
                    >
                        <X aria-hidden="true" strokeWidth={1.4} />
                    </button>
                </header>

                <div className={styles.projectDialogIntro}>
                    <h2 id={titleId} className={styles.projectDialogTitle}>{project.name}</h2>
                    <p id={descriptionId} className={styles.projectDialogSummary}>{project.description}</p>
                </div>

                <div className={styles.projectDialogDetails}>
                    <section className={styles.projectDialogDetail}>
                        <h3>{copy.challenge}</h3>
                        <p>{project.challenge}</p>
                    </section>
                    <section className={styles.projectDialogDetail}>
                        <h3>{copy.solution}</h3>
                        <p>{project.solution}</p>
                    </section>
                    <section className={styles.projectDialogDetail}>
                        <h3>{copy.contribution}</h3>
                        <ul>
                            {project.contribution.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </section>
                </div>

                <a
                    className={styles.projectDialogVisit}
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span>{copy.visit}</span>
                    <ArrowUpRight aria-hidden="true" strokeWidth={1.4} />
                </a>
            </article>
        </dialog>
    );
}
