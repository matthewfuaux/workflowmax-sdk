import { HttpClient } from "../client";
import {
  Cost,
  CreateCostBody,
  UpdateCostBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class CostsResource {
  constructor(private http: HttpClient) {}

  /** List all costs. */
  list(): Promise<WFMListResponse<Cost>> {
    return this.http.getList<Cost>("/v2/costs");
  }

  /** Get a single cost by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Cost>> {
    return this.http.get<Cost>(`/v2/costs/${uuid}`);
  }

  /** Create a new cost. */
  create(body: CreateCostBody): Promise<WFMResponse<Cost>> {
    return this.http.post<Cost>("/v2/costs", body);
  }

  /** Update an existing cost. */
  update(uuid: string, body: UpdateCostBody): Promise<WFMResponse<Cost>> {
    return this.http.put<Cost>(`/v2/costs/${uuid}`, body);
  }

  /** Delete a cost. */
  delete(uuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/costs/${uuid}`);
  }
}
