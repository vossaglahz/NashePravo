import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BlockDto {
    @Expose()
    @IsNotEmpty({ message: 'ID Пользователя не должно быть пустой' })
    @IsNumber({}, { message: 'ID Пользователя должна быть числом' })
    id!: number;

    @Expose()
    @IsNotEmpty({ message: 'Роль не должно быть пустым' })
    @IsString({ message: 'Роль должны быть строкой' })
    role!: string;

    @Expose()
    @IsOptional()
    @IsString({ message: 'Дата должна быть строкой' })
    dateBlocked?: string;
}
