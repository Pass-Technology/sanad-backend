import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty({ example: 'plan-uuid-1' })
    @IsString()
    @IsNotEmpty()
    selectedPlanId: string;

    @ApiProperty({
        example: 'monthly',
        description: 'Billing cycle lookup id: monthly, 3months, 6months, yearly',
    })
    @IsString()
    @IsNotEmpty()
    billingCycleId: string;
}
