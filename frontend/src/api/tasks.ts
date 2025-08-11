export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export interface TaskData {
    title: string;
    description: string;
    priority: Priority;
    status: string;
    tags: string[];
    assignedTo: string;
    dueDate: string;
    createdAt: string;
    estimatedHours: number;
}

export interface CreateTaskData {
    title: string;
    description: string;
    priority: Priority;
    status: string;
    tags: string[];
    assignedTo: string;
    dueDate?: string;
    estimatedHours: number
}

export interface Statistic {
    DAY: string,
    LOW: string;
    MEDIUM: string;
    HIGH: String;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type EditTaskData = Partial<CreateTaskData>;

export type CountTasksData = Record<Priority, number>;

export type getTaskStatisticsData = Statistic[];

export async function getTasksRequest(skip: number = 0, limit: number = 12): Promise<TaskData[]> {
    const res = await fetch(`${API_URL}/tasks?skip=${skip}&limit=${limit}`);
    if (!res.ok)
        throw res;
    return res.json();
}

export async function getTaskRequest(id: string): Promise<TaskData> {
    const res = await fetch(`${API_URL}/tasks/${id}`);
    if (!res.ok)
        throw res;
    return res.json();
}

export async function createTaskRequest(data: CreateTaskData): Promise<TaskData> {
    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok)
        throw res;
    return res.json();
}


export async function editTaskRequest(id: string, data: EditTaskData): Promise<TaskData> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok)
        throw res;
    return res.json();
}

export async function deleteTaskRequest(id: string): Promise<TaskData> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });
    if (!res.ok)
        throw res;
    return res.json();
}

export async function countTasksRequest(startDate?: Date, endDate?: Date, priority?: Priority): Promise<CountTasksData> {
    const res = await fetch(`${API_URL}/tasks/count?${startDate ? 'startDate=' + startDate.toISOString() : ""}&${endDate ? 'endDate=' + endDate.toISOString() : ""}&${priority ? 'priority=' + priority : ""}`);
    if (!res.ok)
        throw res;
    return res.json();
}

export async function getTaskStatisticsRequest(startDate?: Date, endDate?: Date, priority?: Priority): Promise<getTaskStatisticsData> {
    const res = await fetch(`${API_URL}/tasks/statistic?${startDate ? 'startDate=' + startDate.toISOString() : ""}&${endDate ? 'endDate=' + endDate.toISOString() : ""}&${priority ? 'priority=' + priority : ""}`);
    if (!res.ok)
        throw res;
    return res.json();
}