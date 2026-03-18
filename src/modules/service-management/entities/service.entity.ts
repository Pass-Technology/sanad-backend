import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';
import { CategoryEntity } from './category.entity';
import { ProviderProfileEntity } from '../../profile/entities/provider-profile.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
    @Column()
    name: string;

    @Column({ name: 'name_ar' })
    nameAr: string;

    @Column({ default: 0 })
    depth: number;

    @Column({ default: 0, name: 'sort_order' })
    sortOrder: number;

    @Column({ default: true, name: 'is_leaf' })
    isLeaf: boolean;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @ManyToOne(() => CategoryEntity, (category) => category.services)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @ManyToOne(() => ServiceEntity, (parent) => parent.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: ServiceEntity;

    @OneToMany(() => ServiceEntity, (child) => child.parent)
    children: ServiceEntity[];

    @ManyToMany(() => ProviderProfileEntity, (profile) => profile.selectedServices)
    profiles: ProviderProfileEntity[];
}
