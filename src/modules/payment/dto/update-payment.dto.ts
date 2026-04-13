import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BankTransferMethodDto } from './bank-transfer-method.dto';
import { CashMethodDto } from './cash-method.dto';
import { PaymentLinkMethodDto } from './payment-link-method.dto';
import { SanadMethodDto } from './sanad-method.dto';
import { PosMethodDto } from './pos-method.dto';
import { ChequeMethodDto } from './cheque-method.dto';

export class UpdateBankTransferMethodDto extends PartialType(BankTransferMethodDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePaymentLinkMethodDto extends PartialType(PaymentLinkMethodDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdateSanadMethodDto extends PartialType(SanadMethodDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePosMethodDto extends PartialType(PosMethodDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePaymentDto {
    @ApiProperty({ type: CashMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CashMethodDto)
    cash?: CashMethodDto;

    @ApiProperty({ type: [UpdateBankTransferMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateBankTransferMethodDto)
    bankTransfer?: UpdateBankTransferMethodDto[];

    @ApiProperty({ type: [UpdatePaymentLinkMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdatePaymentLinkMethodDto)
    paymentLink?: UpdatePaymentLinkMethodDto[];

    @ApiProperty({ type: [UpdateSanadMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateSanadMethodDto)
    sanad?: UpdateSanadMethodDto[];

    @ApiProperty({ type: [UpdatePosMethodDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdatePosMethodDto)
    pos?: UpdatePosMethodDto[];

    @ApiProperty({ type: ChequeMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => ChequeMethodDto)
    cheque?: ChequeMethodDto;
}
