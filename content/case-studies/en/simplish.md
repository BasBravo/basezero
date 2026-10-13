---
title: "Simplish: small tools for the work that keeps a company running"
description: "How I am designing and building Simplish, a B2B SaaS that brings together small tools for onboarding, offboarding, access, software and reminders for small teams."
name: "Simplish"
url: "https://simplish.work/"
year: "2026"
role: "Product, design and development"
facets: ["Team tool", "Operations"]
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Playwright"]
status: "In progress · early access"
cover: "/projects/simplish/case/hero.webp"
order: 4
date: "2026-10-13"
keywords: ["software for small businesses", "onboarding and offboarding", "access management", "B2B SaaS", "internal tools"]
---

Someone starts on Monday and everything needs to be ready. Someone left a month ago and still has access to Figma. A subscription renews tomorrow and nobody has noticed. There is a laptop that needs to come back.

None of these tasks justifies rolling out an HR platform. But handling them with spreadsheets, scattered messages and memory does not work either. Simplish was born for that gap: **small tools that each do one job and do it well**, all connected under a single subscription.

![Simplish home page: "Less mess. More done."](/projects/simplish/case/hero.webp "The tone is part of the product: direct, with humour and without corporate jargon.")

## The challenge

Business software tends to grow in the same direction: too many features, too much configuration and too many dashboards for small problems. Simplish's challenge is the opposite: **how much can be taken away** while still getting the work done.

The audience is specific: companies and teams of about 5 to 50 people, where these tasks have no clear owner and end up with whoever has a spare moment.

## The offer

Each tool answers a question every small team asks:

- **People.** Who works here?
- **On / offboarding.** What is left to do when someone joins or leaves?
- **Software and access.** Who has access to what, and when does it renew?
- **Reminders.** Are we forgetting something?
- **And more**: laptops and other assets, brand kit, profile photos, recurring checklists and policies, each with its own question.

![Simplish tools: people, on/offboarding, software and access, and reminders, each with the question it answers.](/projects/simplish/case/tools.webp "Each tool is introduced by the question it answers, not by a list of features.")

## Showing instead of explaining

The home page includes an **interactive demo** with three sample tasks (getting ready for a new hire, revoking a forgotten access and setting a reminder) that are done with a single tap. Instead of describing the product, it lets people feel what it aims for: come in, get it done and get on with your day.

![Simplish interactive demo with three cards: a new hire, a Figma access to revoke and a Notion renewal.](/projects/simplish/case/demo.webp "The demo lets people try the product before it fully exists: three small tasks, three taps.")

![Simplish home page on mobile.](/projects/simplish/case/mobile.webp "Designed for mobile from the start: many of these tasks come up away from the desk.")

## How I am building it

Simplish follows the method I write about: validate before building too much. The site and the early access list went out before the full product, to measure real interest and talk to the first teams. Under the hood it is built with Next.js and Firebase, and critical flows are tested end to end with Playwright.

## Status

Simplish is in progress, with [early access open](https://simplish.work/) and no commitment. It is the case of a product that is still learning: the bet is that the best software for these tasks is the kind that leaves you alone.
