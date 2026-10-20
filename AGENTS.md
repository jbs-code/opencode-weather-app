# 02-weather — Weather CLI (Bun)

App de consola para consultar el clima (OpenMeteo). Punto de entrada: `src/index.ts` (`"module": "src/index.ts"` en `package.json`). Sin tests, sin lint, sin CI.

## Estructura

Capas en `src/`: `types` → `utils` → `api` → `storage` → `presentation` → `actions` → `index.ts` (composition root).

- `types/` — contratos globales (`City`, `Weather`, `Settings`, `AppState`, `MenuOption`, `Colors`, `Readline`)
- `utils/` — helpers sin estado (`format`, `colors`, `constants`, `weatherCodes`, `cities`)
- `api/` — clientes HTTP (geocoding, weather)
- `storage/` — persistencia en `~/.weather-cli` (`cities.json`, `settings.json`) y migración del antiguo `state.json`
- `presentation/` — consola (`menu`, `input`, `output`)
- `actions/` — acciones del menú (una por archivo)

## Comandos

- `bun install` — instalar dependencias (lockfile: `bun.lock`)
- `bun src/index.ts` — ejecutar la app (ESM, `"type": "module"`)
- `bun tsc --noEmit` — typecheck (`tsconfig.json`: `strict`, `noEmit`; `typescript` es `peerDependency` pero está en `node_modules`)
- `bun build src/index.ts --compile` — generar binario ejecutable (objetivo del proyecto; salida: `./index`)

## Notas

- Importar archivos locales con extensión `.ts` (`verbatimModuleSyntax`, `allowImportingTsExtensions`).
- `tsconfig.json`: `module: Preserve`, `moduleResolution: bundler`, `moduleDetection: force`, `noUncheckedIndexedAccess`.
- `.env` y derivados están ignorados (`.gitignore`); no hay variables de entorno requeridas por el código actual.
- Salida de build: `dist`, `out`, `*.tgz` ignorados; no commitear artefactos.
