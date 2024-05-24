import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserDTO, UserIdDTO } from './user.dto';
import User from './user.entity';
import { ExceptionService } from '../common/exception/exception.service';
import { HttpResponse } from '../common/types/types';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { EmailDTO } from '../common/dto/email.dto';

@ApiTags('user')
@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly exceptionsService: ExceptionService,
    ) {}

    @ApiOkResponse({
        description: 'User created successfully',
        type: UserDTO,
    })
    @Post()
    async createUser(@Body() body: CreateUserDTO): Promise<HttpResponse<User>> {
        try {
            const data: User = await this.userService.addUser(body.email);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User created successfully',
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
        description: 'User details',
        type: UserDTO,
    })
    @Get('id/:userId')
    async getUserById(@Param() { userId }: UserIdDTO): Promise<User> {
        try {
            return await this.userService.getUserById(userId);
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }

    @ApiParam({
        name: 'email',
        type: String,
        description: 'User email',
    })
    @ApiOkResponse({
        description: 'User details',
        type: UserDTO,
    })
    @Get('email/:email')
    async getUserByEmail(@Param() { email }: EmailDTO): Promise<User> {
        try {
            return await this.userService.getUser(email);
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }

    @ApiOkResponse({
        description: 'List : User details',
        type: [UserDTO],
    })
    @Get('users')
    async getUsers(): Promise<User[]> {
        try {
            return await this.userService.getUsers();
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
            return this.userService.resetData();
        } catch (error) {
            throw this.exceptionsService.resolveException(error);
        }
    }
}
