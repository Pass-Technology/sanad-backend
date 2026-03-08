import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'Registration successful. Please verify your OTP.' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({
    example: '12345',
    description:
      'OTP for verification (returned for testing; in production sent via SMS/email)',
  })
  otp: string;
}
