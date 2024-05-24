import { Injectable, HttpException } from '@nestjs/common';
import { PrismaExceptionService } from './prisma-exception.service';

@Injectable()
export class ExceptionService {
    constructor(
        private readonly prismaExceptionService: PrismaExceptionService,
    ) {}

    resolveException(error: any): HttpException {
        if (this.prismaExceptionService.isPrismaError(error)) {
            return this.prismaExceptionService.handlePrismaError(error);
        } else {
            return error;
        }
    }
}
