import { Lawyer } from '@/entities/lawyers.entity';
import { User } from '@/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './rating.entity';

@Entity('dealHistory')
export class DealHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    price!: number;

    @Column({ type: 'timestamp', nullable: true })
    dealDate!: Date;

    @Column({ default: 'Create' })
    status!: string;

    @Column({ default: 'false' })
    userClose!: boolean;

    @Column({ default: 'false' })
    lawyerClose!: boolean;

    @Column()
    type!: string;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    lawyerId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Lawyer)
    @JoinColumn({ name: 'lawyerId' })
    lawyer!: Lawyer;

    @OneToOne(() => Rating, (rating) => rating.dealHistory)
    @JoinColumn({ name: 'ratingId' })
    rating!: Rating;

    @Column('jsonb', { nullable: true })
    responses!: Partial<Lawyer>[];
    
    @Column({ nullable: true })
    chatId!: number;
}

export interface DealHistoryWithClicked extends DealHistory {
    clicked?: boolean;
}