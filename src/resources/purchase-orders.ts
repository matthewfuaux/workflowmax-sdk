import FormData from "form-data";
import { HttpClient } from "../client";
import {
  PurchaseOrder,
  CreatePurchaseOrderBody,
  ListPurchaseOrdersParams,
  Bill,
  CreateBillBody,
  StockReceipt,
  CreateStockReceiptBody,
  Document,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class PurchaseOrdersResource {
  constructor(private http: HttpClient) {}

  /** List all purchase orders. */
  list(params?: ListPurchaseOrdersParams): Promise<WFMListResponse<PurchaseOrder>> {
    return this.http.getList<PurchaseOrder>("/v2/purchase-orders", params as Record<string, unknown>);
  }

  /** Get a single purchase order by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<PurchaseOrder>> {
    return this.http.get<PurchaseOrder>(`/v2/purchase-orders/${uuid}`);
  }

  /** Create a new purchase order. */
  create(body: CreatePurchaseOrderBody): Promise<WFMResponse<PurchaseOrder>> {
    return this.http.post<PurchaseOrder>("/v2/purchase-orders", body);
  }

  // ─── Bills ───────────────────────────────────────────────────────────────

  /** List all bills across purchase orders. */
  listBills(): Promise<WFMListResponse<Bill>> {
    return this.http.getList<Bill>("/v2/purchase-orders/bills");
  }

  /** Add a bill to a purchase order. */
  createBill(
    purchaseOrderUuid: string,
    body: CreateBillBody
  ): Promise<WFMResponse<Bill>> {
    return this.http.post<Bill>(
      `/v2/purchase-orders/${purchaseOrderUuid}/bills`,
      body
    );
  }

  // ─── Stock Receipts ───────────────────────────────────────────────────────

  /** List all stock receipts across purchase orders. */
  listStockReceipts(): Promise<WFMListResponse<StockReceipt>> {
    return this.http.getList<StockReceipt>("/v2/purchase-orders/stock-receipts");
  }

  /** Add a stock receipt to a purchase order. */
  createStockReceipt(
    purchaseOrderUuid: string,
    body: CreateStockReceiptBody
  ): Promise<WFMResponse<StockReceipt>> {
    return this.http.post<StockReceipt>(
      `/v2/purchase-orders/${purchaseOrderUuid}/stockreceipts`,
      body
    );
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  /** List documents attached to a purchase order. */
  listDocuments(purchaseOrderUuid: string): Promise<WFMListResponse<Document>> {
    return this.http.getList<Document>(
      `/v2/purchase-orders/${purchaseOrderUuid}/documents`
    );
  }

  /** Upload a document to a purchase order. */
  uploadDocument(
    purchaseOrderUuid: string,
    file: Buffer | NodeJS.ReadableStream,
    options?: { title?: string; note?: string; phase?: string; fileName?: string }
  ): Promise<WFMResponse<Document>> {
    const form = new FormData();
    form.append("file", file, { filename: options?.fileName ?? "upload" });
    if (options?.title) form.append("title", options.title);
    if (options?.note) form.append("note", options.note);
    if (options?.phase) form.append("phase", options.phase);
    return this.http.post<Document>(
      `/v2/purchase-orders/${purchaseOrderUuid}/documents`,
      form,
      { headers: form.getHeaders() }
    );
  }
}
