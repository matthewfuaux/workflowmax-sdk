// ─── Core Config & Response ───────────────────────────────────────────────────

export interface WFMClientConfig {
  /** OAuth 2.0 access token */
  accessToken: string;
  /** Your WorkflowMax organisation/account ID (decoded from JWT) */
  accountId: string;
  /** Override the API base URL (defaults to https://api.workflowmax.com) */
  baseUrl?: string;
}

export interface WFMResponse<T> {
  data: T;
  status: number;
}

export interface WFMListResponse<T> {
  data: T[];
  total: number;
}

export interface WFMError {
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  status?: number;
}

// ─── Pagination & Filtering ───────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sort?: "created" | "updated";
  order?: "asc" | "desc";
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AuthoriseUrlParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

export interface ObtainTokensParams {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}

export interface RefreshTokensParams {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  scope?: string;
}

// ─── Shared Sub-types ─────────────────────────────────────────────────────────

export interface StaffRef {
  uuid: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface Address {
  type?: string;
  default?: boolean;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CustomField {
  uuid: string;
  name?: string;
  value?: unknown;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
  fax?: string;
  website?: string;
}

export interface CustomRate {
  markup?: number | null;
}

export interface TaxNumber {
  name: string;
  number: string;
}

export interface ZeroRatedTax {
  taxName?: string;
  rate?: number;
}

export interface BillingDetails {
  businessStructureUUID?: string;
  clientTypeUUID?: string;
  balanceDate?: string;
  markup?: number;
  zeroRatedTaxRate?: ZeroRatedTax;
  invoiceDueDate?: string;
  billingClientUUID?: string;
  customRates?: Array<{ taskUUID: string; billableRate: number }>;
  taxNumbers?: TaxNumber[];
}

export interface ClientRelationship {
  uuid?: string;
  relatedClientUUID?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface Note {
  uuid?: string;
  title?: string;
  phase?: string;
  description?: string;
  date?: string;
  createdByFirstName?: string;
  createdByLastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  uuid?: string;
  title?: string;
  fileName?: string;
  fileSize?: number;
  note?: string;
  phase?: string;
  downloadURL?: string;
  uploadedByFirstName?: string;
  uploadedByLastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Client Contact ───────────────────────────────────────────────────────────

export interface ClientContact {
  uuid?: string;
  salutation?: string | null;
  firstName?: string;
  lastName?: string | null;
  archived?: boolean;
  addressee?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  favourite?: boolean;
  position?: string;
  primary?: boolean;
  includeInEmails?: boolean;
  clients?: Array<{ uuid: string; name?: string }>;
  customFields?: CustomField[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateClientContactBody {
  firstName: string;
  lastName?: string | null;
  salutation?: string | null;
  archived?: boolean;
  addressee?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  favourite?: boolean;
  customFields?: Array<{ uuid: string; value?: unknown }>;
}

export type UpdateClientContactBody = Partial<CreateClientContactBody>;

// ─── Client Group ─────────────────────────────────────────────────────────────

export interface ClientGroup {
  uuid?: string;
  name: string;
  taxable?: boolean | null;
  favourite?: boolean;
  clients?: Array<{ uuid: string; name?: string; address?: string }>;
}

export interface CreateClientGroupBody {
  name: string;
  taxable?: boolean | null;
  favourite?: boolean;
  clients?: Array<{ uuid: string }>;
}

export type UpdateClientGroupBody = Partial<CreateClientGroupBody>;

// ─── Client ───────────────────────────────────────────────────────────────────

export type ClientStatus = "active" | "archived";
export type ClientIncludes =
  | "addresses"
  | "contacts"
  | "contact-details"
  | "billing-details"
  | "client-groups"
  | "client-relationships"
  | "custom-fields"
  | "notes"
  | "documents";

export interface Client {
  uuid?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  exportCode?: string;
  clientManager?: StaffRef | null;
  jobManager?: StaffRef | null;
  referralSource?: string;
  prospect?: boolean;
  archived?: boolean;
  favorite?: boolean;
  addresses?: Address[];
  contacts?: ClientContact[];
  contactDetails?: ContactDetails;
  billingDetails?: BillingDetails;
  clientGroups?: ClientGroup[];
  clientRelationships?: ClientRelationship[];
  customFields?: CustomField[];
  notes?: Note[];
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListClientsParams extends PaginationParams, SortParams {
  name?: string;
  updatedSince?: string;
  status?: ClientStatus;
  includes?: ClientIncludes | ClientIncludes[];
}

export interface CreateClientBody {
  /** Required if business structure is not individual */
  name?: string;
  /** Required if business structure is individual */
  firstName?: string;
  /** Required if business structure is individual */
  lastName?: string;
  otherName?: string;
  email?: string | null;
  phone?: string | null;
  fax?: string | null;
  website?: string | null;
  referralSource?: string;
  clientManagerUuid?: string;
  jobManagerUuid?: string;
  businessStructureUuid?: string;
  clientTypeUuid?: string;
  favorite?: boolean | null;
  addresses?: Address[];
  taxFileNumber?: string | null;
  "abn/Wpn"?: string | null;
  "branch/Cac/Ica"?: string | null;
  acn?: string | null;
  vatNumber?: string | null;
  companyNumber?: string | null;
  irdNumber?: string | null;
  nzbn?: string | null;
  taxNumber?: string | null;
  yearEndDate?: string | null;
  balanceDate?: string | null;
  zeroRatedTaxUuid?: string | null;
  billingClientUuid?: string | null;
  customRate?: CustomRate;
  customPaymentDay?: number;
  customPaymentTerm?: string;
  groups?: Array<{ uuid: string }>;
  contacts?: CreateClientContactBody[];
  exportCode?: string | null;
  relationships?: ClientRelationship[];
  customFields?: Array<{ uuid: string; value?: unknown }>;
}

export type UpdateClientBody = Partial<CreateClientBody>;

// ─── Business Structure / Client Type ─────────────────────────────────────────

export interface BusinessStructure {
  uuid: string;
  name: string;
  type?: string;
}

export interface ClientType {
  uuid: string;
  name: string;
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export interface Staff {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  role?: string;
  billableRate?: number;
  costRate?: number;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffBody {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  billableRate?: number;
  costRate?: number;
}

export type UpdateStaffBody = Partial<CreateStaffBody>;

export interface ListStaffParams extends PaginationParams {
  updatedSince?: string;
}

// ─── Task (Basic/Template) ────────────────────────────────────────────────────

export interface Task {
  uuid?: string;
  name: string;
  description?: string;
  billable?: boolean;
  billableRate?: number;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskBody {
  name: string;
  description?: string;
  billable?: boolean;
  billableRate?: number;
}

export type UpdateTaskBody = Partial<CreateTaskBody>;

export interface ListTasksParams extends PaginationParams {
  updatedSince?: string;
}

// ─── Cost ─────────────────────────────────────────────────────────────────────

export interface Cost {
  uuid?: string;
  date?: string;
  description?: string;
  quantity?: number;
  unitCost?: number;
  unitPrice?: number;
  taxable?: boolean;
  note?: string;
  supplierUuid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCostBody {
  date: string;
  description?: string;
  quantity?: number;
  unitCost?: number;
  unitPrice?: number;
  taxable?: boolean;
  note?: string;
  supplierUuid?: string;
}

export type UpdateCostBody = Partial<CreateCostBody>;

// ─── Tax ─────────────────────────────────────────────────────────────────────

export interface Tax {
  uuid: string;
  name: string;
  rate: number;
  isDefault?: boolean;
}

// ─── Custom Field ─────────────────────────────────────────────────────────────

export interface CustomFieldDefinition {
  uuid: string;
  name: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

export interface CreateCustomFieldBody {
  name: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

export type UpdateCustomFieldBody = Partial<CreateCustomFieldBody>;

// ─── Job ──────────────────────────────────────────────────────────────────────

export type JobStatus = "progress" | "completed" | "cancelled";
export type JobIncludes =
  | "tasks"
  | "staff"
  | "costs"
  | "notes"
  | "custom-fields"
  | "documents";

export interface Job {
  uuid?: string;
  id?: string;
  name?: string;
  description?: string;
  clientUUID?: string;
  clientName?: string;
  status?: JobStatus;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  categoryUUID?: string;
  templateUUID?: string;
  leadStaffUUID?: string;
  state?: string;
  billableRate?: number;
  tasks?: JobTask[];
  staff?: JobStaff[];
  costs?: Cost[];
  notes?: Note[];
  customFields?: CustomField[];
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListJobsParams extends PaginationParams, SortParams {
  updatedSince?: string;
  status?: JobStatus | string;
  clientUUID?: string;
  includes?: JobIncludes | JobIncludes[];
}

export interface CreateJobBody {
  name: string;
  clientUUID?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  categoryUUID?: string;
  templateUUID?: string;
  leadStaffUUID?: string;
  billableRate?: number;
  customFields?: Array<{ uuid: string; value?: unknown }>;
}

export type UpdateJobBody = Partial<CreateJobBody>;

export interface JobTemplate {
  uuid: string;
  name: string;
}

export interface JobCategory {
  uuid: string;
  name: string;
}

export interface JobStatusItem {
  uuid: string;
  name: string;
}

// ─── Job Staff ────────────────────────────────────────────────────────────────

export interface JobStaff {
  uuid?: string;
  staffUUID?: string;
  firstName?: string;
  lastName?: string;
  billableRate?: number;
}

export interface CreateJobStaffBody {
  staffUUID: string;
  billableRate?: number;
}

export type UpdateJobStaffBody = Partial<CreateJobStaffBody>;

// ─── Job Task ─────────────────────────────────────────────────────────────────

export interface JobTask {
  uuid?: string;
  taskUUID?: string;
  name?: string;
  description?: string;
  estimatedMinutes?: number;
  billable?: boolean;
  billableRate?: number;
  completed?: boolean;
}

export interface CreateJobTaskBody {
  taskUUID: string;
  estimatedMinutes?: number;
  billable?: boolean;
  billableRate?: number;
}

export type UpdateJobTaskBody = Partial<CreateJobTaskBody>;

// ─── Job Cost ─────────────────────────────────────────────────────────────────

export interface JobCost extends Cost {
  jobUUID?: string;
}

export interface CreateJobCostBody extends CreateCostBody {
  jobUUID?: string;
}

export type UpdateJobCostBody = Partial<CreateJobCostBody>;

// ─── Job Note ────────────────────────────────────────────────────────────────

export interface CreateJobNoteBody {
  title?: string;
  phase?: string;
  description: string;
  date?: string;
}

// ─── Timesheet ───────────────────────────────────────────────────────────────

export interface Timesheet {
  uuid?: string;
  staffUUID?: string;
  jobUUID?: string;
  jobTaskUUID?: string;
  date?: string;
  minutes?: number;
  note?: string;
  billable?: boolean;
  billed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListTimesheetsParams extends PaginationParams {
  staffUUID?: string;
  jobUUID?: string;
  updatedSince?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTimesheetBody {
  staffUUID: string;
  jobUUID: string;
  jobTaskUUID?: string;
  date: string;
  minutes: number;
  note?: string;
  billable?: boolean;
}

export type UpdateTimesheetBody = Partial<CreateTimesheetBody>;

// ─── Capacity Plan ───────────────────────────────────────────────────────────

export interface CapacityPlanEntry {
  staffUUID?: string;
  date?: string;
  allocatedMinutes?: number;
  availableMinutes?: number;
}

export interface ListCapacityPlanParams {
  startDate?: string;
  endDate?: string;
  staffUUID?: string;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  uuid?: string;
  name?: string;
  categoryUUID?: string;
  clientUUID?: string;
  status?: string;
  description?: string;
  assignedStaffUUID?: string;
  estimatedValue?: number;
  closedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListLeadsParams extends PaginationParams {
  updatedSince?: string;
  status?: string;
}

export interface CreateLeadBody {
  name: string;
  categoryUUID?: string;
  clientUUID?: string;
  description?: string;
  assignedStaffUUID?: string;
  estimatedValue?: number;
  closedDate?: string;
}

export type UpdateLeadBody = Partial<CreateLeadBody>;

export interface LeadCategory {
  uuid: string;
  name: string;
}

// ─── Quote ───────────────────────────────────────────────────────────────────

export interface Quote {
  uuid?: string;
  jobUUID?: string;
  title?: string;
  status?: string;
  total?: number;
  notes?: Note[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListQuotesParams extends PaginationParams {
  updatedSince?: string;
  status?: string;
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

export interface Invoice {
  uuid?: string;
  jobUUID?: string;
  clientUUID?: string;
  status?: string;
  total?: number;
  dueDate?: string;
  paidDate?: string;
  notes?: Note[];
  costs?: Cost[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListInvoicesParams extends PaginationParams {
  updatedSince?: string;
  status?: string;
  clientUUID?: string;
}

export interface Payment {
  uuid?: string;
  invoiceUUID?: string;
  amount?: number;
  date?: string;
  note?: string;
}

// ─── Purchase Order ───────────────────────────────────────────────────────────

export interface PurchaseOrder {
  uuid?: string;
  jobUUID?: string;
  supplierUUID?: string;
  status?: string;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListPurchaseOrdersParams extends PaginationParams {
  updatedSince?: string;
}

export interface CreatePurchaseOrderBody {
  jobUUID?: string;
  supplierUUID?: string;
}

export interface Bill {
  uuid?: string;
  purchaseOrderUUID?: string;
  amount?: number;
  date?: string;
}

export interface CreateBillBody {
  amount: number;
  date: string;
}

export interface StockReceipt {
  uuid?: string;
  purchaseOrderUUID?: string;
  date?: string;
}

export interface CreateStockReceiptBody {
  date: string;
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export interface Supplier {
  uuid?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  contacts?: SupplierContact[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSuppliersParams extends PaginationParams {
  updatedSince?: string;
}

export interface CreateSupplierBody {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export type UpdateSupplierBody = Partial<CreateSupplierBody>;

export interface SupplierContact {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierContactBody {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
}

export type UpdateSupplierContactBody = Partial<CreateSupplierContactBody>;

// ─── Me / Account / Role ─────────────────────────────────────────────────────

export interface Me {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export interface Account {
  uuid?: string;
  name?: string;
  country?: string;
  timezone?: string;
}

export interface Role {
  uuid: string;
  name: string;
}

// ─── Document Upload ─────────────────────────────────────────────────────────

export interface UploadDocumentBody {
  title?: string;
  note?: string;
  phase?: string;
  file: Buffer | Blob | string;
  fileName: string;
}
