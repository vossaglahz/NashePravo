import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AiQuestionDto {
    @Expose()
    @IsNotEmpty({ message: 'сообщение не должно быть пустым' })
    message!: string;

    @Expose()
    @IsString({ message: 'тип роли должен быть строкой' })
    role!: string;

    @Expose()
    @IsString({ message: 'тип вопроса должен быть строкой' })
    type!: string;

    @Expose()
    @IsOptional()
    document!: { src: string; name: string };
}