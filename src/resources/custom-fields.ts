import { HttpClient } from "../client";
import {
  CustomFieldDefinition,
  CreateCustomFieldBody,
  UpdateCustomFieldBody,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class CustomFieldsResource {
  constructor(private http: HttpClient) {}

  /** List all custom field definitions. */
  list(): Promise<WFMListResponse<CustomFieldDefinition>> {
    return this.http.getList<CustomFieldDefinition>("/v2/custom-fields");
  }

  /** Create a new custom field definition. */
  create(body: CreateCustomFieldBody): Promise<WFMResponse<CustomFieldDefinition>> {
    return this.http.post<CustomFieldDefinition>("/v2/custom-fields", body);
  }

  /** Update an existing custom field definition. */
  update(
    uuid: string,
    body: UpdateCustomFieldBody
  ): Promise<WFMResponse<CustomFieldDefinition>> {
    return this.http.put<CustomFieldDefinition>(`/v2/custom-fields/${uuid}`, body);
  }
}
