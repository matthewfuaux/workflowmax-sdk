import { HttpClient } from "../client";
import {
  JobTask,
  CreateJobTaskBody,
  UpdateJobTaskBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class JobTasksResource {
  constructor(private http: HttpClient) {}

  /** List all tasks across all jobs (optionally filter by job). */
  list(params?: { jobUUID?: string }): Promise<WFMListResponse<JobTask>> {
    return this.http.getList<JobTask>("/v2/jobs/tasks", params);
  }

  /** Add a task to a job. */
  create(
    jobIdentifier: string,
    body: CreateJobTaskBody
  ): Promise<WFMResponse<JobTask>> {
    return this.http.post<JobTask>(
      `/v2/jobs/${jobIdentifier}/tasks`,
      body
    );
  }

  /** Update a job task by its job-task UUID. */
  update(
    jobTaskUuid: string,
    body: UpdateJobTaskBody
  ): Promise<WFMResponse<JobTask>> {
    return this.http.put<JobTask>(
      `/v2/jobs/tasks/${jobTaskUuid}`,
      body
    );
  }

  /** Delete a job task by its job-task UUID. */
  delete(jobTaskUuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/jobs/tasks/${jobTaskUuid}`);
  }
}
