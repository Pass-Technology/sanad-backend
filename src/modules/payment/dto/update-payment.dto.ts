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
    @ApiProperty({
        required: false,
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdateCashMethodDto extends PartialType(CashMethodDto) {
    @ApiProperty({
        required: false,
        example: 'e390f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdateChequeMethodDto extends PartialType(ChequeMethodDto) {
    @ApiProperty({
        required: false,
        example: 'f490f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePaymentLinkMethodDto extends PartialType(PaymentLinkMethodDto) {
    @ApiProperty({
        required: false,
        example: 'a590f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdateSanadMethodDto extends PartialType(SanadMethodDto) {
    @ApiProperty({
        required: false,
        example: 'b690f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePosMethodDto extends PartialType(PosMethodDto) {
    @ApiProperty({
        required: false,
        example: 'c790f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpdatePaymentDto {
    @ApiProperty({ type: UpdateCashMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateCashMethodDto)
    cash?: UpdateCashMethodDto;

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

    @ApiProperty({ type: UpdateChequeMethodDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateChequeMethodDto)
    cheque?: UpdateChequeMethodDto;
}
