import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ProviderProfile } from './provider-profile.entity';
import { ServingArea } from './serving-area.entity';

@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    providerProfileId: string;

    @ManyToOne(() => ProviderProfile, (profile) => profile.branches, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'providerProfileId' })
    providerProfile: ProviderProfile;

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

    @OneToMany(() => ServingArea, (area) => area.branch, {
        cascade: true,
        eager: true,
    })
    servingAreas: ServingArea[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
