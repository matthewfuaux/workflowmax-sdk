import { HttpClient } from "../client";
import {
  JobCost,
  CreateJobCostBody,
  UpdateJobCostBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class JobCostsResource {
  constructor(private http: HttpClient) {}

  /** List all costs for a job. */
  list(jobUuid: string): Promise<WFMListResponse<JobCost>> {
    return this.http.getList<JobCost>(`/v2/jobs/${jobUuid}/costs`);
  }

  /** Add a cost to a job. */
  create(
    jobIdentifier: string,
    body: CreateJobCostBody
  ): Promise<WFMResponse<JobCost>> {
    return this.http.post<JobCost>(
      `/v2/jobs/${jobIdentifier}/costs`,
      body
    );
  }

  /** Update a job cost by its cost UUID. */
  update(
    costUuid: string,
    body: UpdateJobCostBody
  ): Promise<WFMResponse<JobCost>> {
    return this.http.put<JobCost>(`/v2/jobs/costs/${costUuid}`, body);
  }
}
