export interface CurrentWeather {
  temperature: number;
  description: string;
}

export interface DailyForecast {
  date: string;
  description: string;
  temperatureMax: number | null;
  temperatureMin: number | null;
  precipitationProbability: number | null;
}

export interface WeatherApiResponse {
  current?: {
    temperature_2m: number;
    weather_code?: number;
  };
}

export interface ForecastApiResponse {
  daily?: {
    time?: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
}
