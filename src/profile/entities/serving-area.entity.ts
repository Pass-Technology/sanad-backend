import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Branch } from './branch.entity';

@Entity('serving_areas')
export class ServingArea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    branchId: string;

    @ManyToOne(() => Branch, (branch) => branch.servingAreas, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'branchId' })
    branch: Branch;

    @Column({ type: 'decimal' })
    radiusKm: number;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    mapLink: string;

    @Column({ type: 'decimal', nullable: true })
    lat: number;

    @Column({ type: 'decimal', nullable: true })
    lng: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
