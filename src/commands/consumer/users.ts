import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../../mutation.js";
import { resolveVenueOwnershipId, consumerBasePath, addVenueOption } from "../../consumer.js";

export function registerConsumerUsersCommands(consumer: Command): void {
  const users = consumer
    .command("users")
    .description("Manage consumer users");

  addVenueOption(
    users
      .command("current")
      .description("Get current authenticated user"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/users/current`);
      output(data, globalOpts);
    }),
  );

  addMutationOptions(
    addVenueOption(
      users.command("create").description("Create a new user"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `${base}/users`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/users`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    addVenueOption(
      users.command("register").description("Register a new user"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `${base}/users/register`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/users/register`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    addVenueOption(
      users.command("update <id>").description("Update a user"),
    ),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `${base}/users/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`${base}/users/${id}`, data);
      output(result, globalOpts);
    }),
  );

  addVenueOption(
    users
      .command("delete <id>")
      .description("Delete a user")
      .option("--dry-run", "Preview the request without executing"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      if (globalOpts.dryRun) {
        handleDryRun("DELETE", `${base}/users/${id}`);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.delete(`${base}/users/${id}`);
      output(result, globalOpts);
    }),
  );

  addVenueOption(
    users
      .command("reset-password")
      .description("Send a password reset email")
      .requiredOption("--email <email>", "Email address"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/users/reset_password`, {
        user: { email: opts.email },
      });
      output(result, globalOpts);
    }),
  );

  addVenueOption(
    users
      .command("resend-confirmation")
      .description("Resend confirmation email")
      .requiredOption("--email <email>", "Email address"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/users/resend_confirmation_email`, {
        user: { email: opts.email },
      });
      output(result, globalOpts);
    }),
  );
}
