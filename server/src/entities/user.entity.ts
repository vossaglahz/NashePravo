import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { IUser, UserRoles } from '@/interfaces/IUser.inerface';
import { Exclude } from 'class-transformer';
import { PersonalNotification } from './personalNotification.entity';
import { Rating } from './rating.entity';

@Entity('users')
@Unique(['email'])
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    surname!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    photo!: string;

    @Column({ default: 0 })
    avgRating!: number;

    @Exclude()
    @Column()
    password!: string;

    @Column({ default: false })
    isActivatedByEmail!: boolean;

    @Column({ nullable: true })
    activationLink!: string;

    @Column({ nullable: true })
    refreshToken!: string;

    @Column({ nullable: true })
    accessToken!: string;

    @Column({ default: UserRoles.user })
    role!: UserRoles.user | UserRoles.admin;

    @OneToMany(() => PersonalNotification, personal => personal.user)
    personalNotification!: PersonalNotification[];

    @OneToMany(() => Rating, rating => rating.user)
    rating!: Rating[];

    @Column({ type: 'varchar', nullable: true })
    dateBlocked!: string | null;

    @Column({ default:false })
    permanentBlocked!: boolean; 
}
