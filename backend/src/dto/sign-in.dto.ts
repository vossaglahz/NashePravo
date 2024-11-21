import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @Expose()
    @IsNotEmpty({ message: 'email не должен быть пустым' })
    @IsString({ message: 'email должен быть строкой' })
    email!: string;

    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @IsString({ message: 'Пароль должен быть строкой' })
    password!: string;
}
