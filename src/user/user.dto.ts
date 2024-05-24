import { IsEmail, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateUserDTO {
    constructor(email: string) {
        this.email = email;
    }

    @ApiProperty({ example: 'test@mail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

class UserDTO extends CreateUserDTO {
    constructor(id: number, email: string) {
        super(email);
        this.id = id;
    }

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id: number;
}

class UserIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    userId: number;
}

export { CreateUserDTO, UserDTO, UserIdDTO };
