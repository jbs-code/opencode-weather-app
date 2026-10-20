import * as os from "node:os";
import * as path from "node:path";
import {
  CITIES_FILE_NAME,
  LEGACY_STATE_FILE_NAME,
  SETTINGS_FILE_NAME,
  STATE_DIR_NAME,
} from "../utils/constants.ts";

export function getStateDir(): string {
  const override = process.env["WEATHER_HOME"];
  return override ?? path.join(os.homedir(), STATE_DIR_NAME);
}

export function getCitiesPath(): string {
  return path.join(getStateDir(), CITIES_FILE_NAME);
}

export function getSettingsPath(): string {
  return path.join(getStateDir(), SETTINGS_FILE_NAME);
}

export function getLegacyStatePath(): string {
  return path.join(getStateDir(), LEGACY_STATE_FILE_NAME);
}
