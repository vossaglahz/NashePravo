import { AppDataSource } from '@/config/dataSource';
import { Repository } from 'typeorm';
import { userRepo } from './user.repository';
import { PersonalNotification } from '@/entities/personalNotification.entity';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { GeneralNotifications } from '@/entities/generalNotification.entity';

export class NotificationRepo {
    private personalNotification: Repository<PersonalNotification>;
    private generalNotification: Repository<GeneralNotifications>;

    constructor() {
        this.personalNotification = AppDataSource.getRepository(PersonalNotification);
        this.generalNotification = AppDataSource.getRepository(GeneralNotifications);
    }

    async getAllNotifications() {
        const generalNotifications = await this.generalNotification.find();
        const personalNotifications = await this.personalNotification.find({ where: { toAdmin: true } });

        return { generalNotifications, personalNotifications };
    }

    async getPersonalNotifications(filters: IQuestionFiltered) {
        const where: any = {};
        const order: any = {};

        if (filters.role) where.role = filters.role;
        if (filters.status) where.answered = filters.status;
        if (filters.questionDate) order.id = filters.questionDate;
        if (filters.status === 'true') {
            where.answered = true;
        } else if (filters.status === 'false') {
            where.answered = false;
        }

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
        const offset = (page - 1) * limit;

        const notifications = await this.personalNotification.find({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const totalCount = await this.personalNotification.count({ where });

        return {
            notifications,
            totalCount,
        };
    }

    async getGeneralNotifications() {
        return await this.generalNotification.find();
    }

    async postGeneralNotification(generalNotificationDto: GeneralNotificationDto) {
        try {
            await this.generalNotification.save(generalNotificationDto);
            return { message: 'Ваше уведомление успешно отправлено всем' };
        } catch (error) {
            throw new Error('Ваш вопрос не был отправлен');
        }
    }

    async postQuestion(refreshToken: string, questionDto: personalNotificationDto) {
        try {
            const user = await userRepo.findByRefreshToken(refreshToken);

            if (user?.role == 'user' || user?.role == 'lawyer') {
                await this.personalNotification.save({
                    topic: questionDto.topic,
                    content: questionDto.content,
                    answered: false,
                    toAdmin: true,
                    role: user.role,
                    user: user.role === 'user' ? user.id : null,
                    lawyer: user.role === 'lawyer' ? user.id : null,
                });
            } else if (user?.role == 'admin') {
                const selectedQuestion = await this.personalNotification.findOne({ where: { id: questionDto.questionId } });
                this.personalNotification.update({ id: selectedQuestion!.id }, { answered: true });

                await this.personalNotification.save({
                    topic: questionDto.topic,
                    content: questionDto.content,
                    answered: true,
                    toAdmin: false,
                    role: user.role,
                    user: questionDto.userId,
                    lawyer: questionDto.lawyerId,
                });
            }

            return { message: 'Ваш вопрос успешно отправлен админу' };
        } catch (error) {
            throw new Error('Ваш вопрос не был отправлен');
        }
    }
}

export const notificationRepo = new NotificationRepo();
