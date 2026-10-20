# Revisión Weather CLI

- [x] **Refactorizar:** el archivo index.ts es muy grande es necesario separar el código en diferentes achivos.
- [x] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [x] **Binario:** La persistencia debe ser de manera global, es decir, no importa si muevo el binario de lugar, la aplicación debe de seguir funcionando y mantener la información.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [x] **7 day forecast** agregar la posibilidad de obtener el pronóstico para los próximos 7 días.
- [x] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades? → refactor por capas en `src/` (types, utils, api, storage, presentation, actions), una acción por archivo.
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?
