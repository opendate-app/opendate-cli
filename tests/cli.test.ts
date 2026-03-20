import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

let mockedHomeDir: string | null = null;
const tempDirs: string[] = [];

vi.mock("node:os", async () => {
  const actual = await vi.importActual<typeof import("node:os")>("node:os");

  return {
    ...actual,
    homedir: () => mockedHomeDir ?? actual.homedir(),
  };
});

afterEach(() => {
  mockedHomeDir = null;
  vi.resetModules();

  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop()!, { force: true, recursive: true });
  }
});

describe("createProgram", () => {
  it("uses opendate as the CLI name", async () => {
    const { createProgram } = await import("../src/index.js");

    expect(createProgram().name()).toBe("opendate");
  });
});

describe("config migration", () => {
  it("copies legacy ~/.opdt config to ~/.opendate on first load", async () => {
    const tempHomeDir = mkdtempSync(join(tmpdir(), "opendate-cli-"));
    tempDirs.push(tempHomeDir);
    mockedHomeDir = tempHomeDir;

    const legacyConfigDir = join(tempHomeDir, ".opdt");
    const legacyConfigPath = join(legacyConfigDir, "config.json");
    const newConfigPath = join(tempHomeDir, ".opendate", "config.json");

    mkdirSync(legacyConfigDir, { recursive: true });
    writeFileSync(
      legacyConfigPath,
      JSON.stringify(
        {
          environment: "test",
          accessToken: "legacy-access-token",
          refreshToken: "legacy-refresh-token",
        },
        null,
        2,
      ) + "\n",
    );

    const { getConfigPath, loadConfig } = await import("../src/config.js");
    const config = loadConfig();

    expect(config.environment).toBe("test");
    expect(config.accessToken).toBe("legacy-access-token");
    expect(config.refreshToken).toBe("legacy-refresh-token");
    expect(getConfigPath()).toBe(newConfigPath);
    expect(existsSync(newConfigPath)).toBe(true);
    expect(existsSync(legacyConfigPath)).toBe(true);
    expect(JSON.parse(readFileSync(newConfigPath, "utf-8"))).toMatchObject({
      environment: "test",
      accessToken: "legacy-access-token",
      refreshToken: "legacy-refresh-token",
    });
  });
});
