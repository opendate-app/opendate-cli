export type OpdtEnvironment = "production" | "test";

export const ENVIRONMENT_URLS: Record<OpdtEnvironment, string> = {
  production: "https://app.opendate.io",
  test: "http://opendate.test",
};

export interface OpdtConfig {
  environment: OpdtEnvironment;
  baseUrl: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  defaultOutputFormat?: "table" | "json";
}

export interface PaginatedResponse<T> {
  current_page: number;
  per_page: number;
  total_entries: number;
  total_pages: number;
  collection: T[];
}

export interface GlobalOptions {
  json?: boolean;
  verbose?: boolean;
  baseUrl?: string;
  dryRun?: boolean;
}

export interface PaginationOptions {
  page?: string;
  perPage?: string;
}

export interface MutationOptions {
  data?: string;
  dataFile?: string;
  dryRun?: boolean;
}
