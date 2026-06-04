import FormData from "form-data";
import { HttpClient } from "../client";
import {
  Lead,
  CreateLeadBody,
  UpdateLeadBody,
  ListLeadsParams,
  LeadCategory,
  Document,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class LeadsResource {
  constructor(private http: HttpClient) {}

  /** List all leads. */
  list(params?: ListLeadsParams): Promise<WFMListResponse<Lead>> {
    return this.http.getList<Lead>("/v2/leads", params as Record<string, unknown>);
  }

  /** Get a single lead by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Lead>> {
    return this.http.get<Lead>(`/v2/leads/${uuid}`);
  }

  /** Create a new lead. */
  create(body: CreateLeadBody): Promise<WFMResponse<Lead>> {
    return this.http.post<Lead>("/v2/leads", body);
  }

  /** Update an existing lead. */
  update(uuid: string, body: UpdateLeadBody): Promise<WFMResponse<Lead>> {
    return this.http.put<Lead>(`/v2/leads/${uuid}`, body);
  }

  /** List available lead categories. */
  listCategories(): Promise<WFMListResponse<LeadCategory>> {
    return this.http.getList<LeadCategory>("/v2/lead-categories");
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  /** List documents attached to a lead. */
  listDocuments(leadUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(`/v2/leads/${leadUuid}/documents`);
  }

  /** Upload a document to a lead. */
  uploadDocument(
    leadUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, { filename: options?.fileName ?? "upload" });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);
    return this.http.post<Document>(
      `/v2/leads/${leadUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }
}
