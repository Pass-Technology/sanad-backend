import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class GetOrdersQueryDto extends PaginationQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    serviceId?: string;

    @ApiProperty({ required: false, enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;
}
