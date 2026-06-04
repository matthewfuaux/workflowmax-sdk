import FormData from "form-data";
import { HttpClient } from "../client";
import { Document, WFMListResponse, WFMResponse } from "../types";

export class ClientDocumentsResource {
  constructor(private http: HttpClient) {}

  /**
   * List all documents for a client.
   */
  list(clientUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(
      `/v2/clients/${clientUuid}/documents`
    );
  }

  /**
   * Upload a document to a client.
   * Pass a Buffer or Readable stream as `file`.
   */
  upload(
    clientUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, {
      filename: options?.fileName ?? "upload",
    });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);

    return this.http.post<Document>(
      `/v2/clients/${clientUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }
}
