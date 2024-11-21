import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Lawyer } from "./lawyers.entity";

@Entity('toDoList')
export class ToDoList {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column({default: "Doing"})
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.toDoList)
    user!: User;

    @ManyToOne(() => Lawyer, (lawyer) => lawyer.toDoList)
    lawyer!: Lawyer;
}