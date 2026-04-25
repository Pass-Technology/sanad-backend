import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({ description: 'Total number of items' })
    totalItems: number;

    @ApiProperty({ description: 'Number of items on the current page' })
    itemCount: number;

    @ApiProperty({ description: 'Number of items per page' })
    itemsPerPage: number;

    @ApiProperty({ description: 'Total number of pages' })
    totalPages: number;

    @ApiProperty({ description: 'Current page number' })
    currentPage: number;
}

export class PaginatedResponseDto<T> {
    @ApiProperty({ isArray: true, description: 'Paginated data' })
    data: T[];

    @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
    meta: PaginationMetaDto;
}
