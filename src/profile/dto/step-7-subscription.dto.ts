import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BillingCycle } from '../enums/profile-status.enum';

export class CreateSubscriptionDto {
    @ApiProperty({ example: 'plan-uuid-1' })
    @IsString()
    @IsNotEmpty()
    selectedPlanId: string;

    @ApiProperty({
        enum: BillingCycle,
        example: BillingCycle.MONTHLY,
        description: 'Billing cycle: monthly, 3months, 6months, yearly',
    })
    @IsEnum(BillingCycle)
    @IsNotEmpty()
    billingCycle: BillingCycle;
}
