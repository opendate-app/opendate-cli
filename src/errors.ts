import axios from "axios";
import chalk from "chalk";

export function withErrorHandling(
  fn: (...args: any[]) => Promise<void>,
): (...args: any[]) => Promise<void> {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data;

        if (status === 401) {
          console.error(
            chalk.red(
              "Authentication failed. Run `opdt login` to authenticate.",
            ),
          );
        } else if (status === 404) {
          console.error(chalk.red("Resource not found."));
        } else if (status === 422) {
          console.error(chalk.red("Validation error:"));
          if (body?.errors) {
            for (const [field, messages] of Object.entries(body.errors)) {
              const msgs = Array.isArray(messages)
                ? messages.join(", ")
                : String(messages);
              console.error(chalk.red(`  ${field}: ${msgs}`));
            }
          } else {
            console.error(chalk.red(JSON.stringify(body, null, 2)));
          }
        } else {
          console.error(
            chalk.red(
              `API Error (${status}): ${body?.error || body?.message || err.message}`,
            ),
          );
        }
      } else {
        console.error(chalk.red(`Error: ${(err as Error).message}`));
      }
      process.exit(1);
    }
  };
}
