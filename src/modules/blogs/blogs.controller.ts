import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PresignDto } from './dto/presign.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { AdminBlogQueryDto } from './dto/admin-blog-query.dto';
import { CheckSlugQueryDto } from './dto/check-slug-query.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { BlogEntity } from './entities/blog.entity';
import { UploadAssetsService } from '../upload-assets/upload-assets.service';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly uploadAssetsService: UploadAssetsService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'List published blogs' })
    @ApiResponse({ status: 200, description: 'Paginated list of published blogs' })
    findAllPublished(@Query() query: BlogQueryDto) {
        return this.blogsService.findAllPublished(query);
    }


    @Get('slug-exists')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if a blog slug already exists' })
    @ApiResponse({
        status: 200,
        description: 'Whether the slug is already taken',
        schema: { example: { exists: true } },
    })
    checkSlugExists(@Query() query: CheckSlugQueryDto) {
        return this.blogsService.slugExists(query.slug, query.excludeId);
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all blogs (admin)' })
    findAllForAdmin(@Query() query: AdminBlogQueryDto) {
        return this.blogsService.findAllForAdmin(query);
    }

    @Get('admin/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get blog by ID (admin)' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.blogsService.findOne(id);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get published blog by slug' })
    @ApiParam({ name: 'slug', type: String })
    @ApiResponse({ status: 200, type: BlogEntity })
    findOneBySlug(@Param('slug') slug: string) {
        return this.blogsService.findOneBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a blog (admin)' })
    @ApiResponse({ status: 201, type: BlogEntity })
    create(
        @Body() createBlogDto: CreateBlogDto,
        @Request() req: { user: UserInfoResponseWithTokensDto },
    ) {
        return this.blogsService.create(createBlogDto, req.user.userId);
    }

    @Post('presign')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get presigned URL for image upload (admin)' })
    presignForUpload(@Body() body: PresignDto) {
        const { filename, contentType } = body;
        return this.uploadAssetsService.getPresignedPutUrl(filename, contentType, 'blogs');
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a blog (admin)' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        return this.blogsService.update(id, updateBlogDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a blog (admin)' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.blogsService.remove(id);
    }
}
