import { HttpClient } from "../client";
import { CapacityPlanEntry, ListCapacityPlanParams, WFMListResponse } from "../types";

export class CapacityPlanResource {
  constructor(private http: HttpClient) {}

  /** Get capacity plan data, optionally filtered by date range or staff. */
  list(params?: ListCapacityPlanParams): Promise<WFMListResponse<CapacityPlanEntry>> {
    return this.http.getList<CapacityPlanEntry>(
      "/v2/capacity-plan",
      params as Record<string, unknown>
    );
  }
}
