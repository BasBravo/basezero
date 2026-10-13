---
title: "Mappic: a special place turned into a vector poster"
description: "How I designed and built Mappic, the product to design custom map posters in the browser and download them as print-ready vector PDFs."
name: "Mappic"
url: "https://mappic.app/"
year: "2025"
role: "Product, design and development"
facets: ["Generative design", "E-commerce"]
stack: ["Next.js", "React", "TypeScript", "MapLibre", "Cloud Run", "Firebase", "Stripe"]
status: "Live"
cover: "/projects/mappic/case/hero.webp"
order: 3
date: "2026-10-13"
keywords: ["custom map poster", "printable vector map", "digital product e-commerce", "generative design", "MapLibre"]
---

The city where you grew up, the trip you would take again or the neighbourhood where you met. Many people want to hang a place on the wall, but the options are usually generic prints or tools that require knowing about cartography and design.

Mappic turns that place into **a personal graphic piece**: you design it in the browser, see the result before paying and download a **vector PDF** ready to print wherever you like.

![Mappic home page with a wall of framed city maps and the message "Turn a special place into art".](/projects/mappic/case/hero.webp "The home page shows the result before the tool: what is being sold is the piece on the wall.")

## The challenge

There were two problems to solve at once. One was about experience: guiding someone with no design background to a beautiful result without overwhelming them with options. The other was technical: making what you see on screen exactly what gets printed, at any size and at professional quality.

## Two ways to create

The main flow starts with intent, not with the map. You first choose what you want to achieve (decorate your home, give a gift, remember a trip, a wedding or a birth) and Mappic orders the next decisions to show only what fits: composition, places, style and text.

For people who want more control there is **Studio**, an advanced editor with the artwork in the centre, tools at the bottom and properties on the right: text layers, gradients, masks, points and routes.

![Mappic editor with a New York map on the canvas and the location and text settings on the right.](/projects/mappic/case/editor.webp "Any design in the gallery can be customised: location, text, style and framing, with a live preview.")

## Beyond a single frame

One design can be split into several connected pieces: a diptych, a triptych or a whole wall. The geography continues from one frame to the next, and each piece is generated as its own PDF.

![New York composition split into nine connected posters.](/projects/mappic/case/composicion.webp "New York in nine panels: one composition printed as nine posters.")

![Mappic gallery: Seoul, Chicago, New York, Rome and Berlin in different styles.](/projects/mappic/case/galeria.webp "The gallery works as a catalogue and a starting point: every map is a template you can make your own.")

## Technical decisions

**Preview in the browser, final render on the server.** The preview is drawn live with MapLibre on open OpenStreetMap data (via OpenFreeMap). On purchase, a dedicated Cloud Run service applies the same theme to the map style and renders the final PDF with vector geometry and vector text. One set of style rules feeds both outputs, so what you see is what you print.

**Selling a file, not an object.** Mappic delivers the PDF and lets each person choose the print shop, paper and frame. That removes logistics, stock and returns, and allows a very low price per map.

**A second audience.** Print shops, interior designers and hosts have Studio plans with commercial use, to design with the client next to them and print on their own machines.

**Content that ranks.** City pages, compositions and printing guides answer real searches and lead straight to the editor with the city already in place.

![Mappic home page on mobile.](/projects/mappic/case/mobile.webp "On mobile, the gallery of framed posters leads straight into creating your own map.")

## Status

Mappic is live, with pay-per-map pricing and Studio plans for professionals. It is the project where design and technology meet most: the value is in the piece, but it only exists because the rendering behind it is precise.
