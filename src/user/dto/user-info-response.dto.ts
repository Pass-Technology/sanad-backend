import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  userId: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email (if registered with email)',
  })
  email?: string;

  @ApiPropertyOptional({
    example: '+201234567890',
    description: 'User mobile (if registered with mobile)',
  })
  mobile?: string;
}
