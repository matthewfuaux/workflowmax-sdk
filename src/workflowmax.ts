import { HttpClient } from "./client";
import { WFMClientConfig } from "./types";

import { ClientsResource } from "./resources/clients";
import { ClientGroupsResource } from "./resources/client-groups";
import { ClientContactsResource } from "./resources/client-contacts";
import { ClientDocumentsResource } from "./resources/client-documents";
import { JobsResource } from "./resources/jobs";
import { JobStaffResource } from "./resources/job-staff";
import { JobTasksResource } from "./resources/job-tasks";
import { JobCostsResource } from "./resources/job-costs";
import { TimesheetsResource } from "./resources/timesheets";
import { StaffResource } from "./resources/staff";
import { TasksResource } from "./resources/tasks";
import { CostsResource } from "./resources/costs";
import { LeadsResource } from "./resources/leads";
import { QuotesResource } from "./resources/quotes";
import { InvoicesResource } from "./resources/invoices";
import { PurchaseOrdersResource } from "./resources/purchase-orders";
import { SuppliersResource } from "./resources/suppliers";
import { CapacityPlanResource } from "./resources/capacity-plan";
import { CustomFieldsResource } from "./resources/custom-fields";
import {
  MeResource,
  AccountsResource,
  RolesResource,
  TaxesResource,
} from "./resources/me";

/**
 * Main WorkflowMax API client.
 *
 * @example
 * ```ts
 * const wfm = new WorkflowMax({
 *   accessToken: "your-access-token",
 *   accountId: "your-org-id",
 * });
 *
 * const clients = await wfm.clients.list({ status: "active", includes: ["contacts"] });
 * const client  = await wfm.clients.retrieve("uuid-here");
 * ```
 */
export class WorkflowMax {
  /** Authenticated user profile */
  readonly me: MeResource;
  /** Accounts accessible to the user */
  readonly accounts: AccountsResource;
  /** Organisation roles */
  readonly roles: RolesResource;
  /** Tax rates */
  readonly taxes: TaxesResource;
  /** Custom field definitions */
  readonly customFields: CustomFieldsResource;

  /** Clients */
  readonly clients: ClientsResource;
  /** Client groups */
  readonly clientGroups: ClientGroupsResource;
  /** Client contacts */
  readonly clientContacts: ClientContactsResource;
  /** Client documents */
  readonly clientDocuments: ClientDocumentsResource;

  /** Jobs */
  readonly jobs: JobsResource;
  /** Job staff assignments */
  readonly jobStaff: JobStaffResource;
  /** Job tasks */
  readonly jobTasks: JobTasksResource;
  /** Job costs */
  readonly jobCosts: JobCostsResource;

  /** Timesheets */
  readonly timesheets: TimesheetsResource;
  /** Capacity plan */
  readonly capacityPlan: CapacityPlanResource;

  /** Staff */
  readonly staff: StaffResource;
  /** Reusable task templates */
  readonly tasks: TasksResource;
  /** Standalone costs */
  readonly costs: CostsResource;

  /** Leads */
  readonly leads: LeadsResource;
  /** Quotes */
  readonly quotes: QuotesResource;
  /** Invoices */
  readonly invoices: InvoicesResource;

  /** Purchase orders */
  readonly purchaseOrders: PurchaseOrdersResource;
  /** Suppliers */
  readonly suppliers: SuppliersResource;

  constructor(config: WFMClientConfig) {
    const http = new HttpClient(config);

    this.me = new MeResource(http);
    this.accounts = new AccountsResource(http);
    this.roles = new RolesResource(http);
    this.taxes = new TaxesResource(http);
    this.customFields = new CustomFieldsResource(http);

    this.clients = new ClientsResource(http);
    this.clientGroups = new ClientGroupsResource(http);
    this.clientContacts = new ClientContactsResource(http);
    this.clientDocuments = new ClientDocumentsResource(http);

    this.jobs = new JobsResource(http);
    this.jobStaff = new JobStaffResource(http);
    this.jobTasks = new JobTasksResource(http);
    this.jobCosts = new JobCostsResource(http);

    this.timesheets = new TimesheetsResource(http);
    this.capacityPlan = new CapacityPlanResource(http);

    this.staff = new StaffResource(http);
    this.tasks = new TasksResource(http);
    this.costs = new CostsResource(http);

    this.leads = new LeadsResource(http);
    this.quotes = new QuotesResource(http);
    this.invoices = new InvoicesResource(http);

    this.purchaseOrders = new PurchaseOrdersResource(http);
    this.suppliers = new SuppliersResource(http);
  }
}
