---
title: "Mappic: un lugar especial convertido en un póster vectorial"
description: "Cómo diseñé y construí Mappic, el producto para diseñar pósteres de mapas personalizados en el navegador y descargarlos en PDF vectorial listo para imprimir."
name: "Mappic"
url: "https://mappic.app/"
year: "2025"
role: "Producto, diseño y desarrollo"
facets: ["Diseño generativo", "E-commerce"]
stack: ["Next.js", "React", "TypeScript", "MapLibre", "Cloud Run", "Firebase", "Stripe"]
status: "En producción"
cover: "/projects/mappic/case/hero.webp"
order: 3
date: "2026-10-13"
keywords: ["póster de mapa personalizado", "mapa vectorial para imprimir", "e-commerce de producto digital", "diseño generativo", "MapLibre"]
---

La ciudad donde creciste, el viaje que repetirías o el barrio donde os conocisteis. Mucha gente quiere colgar un lugar en la pared, pero las opciones suelen ser láminas genéricas o herramientas que exigen saber de cartografía y diseño.

Mappic convierte ese lugar en **una pieza gráfica personal**: se diseña en el navegador, se ve el resultado antes de pagar y se descarga un **PDF vectorial** listo para imprimir donde cada uno quiera.

![Portada de Mappic con una pared de mapas enmarcados de varias ciudades y el mensaje «Convierte un lugar especial en arte».](/projects/mappic/case/hero.webp "La portada enseña el resultado antes que la herramienta: lo que se vende es la pieza en la pared.")

## El reto

Había dos problemas que resolver a la vez. El primero, de experiencia: guiar a alguien sin conocimientos de diseño hasta un resultado bonito, sin abrumarle con opciones. El segundo, técnico: que lo que se ve en pantalla sea exactamente lo que se imprime, a cualquier tamaño y con calidad profesional.

## Dos formas de crear

El recorrido principal empieza por la intención, no por el mapa. Primero se elige qué se quiere conseguir (decorar la casa, hacer un regalo, recordar un viaje, una boda o un nacimiento) y Mappic ordena las siguientes decisiones para enseñar solo lo que encaja: composición, lugares, estilo y textos.

Para quien quiere más control está **Studio**, un editor avanzado con la obra en el centro, las herramientas abajo y las propiedades a la derecha: capas de texto, degradados, máscaras, puntos y rutas.

![Editor de Mappic con un mapa de Nueva York en el lienzo y los ajustes de ubicación y textos a la derecha.](/projects/mappic/case/editor.webp "Cualquier diseño de la galería se puede personalizar: ubicación, textos, estilo y encuadre, con la vista previa en directo.")

## Más allá de un marco

Un mismo diseño puede repartirse en varias piezas conectadas: un díptico, un tríptico o una pared entera. La geografía continúa de un marco al siguiente, y cada pieza se genera como un PDF independiente.

![Composición de Nueva York repartida en nueve pósteres conectados.](/projects/mappic/case/composicion.webp "Nueva York en nueve paneles: una sola composición que se imprime como nueve pósteres.")

![Galería de mapas de Mappic: Seúl, Chicago, Nueva York, Roma y Berlín en estilos distintos.](/projects/mappic/case/galeria.webp "La galería funciona como catálogo y como punto de partida: cada mapa es una plantilla que se puede hacer propia.")

## Decisiones técnicas

**Vista previa en el navegador, render final en el servidor.** La vista previa se dibuja en directo con MapLibre sobre datos abiertos de OpenStreetMap (vía OpenFreeMap). Al comprar, un servicio propio en Cloud Run aplica el mismo tema al estilo del mapa y genera el PDF final con geometrías y textos vectoriales. Un único conjunto de reglas de estilo alimenta las dos salidas, así que lo que se ve es lo que se imprime.

**Vender un archivo, no un objeto.** Mappic entrega el PDF y deja que cada persona elija imprenta, papel y marco. Eso elimina logística, stock y devoluciones, y permite un precio por mapa muy bajo.

**Un segundo público.** Las imprentas, copisterías, interioristas y alojamientos tienen planes de Studio con uso comercial, para diseñar con el cliente al lado e imprimir en su propia máquina.

**Contenido que posiciona.** Páginas por ciudad, composiciones y guías de impresión que responden a búsquedas reales («póster mapa ciudad») y llevan directamente al editor con la ciudad ya colocada.

![Vista móvil de la portada de Mappic.](/projects/mappic/case/mobile.webp "En el móvil, la galería de pósteres enmarcados lleva directamente a crear el mapa propio.")

## Estado

Mappic está en producción, con pago por mapa y planes de Studio para profesionales. Es el proyecto donde más se juntan diseño y tecnología: el valor está en la pieza, pero solo existe porque el render detrás es preciso.
