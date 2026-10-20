export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export type CitySelection =
  | { kind: "selected"; city: City }
  | { kind: "invalid" }
  | { kind: "cancelled" };
