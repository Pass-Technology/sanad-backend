import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity]),
        AuthModule,
    ],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService],
})
export class BlogsModule {}
