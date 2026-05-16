import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ChannelsDto {
    @IsBoolean() @IsOptional() push?: boolean;
    @IsBoolean() @IsOptional() inApp?: boolean;
    @IsBoolean() @IsOptional() email?: boolean;
    @IsBoolean() @IsOptional() whatsapp?: boolean;
    @IsBoolean() @IsOptional() sms?: boolean;
}

class CategoriesDto {
    @IsBoolean() @IsOptional() jobs?: boolean;
    @IsBoolean() @IsOptional() finance?: boolean;
    @IsBoolean() @IsOptional() compliance?: boolean;
    @IsBoolean() @IsOptional() performance?: boolean;
    @IsBoolean() @IsOptional() system?: boolean;
}

class ReminderTimingDto {
    @IsNumber() @IsOptional() docExpiryDays?: number;
    @IsString() @IsOptional() dailySummaryTime?: string;
    @IsString() @IsOptional() weeklySummaryDay?: string;
}

class QuietHoursDto {
    @IsBoolean() @IsOptional() isEnabled?: boolean;
    @IsString() @IsOptional() startTime?: string;
    @IsString() @IsOptional() endTime?: string;
}

export class UpdateNotificationSettingsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ChannelsDto)
    channels?: ChannelsDto;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CategoriesDto)
    categories?: CategoriesDto;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ReminderTimingDto)
    reminderTiming?: ReminderTimingDto;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => QuietHoursDto)
    quietHours?: QuietHoursDto;
}
