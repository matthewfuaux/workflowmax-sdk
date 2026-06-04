/**
 * Tool registry — maps every endpoint to:
 *   - name:        unique tool identifier
 *   - description: human-readable summary for LLMs / MCP clients
 *   - schema:      Zod schema (convert to JSON Schema via zod-to-json-schema)
 *   - call:        function that executes the endpoint given a WorkflowMax instance
 *
 * Usage in an MCP server:
 *
 *   import { zodToJsonSchema } from "zod-to-json-schema";
 *   import { registry } from "wfm";
 *
 *   const tools = registry.map(t => ({
 *     name: t.name,
 *     description: t.description,
 *     inputSchema: zodToJsonSchema(t.schema),
 *   }));
 *
 *   // On tool call:
 *   const tool = registry.find(t => t.name === name);
 *   const parsed = tool.schema.parse(args);
 *   const result = await tool.call(wfm, parsed);
 */

import { z } from "zod";
import { WorkflowMax } from "./workflowmax";
import * as S from "./schemas";

export interface ToolDefinition<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string;
  description: string;
  schema: TSchema;
  call: (wfm: WorkflowMax, args: z.infer<TSchema>) => Promise<unknown>;
}

function tool<TSchema extends z.ZodTypeAny>(
  def: ToolDefinition<TSchema>
): ToolDefinition<TSchema> {
  return def;
}

export const registry: ToolDefinition[] = [
  // ─── Me ──────────────────────────────────────────────────────────────────
  tool({
    name: "me.get",
    description: "Get the authenticated user's profile.",
    schema: z.object({}),
    call: (wfm) => wfm.me.get(),
  }),

  // ─── Accounts ─────────────────────────────────────────────────────────────
  tool({
    name: "accounts.list",
    description: "List WorkflowMax accounts accessible to the authenticated user.",
    schema: z.object({}),
    call: (wfm) => wfm.accounts.list(),
  }),

  // ─── Roles ────────────────────────────────────────────────────────────────
  tool({
    name: "roles.list",
    description: "List all roles configured in the organisation.",
    schema: z.object({}),
    call: (wfm) => wfm.roles.list(),
  }),

  // ─── Taxes ────────────────────────────────────────────────────────────────
  tool({
    name: "taxes.list",
    description: "List all tax rates configured in the organisation.",
    schema: z.object({}),
    call: (wfm) => wfm.taxes.list(),
  }),

  // ─── Custom Fields ────────────────────────────────────────────────────────
  tool({
    name: "customFields.list",
    description: "List all custom field definitions.",
    schema: z.object({}),
    call: (wfm) => wfm.customFields.list(),
  }),
  tool({
    name: "customFields.create",
    description: "Create a new custom field definition.",
    schema: S.CreateCustomFieldSchema,
    call: (wfm, args) => wfm.customFields.create(args),
  }),
  tool({
    name: "customFields.update",
    description: "Update an existing custom field definition by UUID.",
    schema: S.UpdateCustomFieldSchema,
    call: (wfm, { uuid, ...body }) => wfm.customFields.update(uuid, body),
  }),

  // ─── Clients ──────────────────────────────────────────────────────────────
  tool({
    name: "clients.list",
    description:
      "List clients with optional filtering by name, status, and last-updated date. " +
      "Use `includes` to sideload addresses, contacts, billing-details, etc.",
    schema: S.ListClientsSchema,
    call: (wfm, args) => wfm.clients.list(args),
  }),
  tool({
    name: "clients.retrieve",
    description: "Get a single client by UUID.",
    schema: S.GetClientSchema,
    call: (wfm, { uuid, ...params }) => wfm.clients.retrieve(uuid, params),
  }),
  tool({
    name: "clients.create",
    description:
      "Create a new client. Provide `name` for non-individual business structures, " +
      "or `firstName` + `lastName` for individuals.",
    schema: S.CreateClientSchema,
    call: (wfm, args) => wfm.clients.create(args),
  }),
  tool({
    name: "clients.update",
    description: "Update an existing client by UUID.",
    schema: S.UpdateClientSchema,
    call: (wfm, { uuid, ...body }) => wfm.clients.update(uuid, body),
  }),
  tool({
    name: "clients.listBusinessStructures",
    description: "List available business structures (e.g. Company, Individual, Partnership).",
    schema: z.object({}),
    call: (wfm) => wfm.clients.listBusinessStructures(),
  }),
  tool({
    name: "clients.listClientTypes",
    description: "List available client types.",
    schema: z.object({}),
    call: (wfm) => wfm.clients.listClientTypes(),
  }),

  // ─── Client Groups ────────────────────────────────────────────────────────
  tool({
    name: "clientGroups.list",
    description: "List all client groups.",
    schema: z.object({}),
    call: (wfm) => wfm.clientGroups.list(),
  }),
  tool({
    name: "clientGroups.retrieve",
    description: "Get a single client group by UUID.",
    schema: S.ClientGroupUuidSchema,
    call: (wfm, { uuid }) => wfm.clientGroups.retrieve(uuid),
  }),
  tool({
    name: "clientGroups.create",
    description: "Create a new client group.",
    schema: S.CreateClientGroupSchema,
    call: (wfm, args) => wfm.clientGroups.create(args),
  }),
  tool({
    name: "clientGroups.update",
    description: "Update an existing client group by UUID.",
    schema: S.UpdateClientGroupSchema,
    call: (wfm, { uuid, ...body }) => wfm.clientGroups.update(uuid, body),
  }),
  tool({
    name: "clientGroups.delete",
    description: "Delete a client group by UUID.",
    schema: S.ClientGroupUuidSchema,
    call: (wfm, { uuid }) => wfm.clientGroups.delete(uuid),
  }),
  tool({
    name: "clientGroups.addClient",
    description: "Add a client to a client group.",
    schema: S.ClientGroupClientSchema,
    call: (wfm, { groupUuid, clientUuid }) =>
      wfm.clientGroups.addClient(groupUuid, clientUuid),
  }),
  tool({
    name: "clientGroups.removeClient",
    description: "Remove a client from a client group.",
    schema: S.ClientGroupClientSchema,
    call: (wfm, { groupUuid, clientUuid }) =>
      wfm.clientGroups.removeClient(groupUuid, clientUuid),
  }),

  // ─── Client Contacts ──────────────────────────────────────────────────────
  tool({
    name: "clientContacts.retrieve",
    description: "Get a contact by its UUID.",
    schema: S.ContactUuidSchema,
    call: (wfm, { contactUuid }) => wfm.clientContacts.retrieve(contactUuid),
  }),
  tool({
    name: "clientContacts.create",
    description: "Create a standalone contact (not yet attached to a specific client).",
    schema: S.CreateContactSchema,
    call: (wfm, args) => wfm.clientContacts.create(args),
  }),
  tool({
    name: "clientContacts.update",
    description: "Update a contact by its UUID.",
    schema: S.UpdateContactSchema,
    call: (wfm, { contactUuid, ...body }) =>
      wfm.clientContacts.update(contactUuid, body),
  }),
  tool({
    name: "clientContacts.delete",
    description: "Delete a contact by its UUID.",
    schema: S.ContactUuidSchema,
    call: (wfm, { contactUuid }) => wfm.clientContacts.delete(contactUuid),
  }),
  tool({
    name: "clientContacts.createForClient",
    description: "Create a contact and attach it directly to a specific client.",
    schema: S.CreateContactForClientSchema,
    call: (wfm, { clientUuid, ...body }) =>
      wfm.clientContacts.createForClient(clientUuid, body),
  }),
  tool({
    name: "clientContacts.updateForClient",
    description: "Update a contact scoped to a specific client.",
    schema: S.UpdateContactForClientSchema,
    call: (wfm, { clientUuid, contactUuid, ...body }) =>
      wfm.clientContacts.updateForClient(clientUuid, contactUuid, body),
  }),
  tool({
    name: "clientContacts.deleteForClient",
    description: "Delete a contact scoped to a specific client.",
    schema: S.DeleteContactForClientSchema,
    call: (wfm, { clientUuid, contactUuid }) =>
      wfm.clientContacts.deleteForClient(clientUuid, contactUuid),
  }),

  // ─── Jobs ─────────────────────────────────────────────────────────────────
  tool({
    name: "jobs.list",
    description:
      "List all jobs. Filter by client, status or last-updated date. " +
      "Use `includes` to sideload tasks, staff, costs, notes, or documents.",
    schema: S.ListJobsSchema,
    call: (wfm, args) => wfm.jobs.list(args),
  }),
  tool({
    name: "jobs.retrieve",
    description: "Get a single job by UUID or job number.",
    schema: S.GetJobSchema,
    call: (wfm, { identifier, ...params }) => wfm.jobs.retrieve(identifier, params),
  }),
  tool({
    name: "jobs.create",
    description: "Create a new job.",
    schema: S.CreateJobSchema,
    call: (wfm, args) => wfm.jobs.create(args),
  }),
  tool({
    name: "jobs.update",
    description: "Update an existing job by UUID or job number.",
    schema: S.UpdateJobSchema,
    call: (wfm, { identifier, ...body }) => wfm.jobs.update(identifier, body),
  }),
  tool({
    name: "jobs.delete",
    description: "Delete a job by UUID or job number.",
    schema: S.DeleteJobSchema,
    call: (wfm, { identifier }) => wfm.jobs.delete(identifier),
  }),
  tool({
    name: "jobs.applyTemplate",
    description: "Apply a job template to an existing job.",
    schema: S.ApplyJobTemplateSchema,
    call: (wfm, { jobUuid, templateUuid }) =>
      wfm.jobs.applyTemplate(jobUuid, templateUuid),
  }),
  tool({
    name: "jobs.createNote",
    description: "Add a note to a job.",
    schema: S.CreateJobNoteSchema,
    call: (wfm, { jobUuid, ...body }) => wfm.jobs.createNote(jobUuid, body),
  }),
  tool({
    name: "jobs.listDocuments",
    description: "List all documents attached to a job.",
    schema: z.object({ jobUuid: S.UuidSchema }),
    call: (wfm, { jobUuid }) => wfm.jobs.listDocuments(jobUuid),
  }),
  tool({
    name: "jobs.listTemplates",
    description: "List available job templates.",
    schema: z.object({}),
    call: (wfm) => wfm.jobs.listTemplates(),
  }),
  tool({
    name: "jobs.listCategories",
    description: "List available job categories.",
    schema: z.object({}),
    call: (wfm) => wfm.jobs.listCategories(),
  }),
  tool({
    name: "jobs.listStatuses",
    description: "List available job statuses.",
    schema: z.object({}),
    call: (wfm) => wfm.jobs.listStatuses(),
  }),

  // ─── Job Staff ────────────────────────────────────────────────────────────
  tool({
    name: "jobStaff.create",
    description: "Assign a staff member to a job.",
    schema: S.CreateJobStaffSchema,
    call: (wfm, { jobIdentifier, ...body }) =>
      wfm.jobStaff.create(jobIdentifier, body),
  }),
  tool({
    name: "jobStaff.update",
    description: "Update a staff assignment on a job.",
    schema: S.UpdateJobStaffSchema,
    call: (wfm, { jobIdentifier, ...body }) =>
      wfm.jobStaff.update(jobIdentifier, body),
  }),
  tool({
    name: "jobStaff.delete",
    description: "Remove a staff member from a job.",
    schema: S.DeleteJobStaffSchema,
    call: (wfm, { jobIdentifier, staffUuid }) =>
      wfm.jobStaff.delete(jobIdentifier, staffUuid),
  }),

  // ─── Job Tasks ────────────────────────────────────────────────────────────
  tool({
    name: "jobTasks.list",
    description: "List all job-task assignments, optionally filtered by job UUID.",
    schema: S.ListJobTasksSchema,
    call: (wfm, args) => wfm.jobTasks.list(args),
  }),
  tool({
    name: "jobTasks.create",
    description: "Add a task to a job.",
    schema: S.CreateJobTaskSchema,
    call: (wfm, { jobIdentifier, ...body }) =>
      wfm.jobTasks.create(jobIdentifier, body),
  }),
  tool({
    name: "jobTasks.update",
    description: "Update a job task by its job-task UUID.",
    schema: S.UpdateJobTaskSchema,
    call: (wfm, { jobTaskUuid, ...body }) =>
      wfm.jobTasks.update(jobTaskUuid, body),
  }),
  tool({
    name: "jobTasks.delete",
    description: "Remove a task from a job by its job-task UUID.",
    schema: S.DeleteJobTaskSchema,
    call: (wfm, { jobTaskUuid }) => wfm.jobTasks.delete(jobTaskUuid),
  }),

  // ─── Job Costs ────────────────────────────────────────────────────────────
  tool({
    name: "jobCosts.list",
    description: "List all costs for a specific job.",
    schema: S.ListJobCostsSchema,
    call: (wfm, { jobUuid }) => wfm.jobCosts.list(jobUuid),
  }),
  tool({
    name: "jobCosts.create",
    description: "Add a cost to a job.",
    schema: S.CreateJobCostSchema,
    call: (wfm, { jobIdentifier, ...body }) =>
      wfm.jobCosts.create(jobIdentifier, body),
  }),
  tool({
    name: "jobCosts.update",
    description: "Update a job cost by its cost UUID.",
    schema: S.UpdateJobCostSchema,
    call: (wfm, { costUuid, ...body }) => wfm.jobCosts.update(costUuid, body),
  }),

  // ─── Timesheets ───────────────────────────────────────────────────────────
  tool({
    name: "timesheets.list",
    description:
      "List timesheet entries. Filter by staff, job, or date range.",
    schema: S.ListTimesheetsSchema,
    call: (wfm, args) => wfm.timesheets.list(args),
  }),
  tool({
    name: "timesheets.retrieve",
    description: "Get a single timesheet entry by UUID.",
    schema: S.GetTimesheetSchema,
    call: (wfm, { uuid }) => wfm.timesheets.retrieve(uuid),
  }),
  tool({
    name: "timesheets.create",
    description: "Create a new timesheet entry.",
    schema: S.CreateTimesheetSchema,
    call: (wfm, args) => wfm.timesheets.create(args),
  }),
  tool({
    name: "timesheets.update",
    description: "Update a timesheet entry by UUID.",
    schema: S.UpdateTimesheetSchema,
    call: (wfm, { uuid, ...body }) => wfm.timesheets.update(uuid, body),
  }),
  tool({
    name: "timesheets.delete",
    description: "Delete a timesheet entry by UUID.",
    schema: S.DeleteTimesheetSchema,
    call: (wfm, { uuid }) => wfm.timesheets.delete(uuid),
  }),

  // ─── Capacity Plan ────────────────────────────────────────────────────────
  tool({
    name: "capacityPlan.list",
    description: "Get capacity plan data. Filter by date range or staff UUID.",
    schema: S.ListCapacityPlanSchema,
    call: (wfm, args) => wfm.capacityPlan.list(args),
  }),

  // ─── Staff ────────────────────────────────────────────────────────────────
  tool({
    name: "staff.list",
    description: "List all staff members.",
    schema: S.ListStaffSchema,
    call: (wfm, args) => wfm.staff.list(args),
  }),
  tool({
    name: "staff.retrieve",
    description: "Get a single staff member by UUID.",
    schema: S.GetStaffSchema,
    call: (wfm, { uuid }) => wfm.staff.retrieve(uuid),
  }),
  tool({
    name: "staff.create",
    description: "Create a new staff member.",
    schema: S.CreateStaffSchema,
    call: (wfm, args) => wfm.staff.create(args),
  }),
  tool({
    name: "staff.update",
    description: "Update an existing staff member by UUID.",
    schema: S.UpdateStaffSchema,
    call: (wfm, { uuid, ...body }) => wfm.staff.update(uuid, body),
  }),

  // ─── Tasks (reusable templates) ───────────────────────────────────────────
  tool({
    name: "tasks.list",
    description: "List all reusable task definitions.",
    schema: S.ListTasksSchema,
    call: (wfm, args) => wfm.tasks.list(args),
  }),
  tool({
    name: "tasks.retrieve",
    description: "Get a single task definition by UUID.",
    schema: S.GetTaskSchema,
    call: (wfm, { uuid }) => wfm.tasks.retrieve(uuid),
  }),
  tool({
    name: "tasks.create",
    description: "Create a new reusable task definition.",
    schema: S.CreateTaskSchema,
    call: (wfm, args) => wfm.tasks.create(args),
  }),
  tool({
    name: "tasks.update",
    description: "Update a task definition by UUID.",
    schema: S.UpdateTaskSchema,
    call: (wfm, { uuid, ...body }) => wfm.tasks.update(uuid, body),
  }),
  tool({
    name: "tasks.delete",
    description: "Delete a task definition by UUID.",
    schema: S.DeleteTaskSchema,
    call: (wfm, { uuid }) => wfm.tasks.delete(uuid),
  }),

  // ─── Leads ────────────────────────────────────────────────────────────────
  tool({
    name: "leads.list",
    description: "List all leads.",
    schema: S.ListLeadsSchema,
    call: (wfm, args) => wfm.leads.list(args),
  }),
  tool({
    name: "leads.retrieve",
    description: "Get a single lead by UUID.",
    schema: S.GetLeadSchema,
    call: (wfm, { uuid }) => wfm.leads.retrieve(uuid),
  }),
  tool({
    name: "leads.create",
    description: "Create a new lead.",
    schema: S.CreateLeadSchema,
    call: (wfm, args) => wfm.leads.create(args),
  }),
  tool({
    name: "leads.update",
    description: "Update a lead by UUID.",
    schema: S.UpdateLeadSchema,
    call: (wfm, { uuid, ...body }) => wfm.leads.update(uuid, body),
  }),
  tool({
    name: "leads.listCategories",
    description: "List available lead categories.",
    schema: z.object({}),
    call: (wfm) => wfm.leads.listCategories(),
  }),
  tool({
    name: "leads.listDocuments",
    description: "List documents attached to a lead.",
    schema: z.object({ leadUuid: S.UuidSchema }),
    call: (wfm, { leadUuid }) => wfm.leads.listDocuments(leadUuid),
  }),

  // ─── Quotes ───────────────────────────────────────────────────────────────
  tool({
    name: "quotes.list",
    description: "List all quotes.",
    schema: S.ListQuotesSchema,
    call: (wfm, args) => wfm.quotes.list(args),
  }),
  tool({
    name: "quotes.retrieve",
    description: "Get a single quote by UUID.",
    schema: S.GetQuoteSchema,
    call: (wfm, { uuid }) => wfm.quotes.retrieve(uuid),
  }),
  tool({
    name: "quotes.createForJob",
    description: "Create a quote for a specific job.",
    schema: S.CreateQuoteForJobSchema,
    call: (wfm, { jobUuid }) => wfm.quotes.createForJob(jobUuid),
  }),
  tool({
    name: "quotes.listNotes",
    description: "List all quote notes.",
    schema: z.object({}),
    call: (wfm) => wfm.quotes.listNotes(),
  }),
  tool({
    name: "quotes.listDocuments",
    description: "List documents attached to a quote.",
    schema: z.object({ quoteUuid: S.UuidSchema }),
    call: (wfm, { quoteUuid }) => wfm.quotes.listDocuments(quoteUuid),
  }),

  // ─── Invoices ─────────────────────────────────────────────────────────────
  tool({
    name: "invoices.list",
    description: "List all invoices.",
    schema: S.ListInvoicesSchema,
    call: (wfm, args) => wfm.invoices.list(args),
  }),
  tool({
    name: "invoices.retrieve",
    description: "Get a single invoice by UUID.",
    schema: S.GetInvoiceSchema,
    call: (wfm, { uuid }) => wfm.invoices.retrieve(uuid),
  }),
  tool({
    name: "invoices.listCosts",
    description: "List costs on a specific invoice.",
    schema: z.object({ invoiceUuid: S.UuidSchema }),
    call: (wfm, { invoiceUuid }) => wfm.invoices.listCosts(invoiceUuid),
  }),
  tool({
    name: "invoices.listNotes",
    description: "List all invoice notes.",
    schema: z.object({}),
    call: (wfm) => wfm.invoices.listNotes(),
  }),
  tool({
    name: "invoices.listPayments",
    description: "List all payments.",
    schema: z.object({}),
    call: (wfm) => wfm.invoices.listPayments(),
  }),

  // ─── Purchase Orders ──────────────────────────────────────────────────────
  tool({
    name: "purchaseOrders.list",
    description: "List all purchase orders.",
    schema: S.ListPurchaseOrdersSchema,
    call: (wfm, args) => wfm.purchaseOrders.list(args),
  }),
  tool({
    name: "purchaseOrders.retrieve",
    description: "Get a single purchase order by UUID.",
    schema: S.GetPurchaseOrderSchema,
    call: (wfm, { uuid }) => wfm.purchaseOrders.retrieve(uuid),
  }),
  tool({
    name: "purchaseOrders.create",
    description: "Create a new purchase order.",
    schema: S.CreatePurchaseOrderSchema,
    call: (wfm, args) => wfm.purchaseOrders.create(args),
  }),
  tool({
    name: "purchaseOrders.listBills",
    description: "List all bills across purchase orders.",
    schema: z.object({}),
    call: (wfm) => wfm.purchaseOrders.listBills(),
  }),
  tool({
    name: "purchaseOrders.createBill",
    description: "Add a bill to a purchase order.",
    schema: S.CreateBillSchema,
    call: (wfm, { purchaseOrderUuid, ...body }) =>
      wfm.purchaseOrders.createBill(purchaseOrderUuid, body),
  }),
  tool({
    name: "purchaseOrders.listStockReceipts",
    description: "List all stock receipts across purchase orders.",
    schema: z.object({}),
    call: (wfm) => wfm.purchaseOrders.listStockReceipts(),
  }),
  tool({
    name: "purchaseOrders.createStockReceipt",
    description: "Add a stock receipt to a purchase order.",
    schema: S.CreateStockReceiptSchema,
    call: (wfm, { purchaseOrderUuid, ...body }) =>
      wfm.purchaseOrders.createStockReceipt(purchaseOrderUuid, body),
  }),
  tool({
    name: "purchaseOrders.listDocuments",
    description: "List documents attached to a purchase order.",
    schema: z.object({ purchaseOrderUuid: S.UuidSchema }),
    call: (wfm, { purchaseOrderUuid }) =>
      wfm.purchaseOrders.listDocuments(purchaseOrderUuid),
  }),

  // ─── Suppliers ────────────────────────────────────────────────────────────
  tool({
    name: "suppliers.list",
    description: "List all suppliers.",
    schema: S.ListSuppliersSchema,
    call: (wfm, args) => wfm.suppliers.list(args),
  }),
  tool({
    name: "suppliers.retrieve",
    description: "Get a single supplier by UUID.",
    schema: S.GetSupplierSchema,
    call: (wfm, { uuid }) => wfm.suppliers.retrieve(uuid),
  }),
  tool({
    name: "suppliers.create",
    description: "Create a new supplier.",
    schema: S.CreateSupplierSchema,
    call: (wfm, args) => wfm.suppliers.create(args),
  }),
  tool({
    name: "suppliers.update",
    description: "Update a supplier by UUID.",
    schema: S.UpdateSupplierSchema,
    call: (wfm, { uuid, ...body }) => wfm.suppliers.update(uuid, body),
  }),
  tool({
    name: "suppliers.delete",
    description: "Delete a supplier by UUID.",
    schema: S.DeleteSupplierSchema,
    call: (wfm, { uuid }) => wfm.suppliers.delete(uuid),
  }),
  tool({
    name: "suppliers.retrieveContact",
    description: "Get a supplier contact by UUID.",
    schema: S.GetSupplierContactSchema,
    call: (wfm, { contactUuid }) => wfm.suppliers.retrieveContact(contactUuid),
  }),
  tool({
    name: "suppliers.createContact",
    description: "Add a contact to a supplier.",
    schema: S.CreateSupplierContactSchema,
    call: (wfm, { supplierUuid, ...body }) =>
      wfm.suppliers.createContact(supplierUuid, body),
  }),
  tool({
    name: "suppliers.updateContact",
    description: "Update a supplier contact by UUID.",
    schema: S.UpdateSupplierContactSchema,
    call: (wfm, { contactUuid, ...body }) =>
      wfm.suppliers.updateContact(contactUuid, body),
  }),
  tool({
    name: "suppliers.deleteContact",
    description: "Delete a supplier contact by UUID.",
    schema: S.DeleteSupplierContactSchema,
    call: (wfm, { contactUuid }) => wfm.suppliers.deleteContact(contactUuid),
  }),
  tool({
    name: "suppliers.listDocuments",
    description: "List documents attached to a supplier.",
    schema: z.object({ supplierUuid: S.UuidSchema }),
    call: (wfm, { supplierUuid }) => wfm.suppliers.listDocuments(supplierUuid),
  }),
];

/** Look up a single tool by name. */
export function getTool(name: string): ToolDefinition | undefined {
  return registry.find((t) => t.name === name);
}
