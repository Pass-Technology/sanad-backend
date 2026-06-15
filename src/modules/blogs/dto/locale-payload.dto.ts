import {
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    MinLength,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { JSONContent } from '../blog-schema';
import { IsTipTapContent } from '../validators/tiptap-content.validator';

export class LocalePayloadDto {
    @ApiProperty({
        description: 'SEO page title',
        example: 'Best Nursery Activities in Abu Dhabi',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    pageTitle: string;

    @ApiProperty({
        description: 'SEO page description',
        example: 'Discover fun and educational activities for children.',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(160)
    pageDescription: string;

    @ApiProperty({
        description: 'SEO keywords for this locale',
        example: ['nursery', 'activities', 'abu dhabi'],
        type: [String],
    })
    @Transform(({ value }) =>
        Array.isArray(value)
            ? value.map((v) => (typeof v === 'string' ? v.trim() : v))
            : value,
    )
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    keywords: string[];

    @ApiProperty({
        description: 'Article heading',
        example: 'Best Activities for Kids',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'Short summary for listings and cards',
        example: 'A short summary of the article for listings and cards.',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    excerpt: string;

    @ApiProperty({
        description: 'TipTap document JSON (must contain real content)',
        example: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Article body here...' }],
                },
            ],
        },
    })
    @IsTipTapContent()
    content: JSONContent;

    @ApiProperty({
        description: 'Featured image URL (after presigned upload)',
        example: 'https://cdn.example.com/uploads/blog-cover.jpg',
    })
    @IsString()
    @IsNotEmpty()
    featuredImage: string;
}
