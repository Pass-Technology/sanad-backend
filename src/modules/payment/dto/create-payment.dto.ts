import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CashMethodDto } from './cash-method.dto';
import { BankTransferMethodDto } from './bank-transfer-method.dto';
import { PaymentLinkMethodDto } from './payment-link-method.dto';
import { SanadMethodDto } from './sanad-method.dto';
import { ChequeMethodDto } from './cheque-method.dto';
import { PosMethodDto } from './pos-method.dto';


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
