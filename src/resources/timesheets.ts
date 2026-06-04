import { HttpClient } from "../client";
import {
  Timesheet,
  CreateTimesheetBody,
  UpdateTimesheetBody,
  ListTimesheetsParams,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class TimesheetsResource {
  constructor(private http: HttpClient) {}

  /** List timesheets with optional filtering by staff, job, or date range. */
  list(params?: ListTimesheetsParams): Promise<WFMListResponse<Timesheet>> {
    return this.http.getList<Timesheet>("/v2/timesheets", params as Record<string, unknown>);
  }

  /** Get a single timesheet by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Timesheet>> {
    return this.http.get<Timesheet>(`/v2/timesheets/${uuid}`);
  }

  /** Create a new timesheet entry. */
  create(body: CreateTimesheetBody): Promise<WFMResponse<Timesheet>> {
    return this.http.post<Timesheet>("/v2/timesheets", body);
  }

  /** Update an existing timesheet entry. */
  update(
    uuid: string,
    body: UpdateTimesheetBody
  ): Promise<WFMResponse<Timesheet>> {
    return this.http.put<Timesheet>(`/v2/timesheets/${uuid}`, body);
  }

  /** Delete a timesheet entry. */
  delete(uuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/timesheets/${uuid}`);
  }
}
