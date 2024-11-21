import { IMessages } from '@/interfaces/IChatHistory.interface';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chatHistory')
export class ChatHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    lawyerId!: number;

    @Column('jsonb')
    messages!: IMessages[];
    
    @Column({ default: 'false' })
    isClose!: boolean;

}
