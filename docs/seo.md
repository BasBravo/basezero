# SEO y acceso para agentes de IA

Cómo está montado el posicionamiento de basezero.dev y qué hay que mantener al publicar. El código vive en `features/seo/`.

## Qué genera el build

| URL | Para qué | Fuente |
| --- | --- | --- |
| `/sitemap.xml` | Todas las páginas indexables, con hreflang y fecha | `app/sitemap.ts` |
| `/robots.txt` | Permite todo, con los rastreadores de IA listados de forma explícita | `public/robots.txt` |
| `/llms.txt` | Resumen del estudio para agentes: servicios, contacto, páginas, artículos y proyectos ([llmstxt.org](https://llmstxt.org)) | `features/seo/lib/agents.ts` |
| `/llms-full.txt` | Todos los artículos completos en Markdown, en un solo fichero | `features/seo/lib/agents.ts` |
| `/es/articulos/md/<slug>.md` | Cada artículo en Markdown limpio; las figuras se describen con su texto alternativo | `app/[locale]/articulos/md/[file]/route.ts` |
| `/feed.xml` | RSS de los artículos en español | `features/seo/lib/agents.ts` |
| `/og/<locale>/<nombre>.png` | Imagen social 1200×630 de la home y de cada artículo | `app/og/[locale]/[file]/route.tsx` |

Los `.md` llevan `X-Robots-Tag: noindex` (en `firebase.json`) para que Google no los trate como contenido duplicado; los agentes los leen igual.

## En cada página

- `<html lang>` correcto desde el servidor (`es-ES` o `en`): `app/[locale]/layout.tsx` es el layout raíz.
- Título, descripción, canónica, hreflang (`es-ES`, `en`, `x-default`), Open Graph y tarjeta grande de X, con `pageMetadata()` de `features/seo/lib/metadata.ts`.
- Datos estructurados enlazados por `@id`: `Organization` + `ProfessionalService` (con el catálogo de servicios), `WebSite` y `Person` en todas las páginas; `BlogPosting` + `BreadcrumbList` en los artículos; `ProfilePage` en «Sobre mí».
- Los artículos enlazan su versión Markdown con `<link rel="alternate" type="text/markdown">` y el feed con `application/rss+xml`.

## Al publicar un artículo

1. Frontmatter obligatorio: `title`, `description` (140–160 caracteres, con la idea y la búsqueda que responde), `date`, `author`, `locale`, `category`.
2. Opcionales: `keywords` (3–5 búsquedas reales que el artículo responde) y `updated` (fecha de una revisión de fondo).
3. Texto alternativo descriptivo en cada figura: es lo que leen los agentes en la versión Markdown.
4. Enlaza al menos un artículo anterior relacionado.
5. Todo lo demás (sitemap, feed, llms, imagen social, datos estructurados) se genera solo.

## Tras desplegar

- Google Search Console y Bing Webmaster Tools: dar de alta `basezero.dev` y enviar `https://basezero.dev/sitemap.xml` (una sola vez).
- Comprobar una URL nueva con la inspección de URL de Search Console y con la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results).
