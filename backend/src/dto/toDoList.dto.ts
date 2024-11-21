import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ToDoListDto {
    @Expose()
    @IsNotEmpty({ message: 'Задача не должна быть пустым' })
    text!: string;

    @Expose()
    status!: string;
}
