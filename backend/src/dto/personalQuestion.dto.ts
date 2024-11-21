import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class personalNotificationDto {
    @Expose()
    @IsNotEmpty({ message: 'Тема не может быть пустой' })
    @IsString({ message: 'Тема должно быть строкой' })
    topic!: string;

    @Expose()
    @IsNotEmpty({ message: 'Вопрос не должен быть пустым' })
    @IsString({ message: 'Вопрос должен быть строкой' })
    content!: string;

    @Expose()
    @IsOptional()
    @IsNumber({}, { message: 'Вопрос должен быть числом' })
    questionId!: number;

    @Expose()
    @IsOptional()
    sourceLink!: string | null;

    @Expose()
    @IsOptional()
    userId!: number | null;

    @Expose()
    @IsOptional()
    lawyerId!: number | null;
}
