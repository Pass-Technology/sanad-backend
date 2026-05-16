import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReplyReviewDto {
    @ApiProperty({ description: 'The reply text' })
    @IsString()
    reply: string;
}
