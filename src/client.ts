import axios, { type AxiosInstance, type AxiosError } from "axios";
import { loadConfig, saveConfig, clearConfig, resolveBaseUrl } from "./config.js";
import type { OpdtConfig } from "./types/index.js";

let clientInstance: ApiClient | null = null;

export class ApiClient {
  private axios: AxiosInstance;
  private config: OpdtConfig;

  constructor(config: OpdtConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: resolveBaseUrl(config),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (config.accessToken) {
      this.axios.defaults.headers.common["Authorization"] =
        `Bearer ${config.accessToken}`;
    }

    this.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (
          error.response?.status === 401 &&
          config.refreshToken &&
          !error.config?.url?.includes("/oauth/")
        ) {
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            error.config.headers["Authorization"] =
              `Bearer ${this.config.accessToken}`;
            return this.axios.request(error.config);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", this.config.refreshToken!);
      if (this.config.clientId) params.append("client_id", this.config.clientId);
      if (this.config.clientSecret) params.append("client_secret", this.config.clientSecret);
      const response = await this.axios.post("/oauth/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      this.config.accessToken = access_token;
      this.config.refreshToken = refresh_token;
      this.config.tokenExpiresAt = Date.now() + expires_in * 1000;

      this.axios.defaults.headers.common["Authorization"] =
        `Bearer ${access_token}`;

      saveConfig({
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: this.config.tokenExpiresAt,
      });

      return true;
    } catch {
      clearConfig();
      return false;
    }
  }

  async get<T = any>(
    path: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.axios.get<T>(path, { params });
    return response.data;
  }

  async post<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.axios.post<T>(path, data);
    return response.data;
  }

  async postForm<T = any>(path: string, data: Record<string, string>): Promise<T> {
    const params = new URLSearchParams(data);
    const response = await this.axios.post<T>(path, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  }

  async put<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.axios.put<T>(path, data);
    return response.data;
  }

  async patch<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.axios.patch<T>(path, data);
    return response.data;
  }

  async delete<T = any>(path: string): Promise<T> {
    const response = await this.axios.delete<T>(path);
    return response.data;
  }

  async getBinary(path: string, params?: Record<string, any>): Promise<Buffer> {
    const response = await this.axios.get(path, {
      params,
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  }

  setHeader(key: string, value: string): void {
    this.axios.defaults.headers.common[key] = value;
  }
}

export function createClient(baseUrlOverride?: string): ApiClient {
  if (clientInstance && !baseUrlOverride) return clientInstance;

  const config = loadConfig();
  if (baseUrlOverride) {
    config.baseUrl = baseUrlOverride;
  }
  clientInstance = new ApiClient(config);
  return clientInstance;
}

export function createUnauthenticatedClient(baseUrlOverride?: string): ApiClient {
  const config = loadConfig();
  if (baseUrlOverride) {
    config.baseUrl = baseUrlOverride;
  }
  config.accessToken = undefined;
  config.refreshToken = undefined;
  return new ApiClient(config);
}
