# WorkflowMax SDK

TypeScript SDK for the [WorkflowMax V2 API](https://api-docs.workflowmax.com).

- Full coverage of all V2 endpoints
- Typed request bodies and responses
- Built-in Zod schemas for every endpoint — ready to drop into an MCP server
- OAuth 2.0 helpers (authorise, obtain tokens, refresh, decode org ID)

---

## Installation

```bash
npm install wfm
```

---

## Quick start

```ts
import { WorkflowMax } from "workflowmax-sdk";

const wfm = new WorkflowMax({
  accessToken: "your-access-token",
  accountId: "your-org-id", // decoded from the JWT — see Auth below
});

// List active clients, sideloading contacts and billing details
const { data: clients } = await wfm.clients.list({
  status: "active",
  includes: ["contacts", "billing-details"],
});

// Create a client
const { data: client } = await wfm.clients.create({
  name: "Acme Corp",
  businessStructureUuid: "...",
  clientManagerUuid: "...",
});

// Add a contact to a client
await wfm.clientContacts.createForClient(client.uuid!, {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@acme.com",
});
```

---

## Authentication

WorkflowMax uses OAuth 2.0 Authorization Code flow.

**Token expiry:** access tokens last 30 minutes; refresh tokens last 60 days.

```ts
import {
  buildAuthoriseUrl,
  obtainTokens,
  refreshTokens,
  decodeOrgId,
} from "workflowmax-sdk";

// 1. Redirect the user to WorkflowMax to authorise
const url = buildAuthoriseUrl({
  clientId: "your-client-id",
  redirectUri: "https://yourapp.com/callback",
  // scope defaults to: openid email profile workflowmax offline_access
});

// 2. After redirect, exchange the code for tokens
const tokens = await obtainTokens({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  code: "code-from-query-string",
  redirectUri: "https://yourapp.com/callback",
});

// 3. Decode the org ID from the access token (required as accountId)
const accountId = decodeOrgId(tokens.access_token);

// 4. Construct the client
const wfm = new WorkflowMax({
  accessToken: tokens.access_token,
  accountId: accountId!,
});

// 5. Refresh when the access token expires
const refreshed = await refreshTokens({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  refreshToken: tokens.refresh_token,
});
```

> **Tip:** The `accountId` is the organisation ID embedded in the JWT. You only need to decode it once per token — then store it alongside the tokens.

---

## API reference

### `WorkflowMax` resources

| Property              | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `wfm.me`              | Authenticated user profile                                      |
| `wfm.accounts`        | Accounts accessible to the user                                 |
| `wfm.roles`           | Organisation roles                                              |
| `wfm.taxes`           | Tax rates                                                       |
| `wfm.customFields`    | Custom field definitions                                        |
| `wfm.clients`         | Client CRUD + business structures + client types                |
| `wfm.clientGroups`    | Client group CRUD + add/remove clients                          |
| `wfm.clientContacts`  | Contact CRUD, standalone and client-scoped                      |
| `wfm.clientDocuments` | List and upload client documents                                |
| `wfm.jobs`            | Job CRUD + notes + documents + template/category/status lookups |
| `wfm.jobStaff`        | Assign / update / remove staff on a job                         |
| `wfm.jobTasks`        | Add / update / remove tasks on a job                            |
| `wfm.jobCosts`        | List / add / update costs on a job                              |
| `wfm.timesheets`      | Timesheet CRUD                                                  |
| `wfm.capacityPlan`    | Capacity plan data                                              |
| `wfm.staff`           | Staff CRUD                                                      |
| `wfm.tasks`           | Reusable task template CRUD                                     |
| `wfm.costs`           | Standalone cost CRUD                                            |
| `wfm.leads`           | Lead CRUD + categories + documents                              |
| `wfm.quotes`          | Quotes + create for job + notes + documents                     |
| `wfm.invoices`        | Invoices + costs + notes + payments                             |
| `wfm.purchaseOrders`  | Purchase orders + bills + stock receipts + documents            |
| `wfm.suppliers`       | Supplier CRUD + contacts + documents                            |

### Common patterns

Every resource follows the same method naming:

| Method                | Description                          |
| --------------------- | ------------------------------------ |
| `.list(params?)`      | Paginated list with optional filters |
| `.retrieve(uuid)`     | Single record by UUID                |
| `.create(body)`       | Create new record                    |
| `.update(uuid, body)` | Update existing record               |
| `.delete(uuid)`       | Delete record                        |

List responses return `{ data: T[], total: number }`.
Single-record responses return `{ data: T, status: number }`.

### Pagination and filtering

```ts
const { data, total } = await wfm.clients.list({
  page: 1,
  pageSize: 50,
  status: "active",
  updatedSince: "2024-01-01",
  sort: "updated",
  order: "desc",
  includes: ["addresses", "contacts", "billing-details"],
});
```

### Sideloading related data

Many endpoints accept an `includes` array to avoid extra round trips:

```ts
// Clients: addresses | contacts | contact-details | billing-details |
//          client-groups | client-relationships | custom-fields | notes | documents
await wfm.clients.list({ includes: ["contacts", "custom-fields"] });

// Jobs: tasks | staff | costs | notes | custom-fields | documents
await wfm.jobs.retrieve(uuid, { includes: ["tasks", "staff"] });
```

---

## MCP server integration

The package ships a **tool registry** — every endpoint pre-defined with a name, description, and Zod input schema. This makes it trivial to build a [Model Context Protocol](https://modelcontextprotocol.io) server.

### Install the JSON Schema converter

```bash
npm install zod-to-json-schema @modelcontextprotocol/sdk
```

### Wire up the MCP server

```ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { WorkflowMax, registry, getTool } from "workflowmax-sdk";

const wfm = new WorkflowMax({
  accessToken: process.env.WFM_ACCESS_TOKEN!,
  accountId: process.env.WFM_ACCOUNT_ID!,
});

const server = new Server({ name: "workflowmax", version: "1.0.0" });

server.setRequestHandler("tools/list", async () => ({
  tools: registry.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: zodToJsonSchema(t.schema),
  })),
}));

server.setRequestHandler("tools/call", async (req) => {
  const tool = getTool(req.params.name);
  if (!tool) throw new Error(`Unknown tool: ${req.params.name}`);

  const args = tool.schema.parse(req.params.arguments);
  const result = await tool.call(wfm, args);

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
});

await server.connect(new StdioServerTransport());
```

That's it — all ~90 WorkflowMax endpoints are automatically exposed as MCP tools with descriptions and validated inputs.

### Using a subset of tools

```ts
import { registry } from "workflowmax-sdk";

// Only expose read-only tools
const readOnlyTools = registry.filter(
  (t) => t.name.includes(".list") || t.name.includes(".retrieve"),
);
```

### Using schemas directly

```ts
import { schemas } from "workflowmax-sdk";

// Validate args before calling
const args = schemas.CreateClientSchema.parse(rawInput);
```

---

## Examples

### Create a job with tasks and staff

```ts
// 1. Create the job
const { data: job } = await wfm.jobs.create({
  name: "Website Redesign",
  clientUUID: clientUuid,
  dueDate: "2025-03-31",
});

// 2. Add a task
await wfm.jobTasks.create(job.uuid!, { taskUUID: taskUuid, billable: true });

// 3. Assign staff
await wfm.jobStaff.create(job.uuid!, {
  staffUUID: staffUuid,
  billableRate: 150,
});

// 4. Log time
await wfm.timesheets.create({
  staffUUID: staffUuid,
  jobUUID: job.uuid!,
  date: "2025-01-15",
  minutes: 120,
  note: "Initial discovery call",
});
```

### Manage client groups

```ts
// Create a group
const { data } = await wfm.clientGroups.create({
  name: "Premium Clients",
  taxable: true,
});
const groupUuid = data.data.uuid!;

// Add clients
await wfm.clientGroups.addClient(groupUuid, clientUuidA);
await wfm.clientGroups.addClient(groupUuid, clientUuidB);

// Remove a client
await wfm.clientGroups.removeClient(groupUuid, clientUuidA);
```

### Upload a document to a client

```ts
import { readFileSync } from "fs";

const file = readFileSync("./contract.pdf");

await wfm.clientDocuments.upload(clientUuid, file, {
  title: "Service Agreement",
  fileName: "contract.pdf",
  note: "Signed 2025-01-10",
});
```

### Refresh tokens automatically

```ts
import { refreshTokens, WorkflowMax } from "workflowmax-sdk";

async function getClient(stored: {
  accessToken: string;
  refreshToken: string;
  accountId: string;
}) {
  // Check expiry however you store it, then refresh if needed
  const refreshed = await refreshTokens({
    clientId: process.env.WFM_CLIENT_ID!,
    clientSecret: process.env.WFM_CLIENT_SECRET!,
    refreshToken: stored.refreshToken,
  });

  return new WorkflowMax({
    accessToken: refreshed.access_token,
    accountId: stored.accountId,
  });
}
```

---

## Rate limiting

The API allows **60 requests per minute** per client–organisation pair. When exceeded it returns HTTP 429 with a `Retry-After` header.

Implement exponential back-off in production:

```ts
import axios from "axios";

axios.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 429) {
    const retryAfter = Number(error.response.headers["retry-after"] ?? 5);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return axios(error.config);
  }
  throw error;
});
```

---

## License

MIT
