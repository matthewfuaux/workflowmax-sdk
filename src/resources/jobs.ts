import FormData from "form-data";
import { HttpClient } from "../client";
import {
  Job,
  CreateJobBody,
  UpdateJobBody,
  ListJobsParams,
  JobTemplate,
  JobCategory,
  JobStatusItem,
  WFMListResponse,
  WFMResponse,
  Document,
  Note,
  CreateJobNoteBody,
} from "../types";

export class JobsResource {
  constructor(private http: HttpClient) {}

  /** List all jobs with optional filtering and includes. */
  list(params?: ListJobsParams): Promise<WFMListResponse<Job>> {
    const { includes, ...rest } = params ?? {};
    return this.http.getList<Job>("/v2/jobs", {
      ...rest,
      includes: this.http.includesParam(includes),
    });
  }

  /** Get a single job by UUID or job number. */
  retrieve(
    identifier: string,
    params?: { includes?: ListJobsParams["includes"] }
  ): Promise<WFMResponse<Job>> {
    return this.http.get<Job>(`/v2/jobs/${identifier}`, {
      includes: this.http.includesParam(params?.includes),
    });
  }

  /** Create a new job. */
  create(body: CreateJobBody): Promise<WFMResponse<Job>> {
    return this.http.post<Job>("/v2/jobs", body);
  }

  /** Update an existing job. */
  update(identifier: string, body: UpdateJobBody): Promise<WFMResponse<Job>> {
    return this.http.put<Job>(`/v2/jobs/${identifier}`, body);
  }

  /** Delete a job. */
  delete(identifier: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/jobs/${identifier}`);
  }

  /** Apply a job template to a job. */
  applyTemplate(
    jobUuid: string,
    templateUuid: string
  ): Promise<WFMResponse<Job>> {
    return this.http.post<Job>(
      `/v2/jobs/${jobUuid}/job-templates`,
      { uuid: templateUuid }
    );
  }

  // ─── Notes ───────────────────────────────────────────────────────────────

  /** Add a note to a job. */
  createNote(
    jobUuid: string,
    body: CreateJobNoteBody
  ): Promise<WFMResponse<Note>> {
    return this.http.post<Note>(`/v2/jobs/${jobUuid}/notes`, body);
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  /** List documents attached to a job. */
  listDocuments(jobUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(`/v2/jobs/${jobUuid}/documents`);
  }

  /** Upload a document to a job. */
  uploadDocument(
    jobUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, { filename: options?.fileName ?? "upload" });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);
    return this.http.post<Document>(
      `/v2/jobs/${jobUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }

  // ─── Lookups ─────────────────────────────────────────────────────────────

  /** List available job templates. */
  listTemplates(): Promise<WFMListResponse<JobTemplate>> {
    return this.http.getList<JobTemplate>("/v2/job-templates");
  }

  /** List available job categories. */
  listCategories(): Promise<WFMListResponse<JobCategory>> {
    return this.http.getList<JobCategory>("/v2/job-categories");
  }

  /** List available job statuses. */
  listStatuses(): Promise<WFMListResponse<JobStatusItem>> {
    return this.http.getList<JobStatusItem>("/v2/job-status");
  }
}
