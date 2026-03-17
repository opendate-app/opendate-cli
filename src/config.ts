import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { ENVIRONMENT_URLS, type OpdtConfig, type OpdtEnvironment } from "./types/index.js";

const CONFIG_DIR = join(homedir(), ".opdt");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG: OpdtConfig = {
  environment: "production",
  baseUrl: ENVIRONMENT_URLS.production,
};

export function resolveBaseUrl(config: OpdtConfig): string {
  return ENVIRONMENT_URLS[config.environment] ?? config.baseUrl;
}

export function loadConfig(): OpdtConfig {
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<OpdtConfig>): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  const current = loadConfig();
  const merged = { ...current, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n");
}

export function clearConfig(): void {
  if (existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");
  }
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
