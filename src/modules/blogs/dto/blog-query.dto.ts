import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class BlogQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Search in title or excerpt across locales' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by keyword tag' })
    @IsOptional()
    @IsString()
    keyword?: string;
}
