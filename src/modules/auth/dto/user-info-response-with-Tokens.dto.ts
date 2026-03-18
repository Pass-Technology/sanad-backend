import { ApiProperty } from '@nestjs/swagger';
import { UserIdentifierType } from '../../user/enums/user-identifier-type.enum';

export class UserInfoResponseWithTokensDto {
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

  @ApiProperty({ example: false, description: 'Whether the user is verified' })
  isVerified: boolean;

  @ApiProperty({ example: false, description: 'Whether the profile is completed' })
  isProfileCompleted: boolean;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}
