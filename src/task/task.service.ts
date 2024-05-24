import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import Task from './task.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private userRepository: UserRepository,
    ) {}

    async addTask(
        name: string,
        userId: number,
        priority: number,
    ): Promise<Task> {
        return await this.taskRepository.addTask(name, userId, priority);
    }

    async getTaskByName(name: string): Promise<Task> {
        return this.taskRepository.getTaskByName(name);
    }

    async getUserTasks(userId: number): Promise<Task[]> {
        return this.taskRepository.getUserTasks(userId);
    }

    async getTasks(): Promise<Task[]> {
        return this.taskRepository.getTasks();
    }

    resetData(): Promise<void> {
        return this.taskRepository.resetData();
    }
}
