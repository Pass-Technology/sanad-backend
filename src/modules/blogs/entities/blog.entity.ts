import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BlogStatus } from '../enums/blog-status.enum';
import { LocalePayload } from '../blog-schema';

@Entity('blogs')
export class BlogEntity extends BaseEntity {
    @Column({ unique: true })
    slug: string;

    @Column({
        type: 'enum',
        enum: BlogStatus,
        default: BlogStatus.DRAFT,
    })
    status: BlogStatus;

    @Column({ type: 'jsonb', nullable: true })
    en: LocalePayload | null;

    @Column({ type: 'jsonb', nullable: true })
    ar: LocalePayload | null;

    @Column({ default: 0 })
    viewCount: number;

    @Column()
    authorId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'author_id' })
    author: UserEntity;
}
