import FormData from "form-data";
import { HttpClient } from "../client";
import {
  Supplier,
  CreateSupplierBody,
  UpdateSupplierBody,
  ListSuppliersParams,
  SupplierContact,
  CreateSupplierContactBody,
  UpdateSupplierContactBody,
  Document,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class SuppliersResource {
  constructor(private http: HttpClient) {}

  /** List all suppliers. */
  list(params?: ListSuppliersParams): Promise<WFMListResponse<Supplier>> {
    return this.http.getList<Supplier>("/v2/suppliers", params as Record<string, unknown>);
  }

  /** Get a single supplier by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Supplier>> {
    return this.http.get<Supplier>(`/v2/suppliers/${uuid}`);
  }

  /** Create a new supplier. */
  create(body: CreateSupplierBody): Promise<WFMResponse<Supplier>> {
    return this.http.post<Supplier>("/v2/suppliers", body);
  }

  /** Update an existing supplier. */
  update(uuid: string, body: UpdateSupplierBody): Promise<WFMResponse<Supplier>> {
    return this.http.put<Supplier>(`/v2/suppliers/${uuid}`, body);
  }

  /** Delete a supplier. */
  delete(uuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/suppliers/${uuid}`);
  }

  // ─── Supplier Contacts ────────────────────────────────────────────────────

  /** Get a supplier contact by UUID. */
  retrieveContact(contactUuid: string): Promise<WFMResponse<SupplierContact>> {
    return this.http.get<SupplierContact>(
      `/v2/supplier-contacts/${contactUuid}`
    );
  }

  /** Add a contact to a supplier. */
  createContact(
    supplierUuid: string,
    body: CreateSupplierContactBody
  ): Promise<WFMResponse<SupplierContact>> {
    return this.http.post<SupplierContact>(
      `/v2/suppliers/${supplierUuid}/contacts`,
      body
    );
  }

  /** Update a supplier contact. */
  updateContact(
    contactUuid: string,
    body: UpdateSupplierContactBody
  ): Promise<WFMResponse<SupplierContact>> {
    return this.http.put<SupplierContact>(
      `/v2/supplier-contacts/${contactUuid}`,
      body
    );
  }

  /** Delete a supplier contact. */
  deleteContact(contactUuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/supplier-contacts/${contactUuid}`);
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  /** List documents attached to a supplier. */
  listDocuments(supplierUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(`/v2/suppliers/${supplierUuid}/documents`);
  }

  /** Upload a document to a supplier. */
  uploadDocument(
    supplierUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, { filename: options?.fileName ?? "upload" });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);
    return this.http.post<Document>(
      `/v2/suppliers/${supplierUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }
}
