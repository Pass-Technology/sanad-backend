import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class GetMyServicesQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Search string to filter services by name (English or Arabic)' })
    @IsOptional()
    @IsString()
    searchString?: string;
}
