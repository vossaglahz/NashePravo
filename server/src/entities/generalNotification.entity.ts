import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
