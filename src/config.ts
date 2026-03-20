import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { ENVIRONMENT_URLS, type OpdtConfig, type OpdtEnvironment } from "./types/index.js";

const LEGACY_CONFIG_DIR = join(homedir(), ".opdt");
const LEGACY_CONFIG_FILE = join(LEGACY_CONFIG_DIR, "config.json");
const CONFIG_DIR = join(homedir(), ".opendate");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG: OpdtConfig = {
  environment: "production",
  baseUrl: ENVIRONMENT_URLS.production,
};

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function migrateLegacyConfig(): void {
  if (existsSync(CONFIG_FILE) || !existsSync(LEGACY_CONFIG_FILE)) {
    return;
  }

  ensureConfigDir();
  copyFileSync(LEGACY_CONFIG_FILE, CONFIG_FILE);
}

export function resolveBaseUrl(config: OpdtConfig): string {
  return ENVIRONMENT_URLS[config.environment] ?? config.baseUrl;
}

export function loadConfig(): OpdtConfig {
  migrateLegacyConfig();

  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<OpdtConfig>): void {
  migrateLegacyConfig();
  ensureConfigDir();
  const current = loadConfig();
  const merged = { ...current, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n");
}

export function clearConfig(): void {
  migrateLegacyConfig();

  if (existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");
  }
}

export function getConfigPath(): string {
  migrateLegacyConfig();
  return CONFIG_FILE;
}
