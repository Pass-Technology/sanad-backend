import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty({ example: '38e08d6c-6799-4670-8772-520f92b0c160' })
    @IsUUID()
    // @IsString()
    @IsNotEmpty()
    selectedPlanId: string;

    @ApiProperty({
        example: '2e7e891c-8b2c-4b6e-827c-36b5674c9351',
        description: 'Billing cycle lookup UUID',
    })
    @IsUUID()
    // @IsString()
    @IsNotEmpty()
    billingCycleId: string;
}
