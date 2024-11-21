import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PersonalNotification } from './personalNotification.entity';
import { LawyerRequest } from '@/entities/lawyerRequest.entity';
import { Rating } from './rating.entity';
import { IUser, UserRoles } from '@/interfaces/IUser.inerface';
import { Documents } from '@/entities/documents.entity';
import { ToDoList } from './toDoList.entity';

@Entity('lawyers')
@Unique(['email'])
export class Lawyer implements IUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    surname!: string;

    @Column()
    email!: string;

    @Exclude()
    @Column()
    password!: string;

    @Column({ nullable: true })
    patronymicName!: string;

    @Column({ nullable: true })
    photo!: string;

    @Column({ nullable: true })
    lawyerType!: string;

    @Column({ type: 'jsonb', nullable: true })
    caseCategories!: string[];

    @Column({ default: false })
    isActivatedByEmail!: boolean;

    @Column({ default: false })
    isConfirmed!: boolean;

    @Column({ nullable: true })
    activationLink!: string;

    @Column({ nullable: true })
    refreshToken!: string;

    @Column({ nullable: true })
    accessToken!: string;

    @Column({ default: UserRoles.lawyer })
    role!: UserRoles.lawyer;

    @Column({ type: 'varchar', nullable: true })
    dateBlocked!: string | null;

    @Column({ default: false })
    permanentBlocked!: boolean;

    @Column({ type: 'varchar', nullable: true })
    city?: string;

    @Column({ type: 'varchar', nullable: true })
    about?: string;

    @OneToMany(() => LawyerRequest, request => request.lawyer)
    requests!: LawyerRequest[];

    @OneToMany(() => PersonalNotification, personal => personal.lawyer)
    personalNotification!: PersonalNotification[];

    @OneToMany(() => Rating, rating => rating.lawyer)
    rating!: Rating[];

    @OneToMany(() => ToDoList, toDoList => toDoList.lawyer)
    toDoList!: ToDoList[];

    @Column({ type: 'text', default: '[]' })
    viewedNotifications!: string;

    @Column({ default: 0 })
    averRating!: number;

    @OneToMany(() => Documents, documents => documents.lawyer)
    documents!: Documents[];
}
