import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DealHistoryDto {
    @Expose()
    @IsNotEmpty({ message: 'Наименование вопроса не должно быть пустым' })
    @IsString({ message: 'Наименование вопроса должно быть строкой' })
    title!: string;

    @Expose()
    @IsNotEmpty({ message: 'Описание вопроса не должно быть пустым' })
    @IsString({ message: 'Описание вопроса должно быть строкой' })
    description!: string;

    @Expose()
    @IsNotEmpty({ message: 'Цена вопроса не должна быть пустой' })
    @IsNumber({}, { message: 'Цена вопроса должна быть числом' })
    price!: number;

    @Expose()
    @IsNotEmpty({ message: 'Тип вопроса не должен быть пустым' })
    @IsString({ message: 'Тип вопроса должен быть строкой' })
    type!: string;
}
