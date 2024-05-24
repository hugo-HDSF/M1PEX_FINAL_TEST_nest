import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { ExceptionService } from '../common/exception/exception.service';
import { PrismaExceptionService } from '../common/exception/prisma-exception.service';

@Module({
    imports: [UserModule],
    providers: [
        UserService,
        UserRepository,
        PrismaService,
        ExceptionService,
        PrismaExceptionService,
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
