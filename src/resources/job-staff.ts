import { HttpClient } from "../client";
import {
  JobStaff,
  CreateJobStaffBody,
  UpdateJobStaffBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class JobStaffResource {
  constructor(private http: HttpClient) {}

  /** Add a staff member to a job. */
  create(
    jobIdentifier: string,
    body: CreateJobStaffBody
  ): Promise<WFMResponse<JobStaff>> {
    return this.http.post<JobStaff>(
      `/v2/jobs/${jobIdentifier}/staff`,
      body
    );
  }

  /** Update a staff assignment on a job. */
  update(
    jobIdentifier: string,
    body: UpdateJobStaffBody
  ): Promise<WFMResponse<JobStaff>> {
    return this.http.put<JobStaff>(
      `/v2/jobs/${jobIdentifier}/staff`,
      body
    );
  }

  /** Remove a staff member from a job. */
  delete(
    jobIdentifier: string,
    staffUuid: string
  ): Promise<WFMResponse<void>> {
    return this.http.delete(
      `/v2/jobs/${jobIdentifier}/staff/${staffUuid}`
    );
  }
}
