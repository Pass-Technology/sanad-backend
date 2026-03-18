import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { ServiceEntity } from './service.entity';

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

    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];
}
