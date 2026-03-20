import inquirer from "inquirer";

export async function promptCredentials(): Promise<{
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
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
    {
      type: "input",
      name: "clientId",
      message: "Client ID:",
      validate: (input: string) =>
        input.length > 0 ? true : "Client ID is required",
    },
    {
      type: "password",
      name: "clientSecret",
      message: "Client Secret:",
      mask: "*",
      validate: (input: string) =>
        input.length > 0 ? true : "Client Secret is required",
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
