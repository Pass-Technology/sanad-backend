import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ProviderProfileEntity } from './provider-profile.entity';
import { ServingAreaEntity } from './serving-area.entity';
import { BaseEntity } from '../../../database/base-entity';

@Entity('branches')
export class BranchEntity extends BaseEntity {
    @ManyToOne(() => ProviderProfileEntity, (profile) => profile.branches, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfileEntity;

    @Column()
    branchName: string;

    @Column()
    branchManagerName: string;

    @Column()
    branchAddress: string;

    @Column()
    city: string;

    @Column({ type: 'varchar', nullable: true })
    branchPhone: string | null;

    @Column({ type: 'varchar', nullable: true })
    managerPhone: string | null;

    @Column({ type: 'varchar', nullable: true })
    googleMapsLink: string | null;

    @Column({ type: 'varchar', nullable: true })
    socialMediaLink: string | null;

    @OneToMany(() => ServingAreaEntity, (area) => area.branch)
    servingAreas: ServingAreaEntity[];

}
