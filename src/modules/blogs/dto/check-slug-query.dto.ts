import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { IsBlogSlug } from '../validators/blog-slug.validator';

export class CheckSlugQueryDto {
    @ApiProperty({
        description: 'Blog slug to check for uniqueness',
        example: 'my-blog-post',
        pattern: '^[a-z0-9\u0660-\u0669\u0600-\u06FF-]+$',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsBlogSlug()
    slug: string;

    @ApiPropertyOptional({
        description: 'Blog ID to exclude when checking (use when editing an existing blog)',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    @IsOptional()
    @IsUUID()
    excludeId?: string;
}
