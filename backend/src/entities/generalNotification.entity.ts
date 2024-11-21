import { NotificationRole } from '@/interfaces/IUser.inerface';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('generalNotifications')
export class GeneralNotifications {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    topic!: string;

    @Column()
    content!: string;

    @Column()
    important!: boolean;

    @Column({ type: 'varchar', nullable: true })
    sourceLink!: string | null;

    @Column({ default: NotificationRole.all, nullable: true })
    role!: NotificationRole.user | NotificationRole.lawyer | NotificationRole.all | string;

    private _createdAt!: Date;

    @CreateDateColumn({ type: 'timestamp' })
    get createdAt(): string {
        const date = new Date(this._createdAt);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }
}
