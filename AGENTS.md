# AGENTS.md — Basezero web

## Idioma

Responder en español. Código, commits e identificadores técnicos permanecen en inglés.

## Stack

- Next.js 16 con App Router, React 19 y TypeScript estricto.
- Tailwind CSS v4 y shadcn/ui source-owned sobre Base UI.
- `next-intl` con rutas `es` y `en`.
- Firebase cliente preparado en `lib/firebase/`.
- Zustand solo para estado compartido real; estado local por defecto.
- Vitest y Testing Library para pruebas.

## Arquitectura

- Server Components por defecto; añadir `'use client'` solo por interacción o APIs de navegador.
- Rutas y layouts en `app/`; lógica de producto en `features/[domain]/`.
- Components consumen hooks; hooks orquestan stores y services; services son autónomos.
- Primitives revisables en `components/ui/`; no mezclar otro sistema de diseño.
- Los cambios visuales globales se hacen mediante tokens semánticos en `app/globals.css`.
- Los textos visibles viven en `messages/{es,en}.json`.
- Las variables privadas nunca llevan el prefijo `NEXT_PUBLIC_`.

## Figuras de artículos

Las ilustraciones interactivas de los artículos siguen la guía de [docs/article-figures.md](docs/article-figures.md): isométricas con la skill `anatomy`, controles de interfaz visibles y los cuatro botones de esquina (pausa/play, −, +, restablecer) con giro ±50° y zoom. Léela antes de crear o tocar una figura.

## Validación

Antes de cerrar un cambio, ejecutar `pnpm check`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
