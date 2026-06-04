import { HttpClient } from "../client";
import {
  Staff,
  CreateStaffBody,
  UpdateStaffBody,
  ListStaffParams,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class StaffResource {
  constructor(private http: HttpClient) {}

  /** List all staff members. */
  list(params?: ListStaffParams): Promise<WFMListResponse<Staff>> {
    return this.http.getList<Staff>("/v2/staffs", params as Record<string, unknown>);
  }

  /** Get a single staff member by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Staff>> {
    return this.http.get<Staff>(`/v2/staffs/${uuid}`);
  }

  /** Create a new staff member. */
  create(body: CreateStaffBody): Promise<WFMResponse<Staff>> {
    return this.http.post<Staff>("/v2/staffs", body);
  }

  /** Update an existing staff member. */
  update(uuid: string, body: UpdateStaffBody): Promise<WFMResponse<Staff>> {
    return this.http.put<Staff>(`/v2/staffs/${uuid}`, body);
  }
}
