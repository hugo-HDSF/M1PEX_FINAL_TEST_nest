import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsPositive,
    IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateTaskDTO {
    constructor(name: string, userId: number, priority: number = 0) {
        this.name = name;
        this.userId = userId;
        this.priority = priority;
    }

    @ApiProperty({ example: 'Task name' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    userId: number;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    priority: number;
}

class TaskDTO extends CreateTaskDTO {
    constructor(
        id: number,
        name: string,
        userId: number,
        priority: number = 0,
    ) {
        super(name, userId, priority);
        this.id = id;
    }

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id: number;
}

export { CreateTaskDTO, TaskDTO };
