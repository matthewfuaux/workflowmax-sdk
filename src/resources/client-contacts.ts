import { HttpClient } from "../client";
import {
  ClientContact,
  CreateClientContactBody,
  UpdateClientContactBody,
  WFMResponse,
} from "../types";

export class ClientContactsResource {
  constructor(private http: HttpClient) {}

  /**
   * Get a contact by its own UUID (not scoped to a client).
   */
  retrieve(contactUuid: string): Promise<WFMResponse<ClientContact>> {
    return this.http.get<ClientContact>(
      `/v2/clients/contacts/${contactUuid}`
    );
  }

  /**
   * Create a standalone contact (not yet attached to a specific client).
   */
  create(body: CreateClientContactBody): Promise<WFMResponse<ClientContact>> {
    return this.http.post<ClientContact>("/v2/clients/contacts", body);
  }

  /**
   * Update a contact by its own UUID.
   */
  update(
    contactUuid: string,
    body: UpdateClientContactBody
  ): Promise<WFMResponse<ClientContact>> {
    return this.http.put<ClientContact>(
      `/v2/clients/contacts/${contactUuid}`,
      body
    );
  }

  /**
   * Delete a contact by its own UUID.
   */
  delete(contactUuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/clients/contacts/${contactUuid}`);
  }

  // ─── Client-scoped contact operations ────────────────────────────────────

  /**
   * Create a contact and attach it directly to a specific client.
   */
  createForClient(
    clientUuid: string,
    body: CreateClientContactBody
  ): Promise<WFMResponse<ClientContact>> {
    return this.http.post<ClientContact>(
      `/v2/clients/${clientUuid}/contacts`,
      body
    );
  }

  /**
   * Update a contact scoped to a specific client.
   */
  updateForClient(
    clientUuid: string,
    contactUuid: string,
    body: UpdateClientContactBody
  ): Promise<WFMResponse<ClientContact>> {
    return this.http.put<ClientContact>(
      `/v2/clients/${clientUuid}/contacts/${contactUuid}`,
      body
    );
  }

  /**
   * Delete a contact scoped to a specific client.
   */
  deleteForClient(
    clientUuid: string,
    contactUuid: string
  ): Promise<WFMResponse<void>> {
    return this.http.delete(
      `/v2/clients/${clientUuid}/contacts/${contactUuid}`
    );
  }
}
