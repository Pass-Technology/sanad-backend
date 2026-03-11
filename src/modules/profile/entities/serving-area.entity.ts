import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { BaseEntity } from '../../../database/base-entity';

@Entity('serving_areas')
export class ServingAreaEntity extends BaseEntity {

    @Column({ type: 'uuid' })
    branchId: string;

    @ManyToOne(() => BranchEntity, (branch) => branch.servingAreas, {
        onDelete: 'CASCADE',
    })
    branch: BranchEntity;

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

}
