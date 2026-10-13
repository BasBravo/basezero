---
title: "Signado: a whole public service process in sign language"
description: "How I designed and built Signado, the platform that turns written processes into interactive journeys in Spanish and Catalan sign language, so deaf people can complete them on their own."
name: "Signado"
url: "https://signado.es/"
year: "2026"
role: "Product, design and development"
facets: ["SaaS platform", "Accessibility"]
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Weform engine"]
status: "Live"
cover: "/projects/signado/case/hero.webp"
order: 1
date: "2026-10-13"
keywords: ["sign language", "digital accessibility", "deaf people", "accessible interactive video", "SaaS case study"]
---

Most forms and public services assume everyone reads written Spanish well. For many deaf signers it is a second language. A form or a consent document that is routine for others becomes something to decode, often in a hurry and in front of someone.

Signado starts from a simple idea: **if a person's language is sign language, the whole process should be in sign language**. Not a video at the start followed by the usual form, but every step, every question and every decision.

![Signado home page: "The new way to communicate with deaf people", with the three product principles below.](/projects/signado/case/hero.webp "The home page states the promise in one sentence and backs it with three principles: nothing to install, signed by real people and truly interactive.")

## The challenge

What exists today to serve a deaf person is usually one of three things: subtitles or easy-read text, pen and paper, or booking an interpreter days in advance. All three help, but none of them solves the most common case: a predictable process someone needs to complete at eleven at night without depending on anyone.

The product had to work for two people at once:

- **The deaf person**, who needs to understand, choose and finish alone, from their phone and without signing up.
- **The organisation**, which needs to publish that process without touching its systems and to know whether it works.

## Rebuilding the process, not translating it

The decision that defines Signado is not translating forms. Putting sign language on top of a written process leaves it just as complicated. Instead, each process is rebuilt as a **journey**: a signed video explains and asks, the person chooses, and their answer decides the next step.

![The usual process (text, form, doubt, phone call) compared with the same process in Signado (video in sign language, question, choice, documents, done).](/projects/signado/case/tramite.webp "The comparison that guides the product: the language is not a layer on top, it is the interface.")

Each journey opens from a QR code or a link, in the browser. Options are always visible, there is one decision at a time, and the end makes clear what happened and what comes next.

![The steps of a Signado journey: it opens instantly, every step is in the person's language, one decision at a time and the answer changes the path.](/projects/signado/case/recorrido.webp "Each step of the journey has a single job. Nobody has to work out what to do or look for it elsewhere.")

## What I built

Signado is a vertical built on [Weform](/en/projects/weform), the interactive video platform I also built. Instead of starting from scratch, it reuses its engine for journeys, playback and results, and adds what sign language needs:

- Journeys in **Spanish (LSE) and Catalan (LSC) sign language**, recorded by real signers, not avatars.
- A public website in five languages for organisations.
- Plans based on capacity: you pay for what you publish, never for the people who use it.
- A separate sign language video production service, because recording well costs money and it is better to say so upfront.
- Metrics that matter: how many people finish alone, at which step they leave and how long it takes.

![Signado home page on mobile.](/projects/signado/case/mobile.webp "Almost everything happens on a phone: the journey has to work one-handed and without installing anything.")

## Decisions that matter

**Nothing about us without us.** Deaf signers take part from the moment the problem is defined until the solution is reviewed, and interpreters produce and validate the content. No text about the deaf experience is published without that review.

**Only claim what can be verified.** The site shows no logos of clients that do not exist and promises no compliance without an audit. Sectors appear as scenarios, not success stories. It is a product decision as much as a communication one.

**Start with one process.** The offer is not a six-month project but the process people ask about most. That lowers the barrier to start and brings real learning before growing.

![Signado pricing, from Free to Enterprise, with limits for journeys, starts and team members.](/projects/signado/case/precios.webp "Plans limit the organisation's capacity, never the people or the places where it is used.")

## Status

Signado is live, with free sign-up for organisations and a [public demo](https://signado.es/es/demo) anyone can try without registering. It is the clearest example of how I work: a well-built general platform that makes it possible to launch a specific product, with its own audience and tone, in far less time.
