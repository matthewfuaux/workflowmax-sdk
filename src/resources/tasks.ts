import { HttpClient } from "../client";
import {
  Task,
  CreateTaskBody,
  UpdateTaskBody,
  ListTasksParams,
  WFMListResponse,
  WFMResponse,
} from "../types";

export class TasksResource {
  constructor(private http: HttpClient) {}

  /** List all tasks (reusable task templates). */
  list(params?: ListTasksParams): Promise<WFMListResponse<Task>> {
    return this.http.getList<Task>("/v2/tasks", params as Record<string, unknown>);
  }

  /** Get a single task by UUID. */
  retrieve(uuid: string): Promise<WFMResponse<Task>> {
    return this.http.get<Task>(`/v2/tasks/${uuid}`);
  }

  /** Create a new task. */
  create(body: CreateTaskBody): Promise<WFMResponse<Task>> {
    return this.http.post<Task>("/v2/tasks", body);
  }

  /** Update an existing task. */
  update(uuid: string, body: UpdateTaskBody): Promise<WFMResponse<Task>> {
    return this.http.put<Task>(`/v2/tasks/${uuid}`, body);
  }

  /** Delete a task. */
  delete(uuid: string): Promise<WFMResponse<void>> {
    return this.http.delete(`/v2/tasks/${uuid}`);
  }
}
