import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task';

export class TaskService {
  private tasks = new Map<string, Task>();
  private maxTasks = parseInt(process.env.MAX_TASKS || '10000');

  getAll(): Task[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getById(id: string): Task | null {
    return this.tasks.get(id) || null;
  }

  create(data: CreateTaskRequest): Task {
    if (this.tasks.size >= this.maxTasks) {
      this.cleanupOldCompletedTasks();
    }

    if (!data.title?.trim()) {
      throw new Error('Title is required');
    }

    const task: Task = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, data: UpdateTaskRequest): Task | null {
    const existing = this.tasks.get(id);
    if (!existing) {
      return null;
    }

    // 동시성 제어: 버전 체크
    if (data.version && existing.version !== data.version) {
      throw new Error('Task has been modified by another user');
    }

    // 입력 검증
    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    const updated: Task = {
      ...existing,
      title: data.title?.trim() ?? existing.title,
      description: data.description?.trim() ?? existing.description,
      completed: data.completed ?? existing.completed,
      updatedAt: new Date(),
      version: existing.version + 1,
    };

    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }

  getStats(): { total: number; completed: number; pending: number } {
    const tasks = this.getAll();
    const completed = tasks.filter(task => task.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }

  private cleanupOldCompletedTasks(): void {
    const completedTasks = Array.from(this.tasks.values())
      .filter(task => task.completed)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    const toDelete = Math.min(completedTasks.length, 1000);
    for (let i = 0; i < toDelete; i++) {
      this.tasks.delete(completedTasks[i].id);
    }

    console.log(`Cleaned up ${toDelete} old completed tasks`);
  }
}