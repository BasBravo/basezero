---
title: "typos: un estudio de tipografía vectorial en el navegador"
description: "Cómo diseñé y construí typos, una herramienta creativa para convertir palabras en composiciones tipográficas editables y exportarlas como SVG vectorial."
name: "typos"
url: "https://typos.basezero.dev"
year: "2026"
role: "Producto, diseño y desarrollo"
facets: ["Herramienta creativa", "Tipografía"]
stack: ["Next.js", "React", "TypeScript", "opentype.js", "Paper.js", "Three.js", "Firebase", "Stripe"]
status: "En producción"
cover: "/projects/typos/case/studio.webp"
order: 5
date: "2026-10-13"
keywords: ["tipografía vectorial", "SVG para imprimir", "herramienta de diseño en el navegador", "plantillas tipográficas", "print on demand"]
---

La mayoría de las herramientas de diseño piden llegar con la idea terminada. typos empieza antes: en el momento en que una palabra deja de ser solo texto y empieza a parecer **materia**, algo que se puede estirar, ondular, repetir o proyectar en el espacio.

Es un estudio de tipografía en el navegador que convierte palabras en **sistemas tipográficos editables** y los exporta como SVG vectorial.

![Portada de typos: «Play with type before you make it yours», con una plantilla en directo que deforma la palabra BASEZERO.](/projects/typos/case/home.webp "La portada es ya la herramienta: una plantilla en directo con la palabra que quieras.")

## El reto

Experimentar con tipografía expresiva suele exigir un programa de escritorio y bastante oficio. typos quería acortar esa distancia: que cualquiera pudiera probar una idea en segundos y, si le gusta el resultado, tener un archivo de calidad profesional, no una captura.

## Cómo funciona

Se elige una plantilla, se cambia el texto y se ajustan sus parámetros: movimiento, distorsión, proyección, espaciado y color. El diseño se guarda editable y se exporta en SVG vectorial o en PNG de alta resolución.

![Editor de typos con la plantilla Flow aplicada a la palabra HELLO y el panel de parámetros a la derecha.](/projects/typos/case/studio.webp "El editor: la obra en el centro y, a la derecha, plantilla, texto, fuente, parámetros y exportación.")

Cada diseño publicado puede formar parte de un perfil público, aparecer en la galería, mezclarse con otras obras o prepararse para convertirse en un producto físico.

![Galería de typos con composiciones de la comunidad.](/projects/typos/case/gallery.webp "La galería convierte los experimentos en un cuerpo de trabajo público que otros pueden remezclar.")

## Decisiones técnicas

**Contornos reales, no capturas.** Con opentype.js se leen los contornos de la fuente elegida y cada palabra se convierte en trazados SVG. Las operaciones geométricas se hacen con Paper.js, así que el resultado sigue nítido a tamaño póster o en una camiseta.

**SVG siempre que se pueda.** Solo las plantillas que necesitan un render 3D real (con Three.js) se exportan como imagen de alta resolución. El resto se queda en vectorial, que es lo que se puede imprimir, editar y reutilizar en otro flujo de diseño.

**Legible también para agentes.** typos publica una página de datos del producto y un `llms.txt` para que buscadores y asistentes de IA entiendan qué es y qué hace. Es la misma idea que he aplicado a esta web.

## Estado

typos está publicado y es pequeño a propósito: lo construyo yo solo, con la paciencia y los límites que eso implica. Es el proyecto más personal del estudio, y el que mejor resume una obsesión: que las herramientas digitales sean precisas, útiles y un poco más humanas.
