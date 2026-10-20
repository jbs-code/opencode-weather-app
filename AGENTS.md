# 02-weather — Weather CLI (Bun)

App de consola para consultar el clima (OpenMeteo). Punto de entrada: `index.ts` (`"module": "index.ts"` en `package.json`). Sin tests, sin lint, sin CI.

## Comandos

- `bun install` — instalar dependencias (lockfile: `bun.lock`)
- `bun index.ts` — ejecutar la app (ESM, `"type": "module"`)
- `bun tsc --noEmit` — typecheck (`tsconfig.json`: `strict`, `noEmit`; `typescript` es `peerDependency` pero está en `node_modules`)
- `bun build index.ts --compile` — generar binario ejecutable (objetivo del proyecto; salida: `./index`)

## Notas

- Importar archivos locales con extensión `.ts` (`verbatimModuleSyntax`, `allowImportingTsExtensions`).
- `tsconfig.json`: `module: Preserve`, `moduleResolution: bundler`, `moduleDetection: force`, `noUncheckedIndexedAccess`.
- `.env` y derivados están ignorados (`.gitignore`); no hay variables de entorno requeridas por el código actual.
- Salida de build: `dist`, `out`, `*.tgz` ignorados; no commitear artefactos.
