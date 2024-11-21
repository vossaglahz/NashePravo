import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GeneralNotificationDto {
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
    sourceLink!: string | null;

    @Expose()
    @IsNotEmpty({ message: 'Переключатель должен быть' })
    @IsBoolean({ message: 'Переключатель должен быть' })
    important!: boolean;
}
