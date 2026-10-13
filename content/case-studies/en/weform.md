---
title: "Weform: videos that ask and adapt"
description: "How I designed and built Weform, the SaaS platform to create, publish and measure interactive video experiences with questions, forms and branching paths."
name: "Weform"
url: "https://weform.app/"
year: "2026"
role: "Product, design and development"
facets: ["SaaS platform", "AI"]
stack: ["Next.js", "React", "TypeScript", "Firebase", "Cloudflare R2 and Workers", "Stripe", "Gemini"]
status: "Live · beta"
cover: "/projects/weform/case/hero.webp"
order: 2
date: "2026-10-13"
keywords: ["interactive video", "SaaS platform", "video training", "video onboarding", "SaaS development"]
---

A video explains very well, but it does not listen. To check whether someone understood, collect their details or take them down a different path depending on their situation, organisations end up chaining a player, a form, a PDF and some custom development. None of those pieces knows what happens in the others.

Weform brings all of that onto the video itself: **information, questions, forms and decisions that change each person's path**, with no code, published by link, embed or QR code.

![Weform home page: "Your videos ask and adapt".](/projects/weform/case/hero.webp "The promise in one line: the video stops being a monologue and becomes a journey.")

## The challenge

Complete interactive video solutions tend to be expensive and complex for small teams, and the simple ones stop at putting buttons on top of a video. The gap was in between: a tool anyone could use to build a branching journey, test it and measure it, with the solidity of a platform.

It also meant deciding what Weform would **not** be. It is not a video editor, a chatbot, a full LMS or a generic form builder. Writing those limits down from the start kept out many features that would have complicated the product.

## What I built

The product covers the whole cycle in one tool: start, build, test, brand, publish and measure.

- **Builder.** Steps are placed on the video timeline and each answer connects to the next step through conditions. The journey can be tested on desktop and mobile from the editor itself.
- **Player.** Works on any device, with subtitles per language, keyboard support and visible focus, and no sign-up for participants.
- **Programs.** Several experiences can be grouped into courses or ordered blocks with progress and unlocking, without turning Weform into an LMS.
- **Results.** Sessions, paths and answers for each experience, with export.
- **Workspaces per organisation**, with separate data, permissions and branding, ready for white label.

![The Weform player with a sample experience and its controls.](/projects/weform/case/player.webp "The player is all participants see: it has to be fast, clear and accessible on any screen.")

![Weform analytics dashboard with sessions, participants, completion rate, answers and trends.](/projects/weform/case/resultados.webp "Analytics answers three questions: who watched, what they answered and where they stopped.")

## Technical decisions

**Video served as a product.** Videos are processed for adaptive streaming (HLS) and served from Cloudflare R2 through a Worker that validates signed URLs. The same Worker meters the bytes delivered per organisation, because video delivery is the cost that really scales and the plans are based on it.

**AI where it saves work.** Transcripts and subtitles are generated with AI (Gemini), and their final accuracy stays with the author. It does not replace them; it takes away the most mechanical part.

**Accessibility from the start.** WCAG 2.2 AA guides the product, with the honesty of not claiming conformance without an audit. The platform provides multi-track subtitles, variants by language and cognitive level, and a base that later made it possible to build [Signado](/en/projects/signado) on top.

**Pricing on what scales.** Plans are based on projects, storage, streaming, interactions and team size, with a free plan that needs no card. Participants are never charged.

## Status

Weform is live in open beta, with [public pricing](https://weform.app/es/pricing) and a technical base that already powers a second product. For me it shows what building a platform from scratch with an AI-first method means: a lot of speed in the code, and judgement focused on what goes in, what stays out and how it is measured.
