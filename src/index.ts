export { WorkflowMax } from "./workflowmax";
export { HttpClient, WorkflowMaxClient } from "./client";
export { registry, getTool } from "./registry";
export type { ToolDefinition } from "./registry";
export * as schemas from "./schemas";

// Auth helpers
export {
  buildAuthoriseUrl,
  obtainTokens,
  refreshTokens,
  decodeOrgId,
} from "./auth";

// Resource classes (for consumers who want to extend or test individually)
export { ClientsResource } from "./resources/clients";
export { ClientGroupsResource } from "./resources/client-groups";
export { ClientContactsResource } from "./resources/client-contacts";
export { ClientDocumentsResource } from "./resources/client-documents";
export { JobsResource } from "./resources/jobs";
export { JobStaffResource } from "./resources/job-staff";
export { JobTasksResource } from "./resources/job-tasks";
export { JobCostsResource } from "./resources/job-costs";
export { TimesheetsResource } from "./resources/timesheets";
export { CapacityPlanResource } from "./resources/capacity-plan";
export { StaffResource } from "./resources/staff";
export { TasksResource } from "./resources/tasks";
export { CostsResource } from "./resources/costs";
export { LeadsResource } from "./resources/leads";
export { QuotesResource } from "./resources/quotes";
export { InvoicesResource } from "./resources/invoices";
export { PurchaseOrdersResource } from "./resources/purchase-orders";
export { SuppliersResource } from "./resources/suppliers";
export { CustomFieldsResource } from "./resources/custom-fields";
export {
  MeResource,
  AccountsResource,
  RolesResource,
  TaxesResource,
} from "./resources/me";

// All types
export type {
  // Config & Response
  WFMClientConfig,
  WFMResponse,
  WFMListResponse,
  WFMError,
  PaginationParams,
  SortParams,
  // Auth
  TokenResponse,
  AuthoriseUrlParams,
  ObtainTokensParams,
  RefreshTokensParams,
  // Shared
  Address,
  CustomField,
  ContactDetails,
  Note,
  Document,
  StaffRef,
  CustomRate,
  TaxNumber,
  BillingDetails,
  ClientRelationship,
  // Client
  Client,
  ClientStatus,
  ClientIncludes,
  ListClientsParams,
  CreateClientBody,
  UpdateClientBody,
  BusinessStructure,
  ClientType,
  // Client Contact
  ClientContact,
  CreateClientContactBody,
  UpdateClientContactBody,
  // Client Group
  ClientGroup,
  CreateClientGroupBody,
  UpdateClientGroupBody,
  // Staff
  Staff,
  CreateStaffBody,
  UpdateStaffBody,
  ListStaffParams,
  // Task
  Task,
  CreateTaskBody,
  UpdateTaskBody,
  ListTasksParams,
  // Cost
  Cost,
  CreateCostBody,
  UpdateCostBody,
  // Tax
  Tax,
  // Custom Field
  CustomFieldDefinition,
  CreateCustomFieldBody,
  UpdateCustomFieldBody,
  // Job
  Job,
  JobStatus,
  JobIncludes,
  ListJobsParams,
  CreateJobBody,
  UpdateJobBody,
  JobTemplate,
  JobCategory,
  JobStatusItem,
  // Job Staff
  JobStaff,
  CreateJobStaffBody,
  UpdateJobStaffBody,
  // Job Task
  JobTask,
  CreateJobTaskBody,
  UpdateJobTaskBody,
  // Job Cost
  JobCost,
  CreateJobCostBody,
  UpdateJobCostBody,
  // Job Note
  CreateJobNoteBody,
  // Timesheet
  Timesheet,
  ListTimesheetsParams,
  CreateTimesheetBody,
  UpdateTimesheetBody,
  // Capacity Plan
  CapacityPlanEntry,
  ListCapacityPlanParams,
  // Lead
  Lead,
  ListLeadsParams,
  CreateLeadBody,
  UpdateLeadBody,
  LeadCategory,
  // Quote
  Quote,
  ListQuotesParams,
  // Invoice
  Invoice,
  ListInvoicesParams,
  Payment,
  // Purchase Order
  PurchaseOrder,
  ListPurchaseOrdersParams,
  CreatePurchaseOrderBody,
  Bill,
  CreateBillBody,
  StockReceipt,
  CreateStockReceiptBody,
  // Supplier
  Supplier,
  ListSuppliersParams,
  CreateSupplierBody,
  UpdateSupplierBody,
  SupplierContact,
  CreateSupplierContactBody,
  UpdateSupplierContactBody,
  // Me / Account / Role
  Me,
  Account,
  Role,
} from "./types";
