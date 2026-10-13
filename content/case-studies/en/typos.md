---
title: "typos: a vector type studio in the browser"
description: "How I designed and built typos, a creative tool that turns words into editable typographic compositions and exports them as vector SVG."
name: "typos"
url: "https://typos.basezero.dev"
year: "2026"
role: "Product, design and development"
facets: ["Creative tool", "Typography"]
stack: ["Next.js", "React", "TypeScript", "opentype.js", "Paper.js", "Three.js", "Firebase", "Stripe"]
status: "Live"
cover: "/projects/typos/case/studio.webp"
order: 5
date: "2026-10-13"
keywords: ["vector typography", "print-ready SVG", "browser design tool", "typography templates", "print on demand"]
---

Most design tools expect you to arrive with a finished idea. typos starts earlier: at the moment a word stops being just text and starts looking like **material**, something you can stretch, wave, repeat or project into space.

It is a typography studio in the browser that turns words into **editable type systems** and exports them as vector SVG.

![typos home page: "Play with type before you make it yours", with a live template distorting the word BASEZERO.](/projects/typos/case/home.webp "The home page is already the tool: a live template with any word you want.")

## The challenge

Experimenting with expressive typography usually takes desktop software and a fair amount of craft. typos set out to shorten that distance: anyone should be able to try an idea in seconds and, if they like the result, get a professional-quality file, not a screenshot.

## How it works

You pick a template, change the text and adjust its parameters: motion, distortion, projection, spacing and colour. The design is saved as editable and exported as vector SVG or high-resolution PNG.

![typos editor with the Flow template applied to the word HELLO and the parameters panel on the right.](/projects/typos/case/studio.webp "The editor: the artwork in the centre and, on the right, template, text, font, parameters and export.")

Every published design can become part of a public profile, appear in the gallery, be remixed or be prepared to become a physical product.

![typos gallery with community compositions.](/projects/typos/case/gallery.webp "The gallery turns experiments into a public body of work that others can remix.")

## Technical decisions

**Real outlines, not screenshots.** opentype.js reads the outlines of the chosen font and each word becomes SVG paths. Geometric operations are done with Paper.js, so the result stays sharp at poster size or on a T-shirt.

**SVG whenever possible.** Only templates that need real 3D rendering (with Three.js) are exported as high-resolution images. Everything else stays vector, which is what can be printed, edited and reused in another design workflow.

**Readable by agents too.** typos publishes a product facts page and an `llms.txt` so search engines and AI assistants understand what it is and what it does. It is the same idea I have applied to this site.

## Status

typos is live and small on purpose: I build it on my own, with the patience and limits that come with that. It is the studio's most personal project, and the one that best sums up an obsession: making digital tools precise, useful and a little more human.
