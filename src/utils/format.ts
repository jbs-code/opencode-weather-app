import type { CurrentWeather, DailyForecast } from "../types/Weather.ts";
import type { Colors } from "../types/Colors.ts";
import type { TemperatureUnit } from "../types/Settings.ts";

interface Column {
  header: string;
  values: string[];
  align: "left" | "right";
  paint: (colors: Colors, text: string) => string;
}

export function formatWeather(colors: Colors, weather: CurrentWeather, symbol: string): string {
  return `${weather.description}, ${colors.yellow(weather.temperature.toFixed(1) + symbol)}`;
}

export function unitSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function formatForecast(colors: Colors, days: DailyForecast[], symbol: string): string {
  const columns: Column[] = [
    {
      header: "Fecha",
      values: days.map((day) => formatDayLabel(day.date)),
      align: "left",
      paint: (c, text) => c.bold(text),
    },
    {
      header: "Clima",
      values: days.map((day) => day.description),
      align: "left",
      paint: (_c, text) => text,
    },
    {
      header: "Máx",
      values: days.map((day) => formatTemperature(day.temperatureMax, symbol)),
      align: "right",
      paint: (c, text) => c.yellow(text),
    },
    {
      header: "Mín",
      values: days.map((day) => formatTemperature(day.temperatureMin, symbol)),
      align: "right",
      paint: (c, text) => c.cyan(text),
    },
    {
      header: "Lluvia",
      values: days.map((day) => formatPrecipitation(day.precipitationProbability)),
      align: "right",
      paint: (c, text) => c.dim(text),
    },
  ];

  const widths = columns.map((column) =>
    Math.max(column.header.length, ...column.values.map((value) => value.length))
  );

  const headerLine = columns
    .map((column, index) => colors.bold(colors.cyan(pad(column.header, widths[index]!, column.align))))
    .join("  ");
  const bodyLines = days.map((_, row) =>
    columns
      .map((column, index) => column.paint(colors, pad(column.values[row]!, widths[index]!, column.align)))
      .join("  ")
  );

  return [headerLine, ...bodyLines].join("\n");
}

function pad(text: string, width: number, align: "left" | "right"): string {
  const filler = " ".repeat(Math.max(0, width - text.length));
  return align === "right" ? `${filler}${text}` : `${text}${filler}`;
}

function formatDayLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" })
    .formatToParts(parsed)
    .filter((part) => part.type === "weekday" || part.type === "day" || part.type === "month")
    .map((part) => part.value)
    .join(" ");
}

function formatTemperature(value: number | null, symbol: string): string {
  return value === null ? "-" : `${value.toFixed(1)}${symbol}`;
}

function formatPrecipitation(value: number | null): string {
  return value === null ? "-" : `${value}%`;
}
