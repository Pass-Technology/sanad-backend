import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';

export class UserInfoResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  userId: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User identifier (email or mobile)',
  })
  identifier: string;

  @ApiProperty({
    enum: UserIdentifierType,
    description: 'Type of identifier',
  })
  identifierType: UserIdentifierType;
}
