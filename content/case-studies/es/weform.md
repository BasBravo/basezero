---
title: "Weform: vídeos que preguntan y se adaptan"
description: "Cómo diseñé y construí Weform, la plataforma SaaS para crear, publicar y medir experiencias de vídeo interactivas con preguntas, formularios y caminos."
name: "Weform"
url: "https://weform.app/"
year: "2026"
role: "Producto, diseño y desarrollo"
facets: ["Plataforma SaaS", "IA"]
stack: ["Next.js", "React", "TypeScript", "Firebase", "Cloudflare R2 y Workers", "Stripe", "Gemini"]
status: "En producción · beta"
cover: "/projects/weform/case/hero.webp"
order: 2
date: "2026-10-13"
keywords: ["vídeo interactivo", "plataforma SaaS", "formación con vídeo", "onboarding con vídeo", "desarrollo de SaaS"]
---

Un vídeo explica muy bien, pero no escucha. Para comprobar si alguien ha entendido, recoger sus datos o llevarle por un camino distinto según su situación, las organizaciones acaban encadenando un reproductor, un formulario, un PDF y algo de desarrollo a medida. Nada de eso sabe lo que pasa en las otras piezas.

Weform reúne todo eso sobre el propio vídeo: **información, preguntas, formularios y decisiones que cambian el recorrido de cada persona**, sin código y publicado por enlace, embed o QR.

![Portada de Weform: «Tus vídeos preguntan y se adaptan».](/projects/weform/case/hero.webp "La promesa en una línea: el vídeo deja de ser un monólogo y pasa a ser un recorrido.")

## El reto

Las soluciones completas de vídeo interactivo suelen ser caras y complejas para equipos pequeños. Y las sencillas se quedan en poner botones encima de un vídeo. El hueco estaba en algo intermedio: una herramienta que cualquier persona pudiera usar para montar un recorrido con ramas, probarlo y medirlo, con la solidez de una plataforma.

También había que decidir qué **no** iba a ser. Weform no es un editor de montaje, ni un chatbot, ni un LMS completo, ni un constructor de formularios genérico. Escribir esos límites desde el principio evitó muchas funciones que habrían complicado el producto.

## Qué construí

El producto cubre el ciclo completo en una sola herramienta: empezar, construir, probar, personalizar, publicar y medir.

- **Constructor.** Se colocan pasos sobre la línea de tiempo del vídeo y cada respuesta se conecta con el siguiente paso mediante condiciones. El recorrido se prueba en escritorio y móvil desde el propio editor.
- **Reproductor.** Funciona en cualquier dispositivo, con subtítulos por idioma, teclado y foco visibles, y sin pedir registro a quien participa.
- **Programas.** Varias experiencias se agrupan en cursos o bloques con orden, progreso y desbloqueo, sin convertir Weform en un LMS.
- **Resultados.** Sesiones, rutas y respuestas de cada experiencia, con exportación.
- **Espacios por organización**, con datos, permisos y marca separados, preparados para marca blanca.

![El reproductor de Weform con una experiencia de ejemplo y sus controles.](/projects/weform/case/player.webp "El reproductor es lo único que ve quien participa: tiene que ser rápido, claro y accesible en cualquier pantalla.")

![Panel de analítica de Weform con sesiones, participantes, tasa de finalización, respuestas y evolución.](/projects/weform/case/resultados.webp "La analítica responde a tres preguntas: quién lo vio, qué respondió y dónde se quedó.")

## Decisiones técnicas

**El vídeo, servido como un producto.** Los vídeos se procesan para streaming adaptativo (HLS) y se sirven desde Cloudflare R2 a través de un Worker que valida URLs firmadas. El mismo Worker mide los bytes entregados por organización, porque el consumo de vídeo es el coste que de verdad escala y los planes se basan en él.

**La IA donde ahorra trabajo.** La transcripción y los subtítulos se generan con IA (Gemini), y la exactitud final sigue siendo del autor. No le sustituye: le quita la parte más mecánica.

**Accesibilidad desde el origen.** WCAG 2.2 AA orienta el producto, con la honestidad de no declarar conformidad sin una auditoría. La plataforma aporta subtítulos multipista, variantes por idioma y nivel cognitivo, y una base que más tarde permitió construir [Signado](/es/proyectos/signado) encima.

**Precios por lo que escala.** Los planes se basan en proyectos, almacenamiento, streaming, interacciones y equipo, con un plan gratuito sin tarjeta. Nunca se cobra a las personas que participan.

## Estado

Weform está en producción en beta abierta, con [planes públicos](https://weform.app/es/pricing) y una base técnica que ya sostiene un segundo producto. Para mí es la muestra de qué significa construir una plataforma desde cero con un método AI-first: mucha velocidad en el código, y el criterio puesto en qué entra, qué se queda fuera y cómo se mide.
