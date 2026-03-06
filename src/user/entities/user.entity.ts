import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserIdentifierType } from '../enums/user-identifier-type.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    identifier: string;

    @Column({
        type: 'enum',
        enum: UserIdentifierType,
    })
    identifierType: UserIdentifierType;

    @Column()
    password: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
