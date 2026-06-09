import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignDto {
    @ApiProperty({
        description: 'Filename to be uploaded',
        example: 'blog-image.png',
    })
    @IsString()
    @IsNotEmpty()
    filename: string;

    @ApiProperty({ description: 'MIME type of the file', example: 'image/png' })
    @IsString()
    @IsNotEmpty()
    contentType: string;
}
