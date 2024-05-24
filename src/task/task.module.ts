import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { ExceptionService } from '../common/exception/exception.service';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { PrismaExceptionService } from '../common/exception/prisma-exception.service';

@Module({
    imports: [TaskModule],
    providers: [
        TaskService,
        UserService,
        UserRepository,
        TaskRepository,
        PrismaService,
        ExceptionService,
        PrismaExceptionService,
    ],
    controllers: [TaskController],
    exports: [TaskService],
})
export class TaskModule {}
