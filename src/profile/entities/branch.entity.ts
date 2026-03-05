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

    @Column({ nullable: true, default: null })
    branchPhone: string;

    @Column({ nullable: true, default: null })
    managerPhone: string;

    @Column({ nullable: true, default: null })
    googleMapsLink: string;

    @Column({ nullable: true, default: null })
    socialMediaLink: string;

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
