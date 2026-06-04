import { HttpClient } from "../client";
import {
  ClientGroup,
  CreateClientGroupBody,
  UpdateClientGroupBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class ClientGroupsResource {
  constructor(private http: HttpClient) {}

  /** List all client groups. */
  list(): Promise<WFMListResponse<ClientGroup>> {
    return this.http.getList<ClientGroup>("/v2/client-groups");
  }

  /** Get a single client group by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<ClientGroup>> {
    return this.http.get<ClientGroup>(`/v2/client-groups/${uuid}`);
  }

  /** Create a new client group. */
  create(body: CreateClientGroupBody): Promise<WFMResponse<{ data: ClientGroup }>> {
    return this.http.post<{ data: ClientGroup }>("/v2/client-groups", body);
  }

  /** Update an existing client group by UUID. */
  update(
    uuid: string,
    body: UpdateClientGroupBody
  ): Promise<WFMResponse<ClientGroup>> {
    return this.http.put<ClientGroup>(`/v2/client-groups/${uuid}`, body);
  }

  /** Delete a client group by UUID. */
  delete(uuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/client-groups/${uuid}`);
  }

  /** Add a client to a client group. */
  addClient(
    groupUuid: string,
    clientUuid: string
  ): Promise<WFMResponse<ClientGroup>> {
    return this.http.post<ClientGroup>(
      `/v2/client-groups/${groupUuid}/client`,
      { uuid: clientUuid }
    );
  }

  /** Remove a client from a client group. */
  removeClient(
    groupUuid: string,
    clientUuid: string
  ): Promise<WFMResponse<void>> {
    return this.http.delete(
      `/v2/client-groups/${groupUuid}/client`,
      { data: { uuid: clientUuid } }
    );
  }
}
