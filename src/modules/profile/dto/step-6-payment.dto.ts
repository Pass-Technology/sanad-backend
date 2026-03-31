import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CashMethodDto } from './payment-sub-dtos/cashMethod.dto';
import { BankTransferMethodDto } from './payment-sub-dtos/bankTransferMethod.dto';
import { PaymentLinkMethodDto } from './payment-sub-dtos/paymentLinkMethod.dto';
import { SanadMethodDto } from './payment-sub-dtos/sanadMethod.dto';
import { ChequeMethodDto } from './payment-sub-dtos/chequeMethod.dto';
import { PosMethodDto } from './payment-sub-dtos/POSMethod.dto';


export class CreatePaymentDto {
    // NESTED PAYMENT METHODS

    @ApiProperty({ type: CashMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CashMethodDto)
    cash?: CashMethodDto;

    @ApiProperty({ type: [BankTransferMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BankTransferMethodDto)
    bankTransfer?: BankTransferMethodDto[];

    @ApiProperty({ type: [PaymentLinkMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentLinkMethodDto)
    paymentLink?: PaymentLinkMethodDto[];

    @ApiProperty({ type: [SanadMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SanadMethodDto)
    sanad?: SanadMethodDto[];

    @ApiProperty({ type: [PosMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PosMethodDto)
    pos?: PosMethodDto[];

    @ApiProperty({ type: ChequeMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => ChequeMethodDto)
    cheque?: ChequeMethodDto;
}
