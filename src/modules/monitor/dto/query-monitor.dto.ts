import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryMonitorDto extends PaginationDto {

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @IsIn(['createdAt', 'name', 'intervalSeconds'])
    sortBy?: 'createdAt' | 'name' | 'intervalSeconds' = 'createdAt';
}