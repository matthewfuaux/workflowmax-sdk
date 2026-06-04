/**
 * Zod schemas for all WorkflowMax API endpoints.
 *
 * These serve three purposes:
 *   1. Runtime input validation
 *   2. TypeScript inference (replaces hand-written param types)
 *   3. JSON Schema generation for MCP tool definitions (via zod-to-json-schema)
 */
import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

export const UuidSchema = z.string().uuid();

export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().describe("Page number (min 1)"),
  pageSize: z.number().int().min(1).max(1000).optional().describe("Results per page (max 1000)"),
});

export const SortSchema = z.object({
  sort: z.enum(["created", "updated"]).optional().describe("Field to sort by"),
  order: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
});

export const AddressSchema = z.object({
  type: z.string().optional().describe("Address type, e.g. Postal, Physical"),
  default: z.boolean().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export const CustomFieldValueSchema = z.object({
  uuid: UuidSchema.describe("Custom field definition UUID"),
  value: z.unknown().optional(),
});

export const ContactBodySchema = z.object({
  firstName: z.string().describe("Contact's first name"),
  lastName: z.string().nullable().optional().describe("Contact's last name"),
  salutation: z.string().nullable().optional().describe("e.g. Mr., Ms., Dr."),
  archived: z.boolean().optional(),
  addressee: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  favourite: z.boolean().optional(),
  customFields: z.array(CustomFieldValueSchema).optional(),
});

// ─── Client schemas ───────────────────────────────────────────────────────────

export const ClientStatusSchema = z.enum(["active", "archived"]);

export const ClientIncludesSchema = z.array(
  z.enum([
    "addresses",
    "contacts",
    "contact-details",
    "billing-details",
    "client-groups",
    "client-relationships",
    "custom-fields",
    "notes",
    "documents",
  ])
).optional().describe("Related resources to include in the response");

export const ListClientsSchema = PaginationSchema.merge(SortSchema).extend({
  name: z.string().optional().describe("Filter by client name"),
  updatedSince: z.string().optional().describe("Filter by last updated date (YYYY-MM-DD)"),
  status: ClientStatusSchema.optional().describe("Filter by status (default: active)"),
  includes: ClientIncludesSchema,
});

export const GetClientSchema = z.object({
  uuid: UuidSchema.describe("Client UUID"),
  includes: ClientIncludesSchema,
});

export const CreateClientSchema = z.object({
  name: z.string().optional().describe("Required if business structure is not individual"),
  firstName: z.string().optional().describe("Required if business structure is individual"),
  lastName: z.string().optional(),
  otherName: z.string().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  referralSource: z.string().optional(),
  clientManagerUuid: UuidSchema.optional().describe("UUID of an active staff member"),
  jobManagerUuid: UuidSchema.optional().describe("UUID of an active staff member"),
  businessStructureUuid: UuidSchema.optional(),
  clientTypeUuid: UuidSchema.optional(),
  favorite: z.boolean().nullable().optional(),
  addresses: z.array(AddressSchema).optional(),
  exportCode: z.string().nullable().optional(),
  customPaymentDay: z.number().int().min(1).max(31).optional(),
  customPaymentTerm: z.string().optional().describe(
    "e.g. 'day(s) after the invoice date', 'day of the following month'"
  ),
  billingClientUuid: UuidSchema.nullable().optional(),
  zeroRatedTaxUuid: UuidSchema.nullable().optional(),
  groups: z.array(z.object({ uuid: UuidSchema })).optional(),
  contacts: z.array(ContactBodySchema).optional(),
  customFields: z.array(CustomFieldValueSchema).optional(),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  uuid: UuidSchema.describe("Client UUID"),
});

// ─── Client Group schemas ─────────────────────────────────────────────────────

export const CreateClientGroupSchema = z.object({
  name: z.string().describe("Name of the client group"),
  taxable: z.boolean().nullable().optional(),
  favourite: z.boolean().optional(),
  clients: z.array(z.object({ uuid: UuidSchema })).optional(),
});

export const UpdateClientGroupSchema = CreateClientGroupSchema.partial().extend({
  uuid: UuidSchema.describe("Client group UUID"),
});

export const ClientGroupUuidSchema = z.object({
  uuid: UuidSchema.describe("Client group UUID"),
});

export const ClientGroupClientSchema = z.object({
  groupUuid: UuidSchema.describe("Client group UUID"),
  clientUuid: UuidSchema.describe("Client UUID to add or remove"),
});

// ─── Client Contact schemas ───────────────────────────────────────────────────

export const ContactUuidSchema = z.object({
  contactUuid: UuidSchema.describe("Contact UUID"),
});

export const CreateContactSchema = ContactBodySchema;

export const UpdateContactSchema = ContactBodySchema.partial().extend({
  contactUuid: UuidSchema.describe("Contact UUID"),
});

export const CreateContactForClientSchema = ContactBodySchema.extend({
  clientUuid: UuidSchema.describe("Client UUID"),
});

export const UpdateContactForClientSchema = ContactBodySchema.partial().extend({
  clientUuid: UuidSchema.describe("Client UUID"),
  contactUuid: UuidSchema.describe("Contact UUID"),
});

export const DeleteContactForClientSchema = z.object({
  clientUuid: UuidSchema.describe("Client UUID"),
  contactUuid: UuidSchema.describe("Contact UUID"),
});

// ─── Job schemas ──────────────────────────────────────────────────────────────

export const JobIncludesSchema = z.array(
  z.enum(["tasks", "staff", "costs", "notes", "custom-fields", "documents"])
).optional();

export const ListJobsSchema = PaginationSchema.merge(SortSchema).extend({
  updatedSince: z.string().optional().describe("Filter by last updated date (YYYY-MM-DD)"),
  status: z.string().optional().describe("e.g. progress, completed, cancelled"),
  clientUUID: UuidSchema.optional().describe("Filter by client UUID"),
  includes: JobIncludesSchema,
});

export const GetJobSchema = z.object({
  identifier: z.string().describe("Job UUID or job number"),
  includes: JobIncludesSchema,
});

export const CreateJobSchema = z.object({
  name: z.string().describe("Job name"),
  clientUUID: UuidSchema.optional(),
  description: z.string().optional(),
  startDate: z.string().optional().describe("YYYY-MM-DD"),
  dueDate: z.string().optional().describe("YYYY-MM-DD"),
  categoryUUID: UuidSchema.optional(),
  templateUUID: UuidSchema.optional(),
  leadStaffUUID: UuidSchema.optional(),
  billableRate: z.number().optional(),
  customFields: z.array(CustomFieldValueSchema).optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  identifier: z.string().describe("Job UUID or job number"),
});

export const DeleteJobSchema = z.object({
  identifier: z.string().describe("Job UUID or job number"),
});

export const ApplyJobTemplateSchema = z.object({
  jobUuid: UuidSchema.describe("Job UUID"),
  templateUuid: UuidSchema.describe("Job template UUID"),
});

// ─── Job Staff schemas ────────────────────────────────────────────────────────

export const CreateJobStaffSchema = z.object({
  jobIdentifier: z.string().describe("Job UUID or job number"),
  staffUUID: UuidSchema,
  billableRate: z.number().optional(),
});

export const UpdateJobStaffSchema = z.object({
  jobIdentifier: z.string().describe("Job UUID or job number"),
  staffUUID: UuidSchema.optional(),
  billableRate: z.number().optional(),
});

export const DeleteJobStaffSchema = z.object({
  jobIdentifier: z.string().describe("Job UUID or job number"),
  staffUuid: UuidSchema,
});

// ─── Job Task schemas ─────────────────────────────────────────────────────────

export const ListJobTasksSchema = z.object({
  jobUUID: UuidSchema.optional().describe("Filter by job UUID"),
});

export const CreateJobTaskSchema = z.object({
  jobIdentifier: z.string().describe("Job UUID or job number"),
  taskUUID: UuidSchema,
  estimatedMinutes: z.number().int().optional(),
  billable: z.boolean().optional(),
  billableRate: z.number().optional(),
});

export const UpdateJobTaskSchema = z.object({
  jobTaskUuid: UuidSchema.describe("Job-task UUID"),
  taskUUID: UuidSchema.optional(),
  estimatedMinutes: z.number().int().optional(),
  billable: z.boolean().optional(),
  billableRate: z.number().optional(),
});

export const DeleteJobTaskSchema = z.object({
  jobTaskUuid: UuidSchema.describe("Job-task UUID"),
});

// ─── Job Cost schemas ─────────────────────────────────────────────────────────

export const ListJobCostsSchema = z.object({
  jobUuid: UuidSchema,
});

export const CreateJobCostSchema = z.object({
  jobIdentifier: z.string().describe("Job UUID or job number"),
  date: z.string().describe("YYYY-MM-DD"),
  description: z.string().optional(),
  quantity: z.number().optional(),
  unitCost: z.number().optional(),
  unitPrice: z.number().optional(),
  taxable: z.boolean().optional(),
  note: z.string().optional(),
  supplierUuid: UuidSchema.optional(),
});

export const UpdateJobCostSchema = z.object({
  costUuid: UuidSchema,
  date: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  unitCost: z.number().optional(),
  unitPrice: z.number().optional(),
  taxable: z.boolean().optional(),
});

// ─── Job Note schemas ─────────────────────────────────────────────────────────

export const CreateJobNoteSchema = z.object({
  jobUuid: UuidSchema,
  title: z.string().optional(),
  phase: z.string().optional(),
  description: z.string().describe("Note content"),
  date: z.string().optional().describe("YYYY-MM-DD"),
});

// ─── Timesheet schemas ────────────────────────────────────────────────────────

export const ListTimesheetsSchema = PaginationSchema.extend({
  staffUUID: UuidSchema.optional(),
  jobUUID: UuidSchema.optional(),
  updatedSince: z.string().optional().describe("YYYY-MM-DD"),
  startDate: z.string().optional().describe("YYYY-MM-DD"),
  endDate: z.string().optional().describe("YYYY-MM-DD"),
});

export const GetTimesheetSchema = z.object({ uuid: UuidSchema });

export const CreateTimesheetSchema = z.object({
  staffUUID: UuidSchema,
  jobUUID: UuidSchema,
  jobTaskUUID: UuidSchema.optional(),
  date: z.string().describe("YYYY-MM-DD"),
  minutes: z.number().int().min(1),
  note: z.string().optional(),
  billable: z.boolean().optional(),
});

export const UpdateTimesheetSchema = CreateTimesheetSchema.partial().extend({
  uuid: UuidSchema,
});

export const DeleteTimesheetSchema = z.object({ uuid: UuidSchema });

// ─── Staff schemas ────────────────────────────────────────────────────────────

export const ListStaffSchema = PaginationSchema.extend({
  updatedSince: z.string().optional().describe("YYYY-MM-DD"),
});

export const GetStaffSchema = z.object({ uuid: UuidSchema });

export const CreateStaffSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  billableRate: z.number().optional(),
  costRate: z.number().optional(),
});

export const UpdateStaffSchema = CreateStaffSchema.partial().extend({
  uuid: UuidSchema,
});

// ─── Task schemas ─────────────────────────────────────────────────────────────

export const ListTasksSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
});

export const GetTaskSchema = z.object({ uuid: UuidSchema });

export const CreateTaskSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  billable: z.boolean().optional(),
  billableRate: z.number().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({ uuid: UuidSchema });
export const DeleteTaskSchema = z.object({ uuid: UuidSchema });

// ─── Lead schemas ─────────────────────────────────────────────────────────────

export const ListLeadsSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
  status: z.string().optional(),
});

export const GetLeadSchema = z.object({ uuid: UuidSchema });

export const CreateLeadSchema = z.object({
  name: z.string(),
  categoryUUID: UuidSchema.optional(),
  clientUUID: UuidSchema.optional(),
  description: z.string().optional(),
  assignedStaffUUID: UuidSchema.optional(),
  estimatedValue: z.number().optional(),
  closedDate: z.string().optional(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({ uuid: UuidSchema });

// ─── Supplier schemas ─────────────────────────────────────────────────────────

export const ListSuppliersSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
});

export const GetSupplierSchema = z.object({ uuid: UuidSchema });

export const CreateSupplierSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
});

export const UpdateSupplierSchema = CreateSupplierSchema.partial().extend({ uuid: UuidSchema });
export const DeleteSupplierSchema = z.object({ uuid: UuidSchema });

export const GetSupplierContactSchema = z.object({ contactUuid: UuidSchema });

export const CreateSupplierContactSchema = z.object({
  supplierUuid: UuidSchema,
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
});

export const UpdateSupplierContactSchema = z.object({
  contactUuid: UuidSchema,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
});

export const DeleteSupplierContactSchema = z.object({ contactUuid: UuidSchema });

// ─── Purchase Order schemas ───────────────────────────────────────────────────

export const ListPurchaseOrdersSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
});

export const GetPurchaseOrderSchema = z.object({ uuid: UuidSchema });

export const CreatePurchaseOrderSchema = z.object({
  jobUUID: UuidSchema.optional(),
  supplierUUID: UuidSchema.optional(),
});

export const CreateBillSchema = z.object({
  purchaseOrderUuid: UuidSchema,
  amount: z.number(),
  date: z.string().describe("YYYY-MM-DD"),
});

export const CreateStockReceiptSchema = z.object({
  purchaseOrderUuid: UuidSchema,
  date: z.string().describe("YYYY-MM-DD"),
});

// ─── Custom Field schemas ─────────────────────────────────────────────────────

export const CreateCustomFieldSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

export const UpdateCustomFieldSchema = CreateCustomFieldSchema.partial().extend({
  uuid: UuidSchema,
});

// ─── Capacity Plan ────────────────────────────────────────────────────────────

export const ListCapacityPlanSchema = z.object({
  startDate: z.string().optional().describe("YYYY-MM-DD"),
  endDate: z.string().optional().describe("YYYY-MM-DD"),
  staffUUID: UuidSchema.optional(),
});

// ─── Quote ────────────────────────────────────────────────────────────────────

export const ListQuotesSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
  status: z.string().optional(),
});

export const GetQuoteSchema = z.object({ uuid: UuidSchema });

export const CreateQuoteForJobSchema = z.object({
  jobUuid: UuidSchema,
});

// ─── Invoice ──────────────────────────────────────────────────────────────────

export const ListInvoicesSchema = PaginationSchema.extend({
  updatedSince: z.string().optional(),
  status: z.string().optional(),
  clientUUID: UuidSchema.optional(),
});

export const GetInvoiceSchema = z.object({ uuid: UuidSchema });
