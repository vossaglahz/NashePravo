import { LawyerRequest } from '@/entities/lawyerRequest.entity';
import { IUser, UserRoles } from '@/interfaces/IUser.inerface';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PersonalNotification } from './personalNotification.entity';
import { Rating } from './rating.entity';

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

    @OneToMany(() => LawyerRequest, request => request.lawyer)
    requests!: LawyerRequest[];

    @OneToMany(() => PersonalNotification, personal => personal.lawyer)
    personalNotification!: PersonalNotification[];

    @OneToMany(() => Rating, rating => rating.lawyer)
    rating!: Rating[];
}
