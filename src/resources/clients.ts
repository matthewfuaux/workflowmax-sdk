import { HttpClient } from "../client";
import {
  Client,
  CreateClientBody,
  ListClientsParams,
  UpdateClientBody,
  WFMListResponse,
  WFMResponse,
  BusinessStructure,
  ClientType,
} from "../types";

export class ClientsResource {
  constructor(private http: HttpClient) {}

  /**
   * List all clients. Use `includes` to sideload related data
   * (addresses, contacts, contact-details, billing-details,
   * client-groups, client-relationships, custom-fields, notes, documents).
   */
  list(params?: ListClientsParams): Promise<WFMListResponse<Client>> {
    const { includes, ...rest } = params ?? {};
    return this.http.getList<Client>("/v2/clients", {
      ...rest,
      includes: this.http.includesParam(includes),
    });
  }

  /**
   * Get a single client by UUID.
   */
  retrieve(
    uuid: string,
    params?: { includes?: ListClientsParams["includes"] }
  ): Promise<WFMResponse<Client>> {
    return this.http.get<Client>(`/v2/clients/${uuid}`, {
      includes: this.http.includesParam(params?.includes),
    });
  }

  /**
   * Create a new client.
   * - Non-individual: provide `name`
   * - Individual: provide `firstName` + `lastName`
   */
  create(body: CreateClientBody): Promise<WFMResponse<Client>> {
    return this.http.post<Client>("/v2/clients", body);
  }

  /**
   * Update an existing client by UUID.
   */
  update(uuid: string, body: UpdateClientBody): Promise<WFMResponse<Client>> {
    return this.http.put<Client>(`/v2/clients/${uuid}`, body);
  }

  /**
   * List available business structures (Company, Individual, Partnership, etc.).
   */
  listBusinessStructures(): Promise<WFMListResponse<BusinessStructure>> {
    return this.http.getList<BusinessStructure>("/v2/businessstructures");
  }

  /**
   * List available client types.
   */
  listClientTypes(): Promise<WFMListResponse<ClientType>> {
    return this.http.getList<ClientType>("/v2/clienttypes");
  }
}
