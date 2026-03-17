import { createRequire } from "node:module";

// inquirer is CJS-compatible via createRequire
const require = createRequire(import.meta.url);
const inquirer = require("inquirer");

export async function promptCredentials(): Promise<{
  email: string;
  password: string;
}> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
      validate: (input: string) =>
        input.includes("@") ? true : "Please enter a valid email",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      mask: "*",
      validate: (input: string) =>
        input.length > 0 ? true : "Password is required",
    },
  ]);
  return answers;
}

export async function promptConfirm(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: false,
    },
  ]);
  return confirmed;
}
