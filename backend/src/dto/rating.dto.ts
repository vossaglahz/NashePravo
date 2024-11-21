import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class RatingDto {
    @Expose()
    @IsNotEmpty({ message: 'Отзыв не должно быть пустым' })
    description!: string;

    @Expose()
    @IsNotEmpty({ message: 'Оценка не должна быть пустой' })
    @IsNumber({}, { message: 'Оценка должна быть числом' })
    @Min(1, { message: 'Оценка должна быть не меньше 1' })
    @Max(5, { message: 'Оценка должна быть не больше 5' })
    assessment!: number;
}
