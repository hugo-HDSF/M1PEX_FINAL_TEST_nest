import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';
import Task from './task.entity';

@Injectable()
export class TaskRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async addTask(
        name: string,
        userId: number,
        priority: number,
    ): Promise<Task> {
        return this.prismaService.task.create({
            data: {
                name,
                user: {
                    connect: { id: userId },
                },
                priority,
            },
        });
    }

    async getTaskByName(name: string): Promise<Task> {
        return this.prismaService.task.findFirst({
            where: {
                name,
            },
        });
    }

    async getUserTasks(userId: number): Promise<Task[]> {
        return this.prismaService.task.findMany({
            where: {
                userId,
            },
        });
    }

    async getTasks(): Promise<Task[]> {
        return this.prismaService.task.findMany();
    }

    async resetData(): Promise<void> {
        await this.prismaService.task.deleteMany();
    }
}
