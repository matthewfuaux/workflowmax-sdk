import FormData from "form-data";
import { HttpClient } from "../client";
import {
  Quote,
  ListQuotesParams,
  Document,
  Note,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class QuotesResource {
  constructor(private http: HttpClient) {}

  /** List all quotes. */
  list(params?: ListQuotesParams): Promise<WFMListResponse<Quote>> {
    return this.http.getList<Quote>("/v2/quotes", params as Record<string, unknown>);
  }

  /** Get a single quote by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Quote>> {
    return this.http.get<Quote>(`/v2/quotes/${uuid}`);
  }

  /** Create a quote for a job. */
  createForJob(jobUuid: string, body?: Partial<Quote>): Promise<WFMResponse<Quote>> {
    return this.http.post<Quote>(`/v2/jobs/${jobUuid}/quotes`, body);
  }

  /** List quote notes. */
  listNotes(): Promise<WFMListResponse<Note>> {
    return this.http.getList<Note>("/v2/quotes/notes");
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  /** List documents for a quote. */
  listDocuments(quoteUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(`/v2/quotes/${quoteUuid}/documents`);
  }

  /** Upload a document to a quote. */
  uploadDocument(
    quoteUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, { filename: options?.fileName ?? "upload" });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);
    return this.http.post<Document>(
      `/v2/quotes/${quoteUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }
}
