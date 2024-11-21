import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserInfoDto {
    @Expose()
    @IsNotEmpty({ message: 'Имя не должно быть пустым' })
    @IsString({ message: 'Имя должно быть строкой' })
    name!: string;

    @Expose()
    @IsNotEmpty({ message: 'Фамилия не должна быть пустым' })
    @IsString({ message: 'Фамилия должна быть строкой' })
    surname!: string;

    @Expose()
    @IsOptional()
    @IsString({ message: 'Отчество должно быть строкой' })
    patronymicName!: string;

    @Expose()
    @IsOptional()
    @IsString({ message: 'Фото должно быть корректным URL' })
    photo?: string;
}
