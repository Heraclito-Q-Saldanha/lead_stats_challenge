import { IsOptional, IsNumber, Min, Max, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from './create-task.dto';

export class FilterTaskDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    skip: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit: number = 15;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;
}