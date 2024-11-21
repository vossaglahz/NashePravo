import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { Lawyer } from "./lawyers.entity";
import { DealHistory } from "./dealHistory.entity";

@Entity('rating')
export class Rating {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    assessment!:number

    @CreateDateColumn()
    createdAt!: Date;   

    @ManyToOne(() => User, (user) => user.rating)
    user!: User;

    @ManyToOne(() => Lawyer, (lawyer) => lawyer.rating)
    lawyer!: Lawyer;

    @OneToOne(() => DealHistory, (dealHistory) => dealHistory.rating)
    dealHistory!: DealHistory
}