import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class DocumentsDto {
    @Expose()
    @IsNotEmpty({ message: 'Документы будут доступны после выбора юриста!' })
    @IsNumberString({}, { message: 'Укажите корректный id юриста' })
    lawyerId!: number;

    @Expose()
    @IsNotEmpty({ message: 'Необходимо прикрепить документ(ы)!' })
    image: { src: string; name: string }[] = [];
}
