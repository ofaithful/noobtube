import { Type } from 'class-transformer';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class GetFilesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    perPage?: number;
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page?: number;
}