import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ServiceEntity } from './service.entity';
import { Description } from '../interfaces/category-description.interface';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
    @Column()
    name: string;

    @Column({ name: 'name_ar' })
    nameAr: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @OneToMany(() => ServiceEntity, (service) => service.category)
    services: ServiceEntity[];

    @Column({ type: 'jsonb', nullable: true, default: { en: 'Category description', ar: 'وصف الفئة' } })
    description?: Description | null;
}
