import type { Command } from "commander";
import chalk from "chalk";
import {
  RESOURCES,
  RANSACK_PREDICATES,
  findResource,
  type ResourceDef,
} from "../resource-registry.js";

export function registerDocsCommands(program: Command): void {
  program
    .command("docs [resource]")
    .description(
      "Show filterable fields and query reference (e.g. opdt docs tickets)",
    )
    .option("--predicates", "Show Ransack predicate reference only")
    .option("--list", "List all available resources")
    .action((resource: string | undefined, opts: any) => {
      if (opts.list) {
        printResourceList();
        return;
      }

      if (opts.predicates) {
        printPredicates();
        return;
      }

      if (resource) {
        const res = findResource(resource);
        if (!res) {
          console.error(
            chalk.red(`Unknown resource: "${resource}". Run "opdt docs --list" to see available resources.`),
          );
          process.exit(1);
        }
        printResourceDocs(res);
      } else {
        printFullDocs();
      }
    });
}

function printResourceList(): void {
  console.log(chalk.bold("Available resources:\n"));
  for (const r of RESOURCES) {
    console.log(`  ${chalk.cyan(r.name.padEnd(22))} ${r.command}`);
  }
  console.log(
    `\nRun ${chalk.cyan("opdt docs <resource>")} for field details.`,
  );
  console.log(
    `Run ${chalk.cyan("opdt docs --predicates")} for Ransack predicate reference.`,
  );
}

function printPredicates(): void {
  console.log(chalk.bold("Ransack Predicate Reference\n"));
  console.log(
    "Combine any field name with a predicate suffix to build a filter.",
  );
  console.log(
    `Example: field ${chalk.cyan("title")} + predicate ${chalk.cyan("_cont")} = ${chalk.green('--filter "title_cont=jazz"')}\n`,
  );

  const maxSuffix = Math.max(...RANSACK_PREDICATES.map((p) => p.suffix.length));
  const maxDesc = Math.max(
    ...RANSACK_PREDICATES.map((p) => p.description.length),
  );

  for (const p of RANSACK_PREDICATES) {
    console.log(
      `  ${chalk.cyan(p.suffix.padEnd(maxSuffix + 2))} ${p.description.padEnd(maxDesc + 2)} ${chalk.dim(`--filter "${p.example}"`)}`,
    );
  }
}

function printResourceDocs(r: ResourceDef): void {
  console.log(chalk.bold(`${r.name}`) + chalk.dim(` — ${r.description}`));
  console.log(chalk.dim(`Command: ${r.command}\n`));

  // Fields
  if (r.fields.length > 0) {
    console.log(chalk.bold("Filterable fields:"));
    const maxName = Math.max(...r.fields.map((f) => f.name.length));
    const maxType = Math.max(...r.fields.map((f) => f.type.length));
    for (const f of r.fields) {
      console.log(
        `  ${chalk.cyan(f.name.padEnd(maxName + 2))} ${chalk.dim(f.type.padEnd(maxType + 2))} ${f.description}`,
      );
    }
    console.log();
  }

  // Scopes
  if (r.scopes.length > 0) {
    console.log(chalk.bold("Available scopes:"));
    const maxScope = Math.max(...r.scopes.map((s) => s.name.length));
    for (const s of r.scopes) {
      console.log(
        `  ${chalk.cyan(s.name.padEnd(maxScope + 2))} ${s.description}`,
      );
    }
    console.log();
  }

  // Usage hints
  console.log(chalk.bold("Filter examples:"));
  if (r.fields.length > 0) {
    const strField = r.fields.find((f) => f.type === "string");
    const dtField = r.fields.find((f) => f.type === "datetime");
    const boolField = r.fields.find((f) => f.type === "boolean");

    if (strField) {
      console.log(
        `  ${chalk.green(`${r.command} --filter "${strField.name}_cont=value"`)}`,
      );
    }
    if (dtField) {
      console.log(
        `  ${chalk.green(`${r.command} --filter "${dtField.name}_gteq=2024-01-01"`)}`,
      );
    }
    if (boolField) {
      console.log(
        `  ${chalk.green(`${r.command} --filter "${boolField.name}_true=1"`)}`,
      );
    }
    console.log(
      `  ${chalk.green(`${r.command} --sort "created_at desc"`)}`,
    );
  }
  if (r.scopes.length > 0) {
    console.log(
      `  ${chalk.green(`${r.command} --filter "${r.scopes[0].name}=1"`)}`,
    );
  }
}

function printFullDocs(): void {
  console.log(chalk.bold("opdt — Opendate CLI Filter Reference\n"));
  console.log(
    "All list commands support --filter, --query, and --sort for flexible querying.\n",
  );
  console.log(
    `Use ${chalk.cyan("--filter <field_predicate=value>")} to filter by any field.`,
  );
  console.log(
    `Use ${chalk.cyan('--query \'{"field_predicate":"value"}\'')} for complex filters.`,
  );
  console.log(
    `Use ${chalk.cyan('--sort "field_name asc|desc"')} to sort results.\n`,
  );

  printPredicates();
  console.log();

  for (const r of RESOURCES) {
    console.log(chalk.bold(`\n${"=".repeat(60)}`));
    printResourceDocs(r);
  }
}
