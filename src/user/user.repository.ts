import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';
import User from './user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async addUser(email: string): Promise<User> {
        return this.prismaService.user.create({
            data: {
                email,
            },
        });
    }

    async getUser(email: string): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
    }

    async getUserById(userId: number): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    async getUsers(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    async resetData(): Promise<void> {
        await this.prismaService.user.deleteMany();
    }
}
