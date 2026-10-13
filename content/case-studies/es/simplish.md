---
title: "Simplish: pequeñas herramientas para lo que mantiene en marcha una empresa"
description: "Cómo estoy diseñando y construyendo Simplish, un SaaS B2B que reúne pequeñas herramientas para altas y bajas, accesos, software y recordatorios de equipos pequeños."
name: "Simplish"
url: "https://simplish.work/"
year: "2026"
role: "Producto, diseño y desarrollo"
facets: ["Herramienta para equipos", "Operaciones"]
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Playwright"]
status: "En construcción · acceso anticipado"
cover: "/projects/simplish/case/hero.webp"
order: 4
date: "2026-10-13"
keywords: ["software para pequeñas empresas", "onboarding y offboarding", "gestión de accesos", "SaaS B2B", "herramientas internas"]
---

Alguien empieza el lunes y hay que tenerlo todo listo. Alguien se fue hace un mes y todavía tiene acceso a Figma. Una suscripción se renueva mañana y nadie lo ha visto. Hay un portátil que tiene que volver.

Ninguna de esas tareas justifica implantar una plataforma de recursos humanos. Pero resolverlas con hojas de cálculo, mensajes sueltos y memoria tampoco funciona. Simplish nace para ese hueco: **pequeñas herramientas que hacen una sola cosa y la hacen bien**, todas conectadas y bajo una misma suscripción.

![Portada de Simplish: «Less mess. More done.»](/projects/simplish/case/hero.webp "El tono es parte del producto: directo, con humor y sin jerga corporativa.")

## El reto

El software empresarial suele crecer hacia el mismo sitio: demasiadas funciones, demasiada configuración y demasiados paneles para problemas pequeños. El reto de Simplish es el contrario: **cuánto se puede quitar** sin dejar de resolver el trabajo.

El público es concreto: empresas y equipos de unas 5 a 50 personas, donde esas tareas no tienen un responsable claro y se reparten entre quien tenga un rato.

## La propuesta

Cada herramienta responde a una pregunta que cualquier equipo pequeño se hace:

- **Personas.** ¿Quién trabaja aquí?
- **Altas y bajas.** ¿Qué falta por hacer cuando alguien entra o se va?
- **Software y accesos.** ¿Quién tiene acceso a qué y cuándo se renueva?
- **Recordatorios.** ¿Se nos olvida algo?
- **Y más**: portátiles y otros equipos, kit de marca, fotos de perfil, listas recurrentes y políticas, cada una con su pregunta.

![Las herramientas de Simplish: personas, altas y bajas, software y accesos, y recordatorios, cada una con la pregunta que responde.](/projects/simplish/case/tools.webp "Cada herramienta se presenta con la pregunta que resuelve, no con una lista de funciones.")

## Enseñar en vez de explicar

La portada incluye una **demo interactiva** con tres tareas de ejemplo (preparar la llegada de alguien, revocar un acceso olvidado y programar un recordatorio) que se resuelven con un toque. En lugar de describir el producto, deja probar la sensación que quiere dar: entrar, resolver y seguir con tu día.

![Demo interactiva de Simplish con tres tarjetas: una nueva incorporación, un acceso a Figma pendiente de revocar y una renovación de Notion.](/projects/simplish/case/demo.webp "La demo deja probar el producto antes de que exista del todo: tres tareas pequeñas, tres toques.")

![Vista móvil de la portada de Simplish.](/projects/simplish/case/mobile.webp "Pensada para el móvil desde el principio: muchas de estas tareas aparecen fuera de la oficina.")

## Cómo lo estoy construyendo

Simplish sigue el método que defiendo en mis artículos: [validar antes de construir de más](/es/articulos/construir-ya-no-es-el-cuello-de-botella). La web y la lista de acceso anticipado salieron antes que el producto completo, para medir interés real y hablar con los primeros equipos. Por dentro, el producto se construye con Next.js y Firebase, y los flujos críticos se prueban de punta a punta con Playwright.

## Estado

Simplish está en construcción, con [acceso anticipado abierto](https://simplish.work/) y sin compromiso. Es el caso de un producto que todavía está aprendiendo: la apuesta es que el mejor software para estas tareas es el que te deja en paz.
