# 02-weather — Weather CLI (Bun)

App de consola para consultar el clima (OpenMeteo). Punto de entrada: `src/index.ts` (`"module": "src/index.ts"` en `package.json`). Tests con `bun:test` en `tests/`. Sin lint, sin CI.

## Estructura

Capas en `src/`: `types` → `utils` → `api` → `storage` → `presentation` → `actions` → `index.ts` (composition root).

- `types/` — contratos globales (`City`, `Weather`, `Settings`, `AppState`, `MenuOption`, `Colors`, `Readline`)
- `utils/` — helpers sin estado (`format`, `colors`, `constants`, `weatherCodes`, `cities`)
- `api/` — clientes HTTP (geocoding, weather)
- `storage/` — persistencia en `~/.weather-cli` (`cities.json`, `settings.json`) y migración del antiguo `state.json`
- `presentation/` — consola (`menu`, `input`, `output`)
- `actions/` — acciones del menú (una por archivo)

## Tests

`tests/` replica la estructura de `src/` (mismo nombre de archivo + `.test.ts`) más `tests/helpers/` (fixtures, captura de consola, sandbox de disco, mock de `fetch`) y `tests/index.test.ts` (E2E de la app como subproceso).

- `bun test` — suite completa
- `bun test --watch` — modo watch
- `bun test --coverage` — cobertura (los `src/` quedan al 100% de líneas)
- Aislamiento: `spyOn(namespace, "fn")` + `mockRestore()`. No usar `mock.module()`, porque Bun comparte el registro de módulos entre archivos de test y el mock se filtra.
- `storage` se aísla con la variable `WEATHER_HOME` (apuntando a un temporal) en lugar de tocar el home real.
- `fetch` se intercepta con `spyOn(globalThis, "fetch")`; la app nunca sale a la red en los tests.

## Comandos

- `bun install` — instalar dependencias (lockfile: `bun.lock`)
- `bun src/index.ts` — ejecutar la app (ESM, `"type": "module"`)
- `bun tsc --noEmit` — typecheck (`tsconfig.json`: `strict`, `noEmit`; `typescript` es `peerDependency` pero está en `node_modules`)
- `bun build src/index.ts --compile` — generar binario ejecutable (objetivo del proyecto; salida: `./index`)
- `bun run build` — ejecuta los tests y solo después compila: si algún test falla no se genera el binario.

## Notas

- Importar archivos locales con extensión `.ts` (`verbatimModuleSyntax`, `allowImportingTsExtensions`).
- `tsconfig.json`: `module: Preserve`, `moduleResolution: bundler`, `moduleDetection: force`, `noUncheckedIndexedAccess`.
- `.env` y derivados están ignorados (`.gitignore`); no hay variables de entorno requeridas por el código actual.
- Salida de build: `dist`, `out`, `*.tgz` ignorados; no commitear artefactos.
