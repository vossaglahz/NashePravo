import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    currentPassword!: string;

    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    newPassword!: string;

    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    confirmNewPassword!: string;
}

export class ChangeRecoverPasswordDto {
    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    newPassword!: string;

    @Expose()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @Length(6, 20, { message: 'Пароль должен содержать от 6 до 20 символов' })
    @IsString({ message: 'Пароль должен быть строкой' })
    confirmNewPassword!: string;
}
