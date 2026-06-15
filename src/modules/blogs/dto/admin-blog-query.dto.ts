import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';
import { BlogStatus } from '../enums/blog-status.enum';

export class AdminBlogQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: BlogStatus, description: 'Filter by publication status' })
    @IsOptional()
    @IsEnum(BlogStatus)
    status?: BlogStatus;
}
