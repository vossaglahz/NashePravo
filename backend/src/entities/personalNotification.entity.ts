import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyers.entity';

@Entity('personalNotifications')
export class PersonalNotification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    topic!: string;

    @Column({ type: 'varchar', nullable: true })
    sourceLink!: string | null;

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

    private _createdAt!: Date;

    @Column({default: false})
    isViewed!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    get createdAt(): string {
        const date = new Date(this._createdAt);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }
}
