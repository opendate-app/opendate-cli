import Table from "cli-table3";
import chalk from "chalk";
import type { PaginatedResponse } from "./types/index.js";

export function isJsonMode(opts: any): boolean {
  const root = opts?._rootOptions ?? opts?.parent?.opts?.() ?? {};
  return opts?.json || root.json || false;
}

export function output(data: any, opts: any): void {
  if (isJsonMode(opts)) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (isPaginated(data)) {
    renderPaginatedTable(data);
    return;
  }

  if (Array.isArray(data)) {
    renderTable(data);
  } else if (typeof data === "object" && data !== null) {
    renderObject(data);
  } else {
    console.log(data);
  }
}

function isPaginated(data: any): data is PaginatedResponse<any> {
  return (
    data &&
    typeof data === "object" &&
    "collection" in data &&
    "total_entries" in data
  );
}

function renderPaginatedTable(data: PaginatedResponse<any>): void {
  if (data.collection.length === 0) {
    console.log(chalk.yellow("No results found."));
    return;
  }

  renderTable(data.collection);
  console.log(
    chalk.dim(
      `\nPage ${data.current_page} of ${data.total_pages} (${data.total_entries} total)`,
    ),
  );
}

function renderTable(items: any[]): void {
  if (items.length === 0) {
    console.log(chalk.yellow("No results found."));
    return;
  }

  const keys = Object.keys(items[0]).slice(0, 8);

  const table = new Table({
    head: keys.map((k) => chalk.cyan(k)),
    style: { head: [], border: [] },
  });

  for (const item of items) {
    table.push(keys.map((k) => truncate(String(item[k] ?? ""), 40)));
  }

  console.log(table.toString());
}

function renderObject(obj: any): void {
  const table = new Table({
    style: { head: [], border: [] },
  });

  for (const [key, value] of Object.entries(obj)) {
    const display =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value ?? "");
    table.push({ [chalk.cyan(key)]: truncate(display, 80) });
  }

  console.log(table.toString());
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "\u2026" : str;
}
