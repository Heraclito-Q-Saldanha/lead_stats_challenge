import { IsDate, IsOptional, IsString, IsEnum, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(Priority)
    priority: Priority;

    @IsEnum(Status)
    status: Status;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dueDate?: Date;

    @IsString()
    assignedTo: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @Type(() => Number)
    @IsNumber()
    estimatedHours: number;
}
