# Figuras interactivas de los artículos

Guía para crear y mantener las ilustraciones dinámicas de los artículos. El estado actual de las dos primeras figuras (clasificador de formas y prueba de carga) y de las cuatro de los artículos sobre resultados y primeras versiones (cambio de vía, depósito con fuga, circuito completo y recorrido de punta a punta), y las dos de «Lanzar no es el final de la prueba» (indicador de decisión y balanza de señales), es la referencia: toda figura nueva debe comportarse y verse igual.

## Principios

1. **Un concepto sencillo y cotidiano.** Cada figura explica una sola idea del texto con un objeto que entiende cualquiera (un clasificador de formas, una tabla con pesas). Nada de maquetas de ingeniería: si hace falta explicarla, es demasiado compleja.
2. **Isométrica y con el estilo de la skill `anatomy`** (`.claude/skills/anatomy`): placa base sobre patas, sólidos con cuatro tonos, un único acento (`lit`), líneas finas que siempre terminan sobre algo, tarjeta con `Fig N`, título, pista y lectura en las esquinas.
3. **Interacción evidente.** Botones y deslizadores de interfaz, no gestos ocultos. Sin que nadie toque nada, la figura se reproduce sola.
4. **Verdad.** Los números que muestra salen de un modelo puro con tests (la flecha de la tabla sale de la fórmula de una viga, por ejemplo).

## Dónde vive cada cosa

```
components/iso/                  Kit de la skill, copiado y propio (iso-kit.ts, draw.tsx, live.tsx, iso.css). Ignorado por ESLint.
features/articles/figures/
  ArticleFigure.tsx              Registro: id → componente, y figureIdOf() para el Markdown.
  copy.ts                        Carga los textos del namespace `Figures` de messages/{es,en}.json.
  IsoTheme.tsx                   Envuelve la figura y copia el tema claro/oscuro de <html data-theme>.
  orbit.ts / useOrbit.ts         Cámara: ajuste por vista y arrastre ±50° en horizontal y vertical.
  useZoom.ts                     Zoom del dibujo (0,75×–2×).
  painter.ts                     Orden de pintado general por planos separadores.
  PlayButton.tsx                 CornerControls: los cuatro botones de la esquina.
  base.tsx                       Placa sobre patas común (baseArtOf + BaseNode); úsala en las figuras nuevas.
  track.ts                       Vía con raíles y traviesas, tren (cartArt) y ghostBox (contorno punteado de lo que falta).
  hooks.ts                       useInView, useReducedMotion.
  figures.module.css             Controles, botones de esquina, viewport y zoom.
  <figura>/
    model.ts (+ model.test.ts)   Física/estado puro, sin DOM ni cámara.
    view.ts                      Constantes del mundo y cámara (CENTRE, projectionFor).
    geometry.ts                  artOf(P): todo el dibujo para una cámara P.
    <Figura>Figure.tsx           Componente cliente: estado, bucle, capas y controles.
```

## Cómo se incrusta en un artículo

En el Markdown, una imagen cuyo `src` es `figure:<id>`:

```md
![Texto alternativo que describe la figura.](figure:sorter)
```

`ArticlePage` la sustituye por `ArticleFigure` (y el párrafo contenedor por un `div`). Los ids válidos están en `figureIdOf`. Los textos visibles viven en `messages/{es,en}.json` bajo `Figures.<id>`; `copy.ts` los lee con `t.raw` (no `t()`: las plantillas llevan `{llaves}` que ICU intentaría interpretar).

## Contrato de interfaz (igual en todas las figuras)

**Esquina superior izquierda**, dentro de la tarjeta y antes de `Fig N`, cuatro botones pequeños solo con icono y con borde, siempre en este orden:

1. Reproducir / pausar.
2. Alejar (−).
3. Acercar (+).
4. Restablecer vista (flecha circular).

Se montan con `<Plate lead={<CornerControls … />}>`; `Plate` coloca el grupo y el número de figura en la misma fila.

- **Reproducción.** Activa por defecto. Tras ~7 s sin que el usuario toque nada empieza una demostración en bucle. Pausar detiene solo esa demostración: las acciones manuales funcionan siempre. Con `prefers-reduced-motion` no hay demostración ni animaciones.
- **Giro.** Arrastrar con ratón o dedo gira la cámara hasta ±50° del centro en azimut y en elevación. La elevación se limita a 8°–86° (por debajo no se ve nada útil). Arrastre horizontal → azimut; arrastre hacia abajo → más elevación. El contenedor lleva `touch-action: pan-y` para no bloquear el scroll vertical.
- **Zoom.** Escala solo el dibujo (CSS `transform` dentro de un viewport con `overflow: hidden`), nunca los controles. Los botones se desactivan en los extremos.
- **Restablecer** devuelve giro y zoom al centro; se desactiva si ya está ahí.
- **Controles propios de la figura**, debajo del dibujo y dentro de la tarjeta, con la clase `controls` del módulo CSS: botones con texto (`button`, `aria-pressed` para el activo) o deslizador con botones − / + y una etiqueta de resultado.
- **Esquinas de la tarjeta:** pista (`hint`, termina en «· arrastra para girar»), título, y lectura en vivo (`readout`) escrita con `useReadout().say()`. Además, una región `aria-live="polite"` oculta con el mismo texto.
- **Teclado y accesibilidad:** todos los controles son botones/inputs nativos; el SVG lleva `label` descriptivo; la leyenda (`keys`) usa como máximo dos marcas (`lit` para lo importante, `raised` para el resto).

## Reglas de diseño y de código

**Modelo.** `model.ts` es puro y se prueba con Vitest: casos límite, continuidad del movimiento, y que lo que se dibuja coincide con lo que se calcula.

**Geometría.** Todo lo que depende de la cámara se calcula en `artOf(P)` (`geometry.ts`) y se memoiza por vista (`useMemo` sobre `P`). Nada de constantes de módulo con `P`. Las piezas que se mueven se construyen una vez en el origen y se desplazan con `shiftOf(P)`; solo se reconstruye lo que cambia de forma (como la tabla que se dobla).

**Cámara.** `orbit.ts#projectionFor` ajusta la escena a la tarjeta en cada vista, así que al girar siempre llena el espacio. Incluye en `points` los extremos de todo lo que se pueda mover (piezas en vuelo, torres del fondo).

**Orden de pintado.** No se fija a mano. Cada elemento es una capa `{ id, box, node }` con su caja en el mundo y `ordered(layers, P)` las ordena por planos separadores para cualquier giro. Para casos que no se resuelven con cajas:
- `after: ['id']` fuerza el orden (una pieza hundida en el agujero va después del bloque; las pesas, después de la tabla).
- `ignore: ['id']` excluye un par que se resuelve de otra forma (un hilo entre dos apoyos se recorta con `clipPath` y `evenodd` usando la silueta del apoyo que queda más cerca).
Los elementos con cara visible variable (la tapa de la tabla) eligen el lado según `cos(azimut)`.

**Recortes.** Lo que entra en un hueco (la pieza en el agujero) se recorta con el casco proyectado de la «chimenea» del hueco; el fondo del hueco, con la abertura. Hay que recortar también las líneas interiores y dibujar solo las aristas del lado lejano.

**React.** El lint del compilador de React prohíbe leer `ref.current` durante el render: los bucles escriben un *snapshot* en estado (`setView`) o pintan por atributos desde efectos. Para la raíz observada se usa directamente el `anchor` de `useReadout`.

**Hidratación.** Redondea los flotantes que acaban en atributos (`points`, transformaciones): servidor y cliente pueden diferir en los últimos decimales.

**Estilo.** Colores y trazos solo por los tokens del kit (`--anatomy-*`) y los del artículo (`--ink`, `--paper`, …), de modo que claro y oscuro funcionan sin más. El estilo de los controles sigue la tarjeta (`figures.module.css`), no el sistema de componentes de la web.

## Crear una figura nueva

1. Decide el concepto (una idea del texto, un objeto cotidiano) y qué hace el usuario (botones, deslizador).
2. Crea `features/articles/figures/<id>/` con `model.ts` y su test; empieza por la verdad del modelo.
3. `view.ts`: mundo, `CENTRE = { azimuth, elevation, elevationRange }` y `projectionFor(az, el)` con una `Camera` de `orbit.ts`.
4. `geometry.ts`: `artOf(P)` con base sobre patas y las piezas. Devuelve trazos y sólidos, no JSX.
5. `<Figura>Figure.tsx` (`'use client'`): `useOrbit(CENTRE, calm)`, `useZoom()`, `projectionFor` → `artOf` → nodos, capas + `ordered`, bucle con demostración condicionada por `playing`, `<Plate lead={<CornerControls … />}>`, controles debajo.
6. Registra el id en `ArticleFigure.tsx` (`FigureCopy`, `figureIdOf`, render) y en `copy.ts`.
7. Añade los textos a `messages/es.json` y `messages/en.json` (`Figures.<id>`: `fig`, `title`, `hint`, `keys`, `caption`, `idle`, `aria`, `controls`, `reset`, `play`, `pause`, `zoomIn`, `zoomOut` y los propios).
8. Úsala en el Markdown con `figure:<id>`.

## Verificación

- `pnpm check` (lint, tipos, tests, build).
- Líneas que terminan sobre algo: `node .claude/skills/anatomy/scripts/lines.mjs <url> --select ".iso-plate:has(…)"` debe dar `line ends: 0`.
- Capturas y arrastres con `capture.mjs` y `drive.mjs` de la misma skill (necesitan Chrome; en esta máquina sirve el de Playwright con `CHROME_PATH`). Mira siempre: reposo, a mitad de movimiento, estado final, los extremos del giro en ambos ejes, zoom máximo y mínimo, tema claro y oscuro, y 390 px de ancho.
- Antes de dar por buena una figura, comprueba a mano: la demostración arranca sola, la pausa la detiene sin impedir las acciones manuales, y restablecer deja giro y zoom en el centro.

## Limitaciones conocidas

- El orden de pintado por cajas es exacto para cuerpos convexos separables; los casos cíclicos (el hilo, la tabla sobre los apoyos) se resuelven con `after`/`ignore` y recortes.
- Al girar, la escena se reescala en cada vista para llenar la tarjeta.
- Las figuras no usan WebGL ni el modo 3D de la skill.
