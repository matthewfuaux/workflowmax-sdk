import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { WFMClientConfig, WFMResponse, WFMListResponse } from "./types";

export const DEFAULT_BASE_URL = "https://api.workflowmax.com";

export class HttpClient {
  private http: AxiosInstance;
  readonly accountId: string;

  constructor(config: WFMClientConfig) {
    this.accountId = config.accountId;

    this.http = axios.create({
      baseURL: config.baseUrl ?? DEFAULT_BASE_URL,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "account-id": config.accountId,
      },
    });
  }

  async get<T>(
    path: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<WFMResponse<T>> {
    const response = await this.http.get<T>(path, { ...config, params });
    return { data: response.data, status: response.status };
  }

  async getList<T>(
    path: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<WFMListResponse<T>> {
    const response = await this.http.get<{ data: T[]; total: number }>(path, {
      ...config,
      params,
    });
    const body = response.data as unknown;
    if (body && typeof body === "object" && "data" in body) {
      return {
        data: (body as { data: T[]; total: number }).data,
        total: (body as { data: T[]; total: number }).total ?? 0,
      };
    }
    return { data: body as T[], total: 0 };
  }

  async post<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<WFMResponse<T>> {
    const response = await this.http.post<T>(path, body, config);
    return { data: response.data, status: response.status };
  }

  async put<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<WFMResponse<T>> {
    const response = await this.http.put<T>(path, body, config);
    return { data: response.data, status: response.status };
  }

  async delete<T = void>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<WFMResponse<T>> {
    const response = await this.http.delete<T>(path, config);
    return { data: response.data, status: response.status };
  }

  /** Serialise array `includes` param to a comma-separated string. */
  includesParam(includes?: string | string[]): string | undefined {
    if (!includes) return undefined;
    return Array.isArray(includes) ? includes.join(",") : includes;
  }
}

/** @deprecated Use WorkflowMax instead */
export class WorkflowMaxClient extends HttpClient {}
