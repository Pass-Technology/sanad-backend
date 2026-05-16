import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../../marketplace/enums/request-status.enum';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class GetClientRequestsQueryDto extends PaginationQueryDto {
    @ApiProperty({ required: false, description: 'Filter by service category' })
    @IsOptional()
    @IsUUID()
    serviceId?: string;

    @ApiProperty({ required: false, enum: RequestStatus })
    @IsOptional()
    @IsEnum(RequestStatus)
    status?: RequestStatus;
}
