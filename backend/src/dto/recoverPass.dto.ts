import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecoverPassDto {
    @Expose()
    @IsNotEmpty({ message: 'email не должен быть пустым' })
    @IsString({ message: 'email должен быть строкой' })
    email!: string;
}
