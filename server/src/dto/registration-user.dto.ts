import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class RegistrationUserDto {
    @Expose()
    @IsNotEmpty({ message: 'Логин не должен быть пустым' })
    @IsString({ message: 'Логин должен быть строкой' })
    name!: string;

    @Expose()
    @IsNotEmpty({ message: 'surname не должен быть пустым' })
    @IsString({ message: 'surname должен быть строкой' })
    surname!: string;

    @Expose()
    @IsEmail()
    @IsNotEmpty({ message: 'email не должен быть пустым' })
    @IsString({ message: 'email должен быть строкой' })
    email!: string;

    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    password!: string;

    @Expose()
    @IsOptional()
    @IsBoolean({ message: 'isActivated должен быть булевым' })
    isActivatedByEmail!: boolean;

    @Expose()
    @IsOptional()
    @IsString({ message: 'activationLink должен быть строкой' })
    activationLink!: string;

    @Expose()
    @IsOptional()
    @IsNotEmpty({ message: 'refreshToken не должен быть пустым' })
    @IsString({ message: 'refreshToken должен быть строкой или null' })
    refreshToken!: string | null;

    @Expose()
    @IsOptional()
    @IsNotEmpty({ message: 'accessToken не должен быть пустым' })
    @IsString({ message: 'accessToken должен быть строкой или null' })
    accessToken!: string | null;

    @Expose()
    @IsOptional()
    @IsNotEmpty({ message: 'role не должен быть пустым' })
    @IsString({ message: 'role должен быть строкой' })
    role!: string;
}
