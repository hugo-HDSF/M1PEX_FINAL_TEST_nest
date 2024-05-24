import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO, TaskDTO } from './task.dto';
import Task from './task.entity';
import { ExceptionService } from '../common/exception/exception.service';
import { HttpResponse } from '../common/types/types';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserIdDTO } from '../user/user.dto';

@ApiTags('task')
@Controller()
export class TaskController {
    constructor(
        private taskService: TaskService,
        private readonly exceptionsService: ExceptionService,
    ) {}

    @ApiOkResponse({
        description: 'Task created successfully',
        type: TaskDTO,
    })
    @Post()
    async createTask(
        @Body() taskDto: CreateTaskDTO,
    ): Promise<HttpResponse<Task>> {
        try {
            const data: Task = await this.taskService.addTask(
                taskDto.name,
                taskDto.userId,
                taskDto.priority,
            );
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Task created successfully',
                data,
            };
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }

    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID',
    })
    @ApiOkResponse({
        description: 'User tasks',
        type: [TaskDTO],
    })
    @Get('user/:userId')
    async getUserTasks(@Param() { userId }: UserIdDTO): Promise<Task[]> {
        try {
            return await this.taskService.getUserTasks(userId);
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }

    @ApiOkResponse({
        description: 'Tasks',
        type: [TaskDTO],
    })
    @Get('tasks')
    async getTasks(): Promise<Task[]> {
        try {
            return this.taskService.getTasks();
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }

    @ApiOkResponse({
        description: 'Data reset successfully',
    })
    @Post('reset')
    async resetData(): Promise<void> {
        try {
            return this.taskService.resetData();
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }
}
