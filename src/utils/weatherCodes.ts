const WEATHER_CODES: Record<number, string> = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla escarchada",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve intensa",
  77: "Granos de nieve",
  80: "Aguaceros ligeros",
  81: "Aguaceros moderados",
  82: "Aguaceros intensos",
  85: "Nevadas ligeras",
  86: "Nevadas intensas",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo intenso",
};

export function describeWeatherCode(code: number | null | undefined): string {
  return WEATHER_CODES[code ?? 0] ?? "Desconocido";
}
