import type { Command } from "commander";
import { createClient, createUnauthenticatedClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerUsersCommands(program: Command): void {
  const users = program.command("users").description("Manage users");

  users
    .command("current")
    .description("Get current authenticated user")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get("/api/v2/users/current");
        output(data, globalOpts);
      }),
    );

  // Alias at top level
  program
    .command("whoami")
    .description("Get current authenticated user (alias for users current)")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get("/api/v2/users/current");
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    users.command("create").description("Create a new user"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/users", data);
        return;
      }
      const client = createUnauthenticatedClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/users", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    users.command("register").description("Register a new user"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/users/register", data);
        return;
      }
      const client = createUnauthenticatedClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/users/register", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    users
      .command("update <id>")
      .description("Update a user"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/users/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/users/${id}`, data);
      output(result, globalOpts);
    }),
  );

  users
    .command("delete <id>")
    .description("Delete a user")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/users/${id}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/users/${id}`);
        output(result, globalOpts);
      }),
    );

  users
    .command("reset-password")
    .description("Send a password reset email")
    .requiredOption("--email <email>", "Email address")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createUnauthenticatedClient(globalOpts.baseUrl);
        const result = await client.post("/api/v2/users/reset_password", {
          email: opts.email,
        });
        output(result, globalOpts);
      }),
    );

  users
    .command("resend-confirmation")
    .description("Resend confirmation email")
    .requiredOption("--email <email>", "Email address")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createUnauthenticatedClient(globalOpts.baseUrl);
        const result = await client.post(
          "/api/v2/users/resend_confirmation_email",
          { email: opts.email },
        );
        output(result, globalOpts);
      }),
    );
}
