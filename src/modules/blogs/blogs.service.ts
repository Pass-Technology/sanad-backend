import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, Not } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogStatus } from './enums/blog-status.enum';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { AdminBlogQueryDto } from './dto/admin-blog-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogsRepository: Repository<BlogEntity>,
    ) {}

    async create(createBlogDto: CreateBlogDto, authorId: string): Promise<BlogEntity> {
        const existingBlog = await this.blogsRepository.findOne({
            where: { slug: createBlogDto.slug },
        });

        if (existingBlog) {
            throw new BadRequestException('Blog with this slug already exists');
        }

        const en = createBlogDto.en ?? null;
        const ar = createBlogDto.ar ?? null;
        this.assertAtLeastOneLocale(en, ar);

        const blog = this.blogsRepository.create({
            slug: createBlogDto.slug,
            status: createBlogDto.status,
            en,
            ar,
            authorId,
        });

        return this.blogsRepository.save(blog);
    }

    private assertAtLeastOneLocale(en: unknown, ar: unknown): void {
        if (en == null && ar == null) {
            throw new BadRequestException(
                'At least one of "en" or "ar" must be a non-null locale payload',
            );
        }
    }

    async findAllPublished(query: BlogQueryDto): Promise<PaginatedResponseDto<BlogEntity>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.blogsRepository
            .createQueryBuilder('blog')
            .leftJoinAndSelect('blog.author', 'author')
            .where('blog.status = :status', { status: BlogStatus.PUBLISHED })
            .orderBy('blog.createdAt', 'DESC');

        if (query.search) {
            qb.andWhere(
                new Brackets((sub) => {
                    sub
                        .where(`blog.en ->> 'title' ILIKE :search`, { search: `%${query.search}%` })
                        .orWhere(`blog.en ->> 'excerpt' ILIKE :search`, { search: `%${query.search}%` })
                        .orWhere(`blog.ar ->> 'title' ILIKE :search`, { search: `%${query.search}%` })
                        .orWhere(`blog.ar ->> 'excerpt' ILIKE :search`, { search: `%${query.search}%` });
                }),
            );
        }

        if (query.keyword) {
            qb.andWhere(
                new Brackets((sub) => {
                    sub
                        .where(
                            `EXISTS (SELECT 1 FROM jsonb_array_elements_text(blog.en -> 'keywords') AS kw WHERE kw ILIKE :keyword)`,
                            { keyword: `%${query.keyword}%` },
                        )
                        .orWhere(
                            `EXISTS (SELECT 1 FROM jsonb_array_elements_text(blog.ar -> 'keywords') AS kw WHERE kw ILIKE :keyword)`,
                            { keyword: `%${query.keyword}%` },
                        );
                }),
            );
        }

        const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

        return this.buildPaginatedResponse(data, totalItems, page, limit);
    }

    async findOneBySlug(slug: string): Promise<BlogEntity> {
        const blog = await this.blogsRepository.findOne({
            where: { slug, status: BlogStatus.PUBLISHED },
            relations: ['author'],
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        await this.blogsRepository.increment({ id: blog.id }, 'viewCount', 1);

        return blog;
    }

    async findAllForAdmin(query: AdminBlogQueryDto): Promise<PaginatedResponseDto<BlogEntity>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.blogsRepository
            .createQueryBuilder('blog')
            .leftJoinAndSelect('blog.author', 'author')
            .orderBy('blog.createdAt', 'DESC');

        if (query.status) {
            qb.where('blog.status = :status', { status: query.status });
        }

        const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

        return this.buildPaginatedResponse(data, totalItems, page, limit);
    }

    async findOne(id: string): Promise<BlogEntity> {
        const blog = await this.blogsRepository.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }

    async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
        const blog = await this.blogsRepository.findOne({ where: { id } });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (updateBlogDto.slug !== undefined && updateBlogDto.slug !== blog.slug) {
            const existingBlog = await this.blogsRepository.findOne({
                where: { slug: updateBlogDto.slug, id: Not(id) },
            });

            if (existingBlog) {
                throw new BadRequestException('Blog with this slug already exists');
            }
        }

        if (updateBlogDto.slug !== undefined) {
            blog.slug = updateBlogDto.slug;
        }
        if (updateBlogDto.status !== undefined) {
            blog.status = updateBlogDto.status;
        }
        if (updateBlogDto.en !== undefined) {
            blog.en = updateBlogDto.en;
        }
        if (updateBlogDto.ar !== undefined) {
            blog.ar = updateBlogDto.ar;
        }

        this.assertAtLeastOneLocale(blog.en, blog.ar);

        return this.blogsRepository.save(blog);
    }

    async remove(id: string): Promise<void> {
        const blog = await this.blogsRepository.findOne({ where: { id } });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        await this.blogsRepository.softRemove(blog);
    }

    async slugExists(slug: string, excludeId?: string): Promise<{ exists: boolean }> {
        const existingBlog = await this.blogsRepository.findOne({
            where: excludeId ? { slug, id: Not(excludeId) } : { slug },
        });
        return { exists: !!existingBlog };
    }


    private buildPaginatedResponse<T>(
        data: T[],
        totalItems: number,
        page: number,
        limit: number,
    ): PaginatedResponseDto<T> {
        return {
            data,
            meta: {
                totalItems,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }
}
