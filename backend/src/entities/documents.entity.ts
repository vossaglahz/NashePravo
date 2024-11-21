import { Lawyer } from '@/entities/lawyers.entity';
import { IDocuments } from '@/interfaces/IDocuments.interface';
import { IUser } from '@/interfaces/IUser.inerface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('documents')
export class Documents implements IDocuments {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    lawyerId!: number;

    @ManyToOne(() => Lawyer)
    @JoinColumn({ name: 'lawyerId' })
    lawyer!: IUser;

    @Column({ type: 'jsonb', nullable: true })
    image!: { name: string; src: string }[];

    @Column({ default: false })
    publish!: boolean;
}
