import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import User from './user.entity';

@Injectable()
export class UserService {
    constructor(private usersRepository: UserRepository) {}

    async addUser(email: string): Promise<User> {
        return await this.usersRepository.addUser(email);
    }

    async getUser(email: string): Promise<User> {
        return await this.usersRepository.getUser(email);
    }

    async getUserById(userId: number): Promise<User> {
        return await this.usersRepository.getUserById(userId);
    }

    async getUsers(): Promise<User[]> {
        return await this.usersRepository.getUsers();
    }

    async resetData(): Promise<void> {
        return this.usersRepository.resetData();
    }
}
