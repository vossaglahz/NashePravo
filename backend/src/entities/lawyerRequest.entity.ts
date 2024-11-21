import { Lawyer } from '@/entities/lawyers.entity';
import { User } from '@/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class LawyerRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lawyer, lawyer => lawyer.requests, { nullable: true })
    @JoinColumn({ name: 'lawyerId' })
    lawyer!: Lawyer | null;

    @ManyToOne(() => User, user => user.requests, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user!: User | null;

    @Column()
    type!: 'edit' | 'delete';

    @Column({ type: 'json', nullable: true })
    data!: any; 

    @Column({ default: false })
    isApproved!: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt!: Date;
}