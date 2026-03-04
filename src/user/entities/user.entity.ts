import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column({ unique: true, nullable: true })
    mobile?: string;

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
