import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyers.entity';

@Entity('personalNotifications')
export class PersonalNotification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    topic!: string;

    @Column()
    content!: string;

    @ManyToOne(() => User, user => user.personalNotification)
    user!: number | null;

    @ManyToOne(() => Lawyer, lawyer => lawyer.personalNotification)
    lawyer!: number | null;

    @Column()
    role!: string;

    @Column()
    toAdmin!: boolean;

    @Column()
    answered!: boolean;
}
