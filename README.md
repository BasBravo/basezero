# @basezero/web

Nuevo frontend de Basezero. Convive con `../front` durante la migración; el proyecto Nuxt anterior no se modifica.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui source-owned, Base UI, next-intl, Firebase, Zustand y Vitest.

## Arranque

```bash
pnpm install
pnpm migrate:env
pnpm dev
```

La aplicación se sirve en `http://localhost:3000` y redirige al locale detectado (`/es` o `/en`).

`pnpm migrate:env` transforma los entornos locales de `../front/.env.dev` y `../front/.env.prod` en los nombres de Next.js. Los ficheros resultantes son locales, tienen permisos restringidos y están ignorados por Git. Para una instalación nueva también se puede partir de `.env.example`.

## Scripts

| Script | Uso |
| --- | --- |
| `pnpm dev` | Desarrollo local |
| `pnpm build` | Build de producción |
| `pnpm lint` | Reglas de Next.js y React |
| `pnpm typecheck` | TypeScript estricto |
| `pnpm test` | Pruebas unitarias |
| `pnpm check` | Validación completa |
| `pnpm migrate:env` | Migrar los entornos del frontend Nuxt |

## Estructura

```text
app/                  Rutas, layouts y estilos globales
components/ui/        Primitives source-owned de shadcn/Base UI
content/              Contenido estático tipado
features/[domain]/    Componentes, hooks, stores y services de producto
i18n/ + messages/     Routing y textos es/en
lib/                  Firebase y utilidades transversales
public/               Recursos conservados del sitio anterior
```

La portada actual es deliberadamente mínima: confirma que el scaffold, los locales y los recursos de marca funcionan sin anticipar el nuevo diseño.
