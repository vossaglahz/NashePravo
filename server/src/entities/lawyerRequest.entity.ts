import { Lawyer } from '@/entities/lawyers.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class LawyerRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lawyer, lawyer => lawyer.requests)
    lawyer!: Lawyer;

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