## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.
- Consultar el pronóstico de los próximos 7 días de cualquier ciudad registrada.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto
```

## Inicializar proyecto

```bash
bun init
```

### Ejemplo del menú
Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```

### Ejemplo del pronóstico (opción 6)

```bash
Ciudades registradas:
  1. Ottawa (default)
  2. Ciudad de México
  Número de ciudad (Enter para la default): 1

Pronóstico para Ottawa (7 días)

Fecha       Clima                    Máx    Mín  Lluvia
lun 19 oct  Cielo despejado       17.7°C  2.7°C      0%
mar 20 oct  Nublado               12.8°C  3.8°C      0%
mié 21 oct  Nublado               12.2°C  0.1°C      0%
jue 22 oct  Nublado               15.0°C  5.1°C      0%
vie 23 oct  Nublado               10.5°C  2.5°C      0%
sáb 24 oct  Mayormente despejado  11.7°C  1.4°C      0%
dom 25 oct  Nublado               15.9°C  3.7°C      2%
```
