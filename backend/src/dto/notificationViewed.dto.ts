import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarNotificationDto {
    @Expose()
    @IsNotEmpty({ message: 'id не должен быть пустым' })
    @IsNumber({}, { message: 'Id должен быть номером' })
    notificationId!: number;
}
