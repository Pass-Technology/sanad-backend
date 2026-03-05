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

    @Column({ type: 'varchar', nullable: true })
    phone: string | null;

    @Column({ type: 'varchar', nullable: true })
    mapLink: string | null;

    @Column({ type: 'decimal', nullable: true })
    lat: number | null;

    @Column({ type: 'decimal', nullable: true })
    lng: number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
