---
title: "Signado: un trámite entero en lengua de signos"
description: "Cómo diseñé y construí Signado, la plataforma que convierte trámites escritos en recorridos interactivos en LSE y LSC para que las personas sordas los terminen solas."
name: "Signado"
url: "https://signado.es/"
year: "2026"
role: "Producto, diseño y desarrollo"
facets: ["Plataforma SaaS", "Accesibilidad"]
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Motor de Weform"]
status: "En producción"
cover: "/projects/signado/case/hero.webp"
order: 1
date: "2026-10-13"
keywords: ["lengua de signos", "accesibilidad digital", "LSE", "personas sordas", "vídeo interactivo accesible"]
---

Buena parte de los trámites dan por hecho que todo el mundo lee bien el español escrito. Para muchas personas sordas signantes es una segunda lengua. Un formulario o un consentimiento que para otros es rutina se convierte en algo que hay que descifrar, a menudo con prisa y delante de alguien.

Signado parte de una idea sencilla: **si la lengua de la persona es la lengua de signos, el trámite entero debería estar en lengua de signos**. No un vídeo al principio y después el mismo formulario de siempre, sino cada paso, cada pregunta y cada decisión.

![Portada de Signado: «La nueva forma de comunicarte con personas sordas», con los tres principios del producto debajo.](/projects/signado/case/hero.webp "La portada resume la promesa en una frase y la sostiene con tres principios: sin instalar nada, signado por personas e interactivo de verdad.")

## El reto

Lo que existe hoy para atender a una persona sorda suele ser una de tres cosas: subtítulos o lectura fácil, papel y bolígrafo, o pedir un intérprete con días de antelación. Las tres ayudan, pero ninguna resuelve lo que más se repite: el trámite previsible que alguien tiene que hacer un jueves a las once de la noche sin depender de nadie.

El producto tenía que ser útil para dos personas a la vez:

- **La persona sorda**, que necesita entender, elegir y terminar sola, desde su móvil y sin registrarse.
- **La organización**, que necesita publicar ese trámite sin tocar sus sistemas y saber si funciona.

## Rehacer el trámite, no traducirlo

La decisión que define Signado es no traducir formularios. Poner lengua de signos encima de un proceso escrito lo deja igual de complicado. En su lugar, cada trámite se reconstruye como un **recorrido**: un vídeo signado explica, pregunta, la persona elige y su respuesta decide el siguiente paso.

![Comparación entre el trámite habitual (texto, formulario, duda, llamada) y el mismo trámite con Signado (vídeo en LSE, pregunta, elección, documentación, terminado).](/projects/signado/case/tramite.webp "La comparación que guía el producto: el idioma no es una capa que se añade, es la interfaz.")

Cada recorrido se abre desde un QR o un enlace, en el navegador. Las opciones siempre están a la vista, se elige una cosa cada vez y el final deja claro qué ha pasado y qué ocurre después.

![Los pasos de un recorrido en Signado: se abre al momento, cada paso está en su lengua, una decisión cada vez y la respuesta cambia el recorrido.](/projects/signado/case/recorrido.webp "Cada paso del recorrido tiene una sola tarea. La persona no tiene que deducir qué hacer ni buscarlo fuera.")

## Qué construí

Signado es una vertical sobre [Weform](/es/proyectos/weform), la plataforma de vídeo interactivo que también he construido. En lugar de empezar de cero, reutiliza su motor de recorridos, reproducción y resultados, y añade lo que hace falta para la lengua de signos:

- Recorridos en **LSE y LSC**, con contenido grabado por personas signantes reales, no avatares.
- Una web pública en cinco idiomas (español, euskera, catalán, gallego y valenciano) para las organizaciones.
- Planes por capacidad: se paga por lo que se publica, nunca por quien usa el recorrido.
- Un servicio aparte de producción de vídeo en LSE y LSC, porque grabar bien cuesta y conviene decirlo desde el principio.
- Medidas que importan: cuántas personas terminan solas, en qué paso se van y cuánto tardan.

![Vista móvil de la portada de Signado.](/projects/signado/case/mobile.webp "Casi todo ocurre en el móvil: el recorrido tiene que funcionar a una mano y sin instalar nada.")

## Decisiones que importan

**Nada sobre nosotros sin nosotros.** Las personas sordas signantes participan desde que se define el problema hasta que se revisa la solución, y los intérpretes producen y validan el contenido. Ningún texto sobre la experiencia sorda se publica sin esa revisión.

**Decir solo lo que se puede verificar.** La web no enseña logotipos de clientes que no existen ni promete conformidad sin auditoría. Los sectores aparecen como escenarios, no como casos de éxito. Es una decisión de producto tanto como de comunicación.

**Empezar por un solo trámite.** La propuesta comercial no es un proyecto de seis meses, sino el trámite que más se repite. Eso baja la barrera de entrada y genera aprendizaje real antes de crecer.

![Tabla de planes de Signado, de Free a Enterprise, con los cupos de recorridos, inicios y equipo.](/projects/signado/case/precios.webp "Los planes limitan la capacidad de la organización, nunca a las personas ni los lugares donde se usa.")

## Estado

Signado está en producción, con alta gratuita para organizaciones y una [demo pública](https://signado.es/es/demo) que se recorre sin registro. Es el ejemplo más claro de cómo trabajo: una plataforma general bien hecha que permite lanzar un producto específico, con su propio público y su propio tono, en mucho menos tiempo.
