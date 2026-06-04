import { HttpClient } from "../client";
import { Me, Account, Role, Tax, WFMListResponse, WFMResponse } from "../types";

export class MeResource {
  constructor(private http: HttpClient) {}

  /** Get the authenticated user's profile. */
  get(): Promise<WFMResponse<Me>> {
    return this.http.get<Me>("/v2/me");
  }
}

export class AccountsResource {
  constructor(private http: HttpClient) {}

  /** List accounts accessible to the authenticated user. */
  list(): Promise<WFMListResponse<Account>> {
    return this.http.getList<Account>("/v2/accounts");
  }
}

export class RolesResource {
  constructor(private http: HttpClient) {}

  /** List all roles in the organisation. */
  list(): Promise<WFMListResponse<Role>> {
    return this.http.getList<Role>("/v2/roles");
  }
}

export class TaxesResource {
  constructor(private http: HttpClient) {}

  /** List all tax rates configured in the organisation. */
  list(): Promise<WFMListResponse<Tax>> {
    return this.http.getList<Tax>("/v2/taxes");
  }
}
