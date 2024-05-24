import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    BadRequestException,
} from '@nestjs/common';
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class PrismaExceptionService {
    handlePrismaError(
        error:
            | PrismaClientKnownRequestError
            | PrismaClientUnknownRequestError
            | PrismaClientRustPanicError
            | PrismaClientInitializationError
            | PrismaClientValidationError,
    ): any {
        switch (error.constructor) {
            case PrismaClientKnownRequestError:
                return this.handleKnownRequestError(
                    error as PrismaClientKnownRequestError,
                );
            case PrismaClientUnknownRequestError:
                return new InternalServerErrorException(`${error.message}`);
            case PrismaClientRustPanicError:
                return new InternalServerErrorException(`${error.message}`);
            case PrismaClientInitializationError:
                return new ServiceUnavailableException(`${error.message}`);
            case PrismaClientValidationError:
                return new BadRequestException(`${error.message}`);
            default:
                return new InternalServerErrorException(
                    'An unexpected error occurred',
                );
        }
    }

    private handleKnownRequestError(error: PrismaClientKnownRequestError): any {
        switch (error.code) {
            case 'P2002':
                return new ConflictException('Unique constraint violation');

            default:
                return new InternalServerErrorException(
                    `Prisma client error: ${error.message}`,
                );
        }
    }

    public isPrismaError(error: any): boolean {
        return (
            error instanceof PrismaClientKnownRequestError ||
            error instanceof PrismaClientUnknownRequestError ||
            error instanceof PrismaClientRustPanicError ||
            error instanceof PrismaClientInitializationError ||
            error instanceof PrismaClientValidationError
        );
    }
}
