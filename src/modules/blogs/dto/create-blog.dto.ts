import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogStatus } from '../enums/blog-status.enum';
import { LocalePayloadDto } from './locale-payload.dto';
import { IsBlogSlug } from '../validators/blog-slug.validator';

export class CreateBlogDto {
    @ApiProperty({
        description:
            'Unique slug shared across locales. Allowed: a-z, Arabic script, digits 0-9 / ٠-٩, hyphens.',
        example: 'my-blog-post',
        pattern: '^[a-z0-9\u0660-\u0669\u0600-\u06FF-]+$',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsBlogSlug()
    slug: string;

    @ApiProperty({
        enum: BlogStatus,
        description: 'Publication status of the blog',
        example: BlogStatus.DRAFT,
    })
    @IsEnum(BlogStatus)
    status: BlogStatus;

    @ApiPropertyOptional({
        description: 'English locale payload, or null if unused',
        type: LocalePayloadDto,
        nullable: true,
    })
    @ValidateIf((o) => o.en !== null && o.en !== undefined)
    @ValidateNested()
    @Type(() => LocalePayloadDto)
    en: LocalePayloadDto | null;

    @ApiPropertyOptional({
        description: 'Arabic locale payload, or null if unused',
        type: LocalePayloadDto,
        nullable: true,
    })
    @ValidateIf((o) => o.ar !== null && o.ar !== undefined)
    @ValidateNested()
    @Type(() => LocalePayloadDto)
    ar: LocalePayloadDto | null;
}
