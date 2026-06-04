import { HttpClient } from "../client";
import {
  Invoice,
  ListInvoicesParams,
  Payment,
  Cost,
  Note,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class InvoicesResource {
  constructor(private http: HttpClient) {}

  /** List all invoices. */
  list(params?: ListInvoicesParams): Promise<WFMListResponse<Invoice>> {
    return this.http.getList<Invoice>("/v2/invoices", params as Record<string, unknown>);
  }

  /** Get a single invoice by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Invoice>> {
    return this.http.get<Invoice>(`/v2/invoices/${uuid}`);
  }

  /** List costs on an invoice. */
  listCosts(invoiceUuid: string): Promise<WFMListResponse<Cost>> {
    return this.http.getList<Cost>(`/v2/invoices/${invoiceUuid}/costs`);
  }

  /** List all invoice notes. */
  listNotes(): Promise<WFMListResponse<Note>> {
    return this.http.getList<Note>("/v2/invoices/notes");
  }

  /** List all payments. */
  listPayments(): Promise<WFMListResponse<Payment>> {
    return this.http.getList<Payment>("/v2/payments");
  }
}
