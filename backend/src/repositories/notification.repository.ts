import { AppDataSource } from '@/config/dataSource';
import { Repository, Equal, In, FindOperator, Not } from 'typeorm';
import { userRepo } from './user.repository';
import { PersonalNotification } from '@/entities/personalNotification.entity';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { GeneralNotifications } from '@/entities/generalNotification.entity';
import { IQuestion } from '@/interfaces/IQuestion.interface';

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

    async getPersonalNotifications(filters: IQuestionFiltered, refreshToken: string) {
        const findUser = await userRepo.findByRefreshToken(refreshToken);

        const where: any = {};
        const order: any = {};

        if (filters.role) where.role = filters.role;

        if (filters.status === 'true') where.answered = true;
        else if (filters.status === 'false') where.answered = false;

        if (filters.sorted) order.id = filters.sorted;
        if (findUser?.role === 'lawyer') {
            where.toAdmin = false;
            where.lawyer = Equal(findUser.id);
        } else if (findUser?.role === 'user') {
            where.toAdmin = false;
            where.user = Equal(findUser.id);
        } else if (findUser?.role === 'admin') {
            where.toAdmin = true;
        }

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
        const offset = (page - 1) * limit;
        const [notificationsData, totalCount] = await this.personalNotification
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .leftJoinAndSelect('notification.lawyer', 'lawyer')
            .select([
                'notification.id',
                'notification.topic',
                'notification.content',
                'notification.role',
                'notification.toAdmin',
                'notification.answered',
                'notification.createdAt',
                'notification.isViewed',
                'user.name',
                'user.surname',
                'lawyer.name',
                'lawyer.surname',
            ])
            .where(where)
            .orderBy('notification.id', filters.sorted)
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {
            notifications: notificationsData,
            totalCount,
        };
    }

    async getGeneralNotifications(filters: IQuestion, role?: string) {
        const where: {
            important?: boolean;
            role?: string | FindOperator<string>;
        } = {};

        let order: any = {};

        if (filters.important === 'important') {
            where.important = true;
        } else if (filters.important === 'not important') {
            where.important = false;
        }

        if (role && role !== 'all') {
            where.role = In([role, 'all']);
        } else {
            where.role = 'all';
        }

        if (filters.sorted) {
            order.id = filters.sorted === 'ASC' ? 'ASC' : 'DESC';
        }

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
        const offset = (page - 1) * limit;

        const notifications = await this.generalNotification.find({
            where,
            order,
            skip: offset,
            take: limit,
        });

        const totalCount = await this.generalNotification.count({ where });

        return { notifications, totalCount };
    }
    async postGeneralNotification(generalNotificationDto: GeneralNotificationDto, targetAudience: string) {
        try {
            const data = {
                ...generalNotificationDto,
                role: targetAudience,
            };

            await this.generalNotification.save(targetAudience ? data : generalNotificationDto);
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
                    answered: false,
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

    async getUnreadNotificationsCount(refreshToken: string) {
        const user = await userRepo.findByRefreshToken(refreshToken);
        let unreadPersonalCount = 0;

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        if (user.role === 'user') {
            unreadPersonalCount = await this.personalNotification.count({
                where: {
                    isViewed: false,
                    user: Equal(user.id),
                },
            });
        } else if (user.role === 'lawyer') {
            unreadPersonalCount = await this.personalNotification.count({
                where: {
                    isViewed: false,
                    lawyer: Equal(user.id),
                },
            });
        } else if (user.role === 'admin') {
            unreadPersonalCount = await this.personalNotification.count({
                where: {
                    isViewed: false,
                    toAdmin: true,
                },
            });
        }

        const notifyIds = JSON.parse(user.viewedNotifications) || [];

        const unreadGeneralCount = await this.generalNotification.count({
            where: {
                id: Not(In(notifyIds)),
            },
        });

        return {
            unreadPersonalCount,
            unreadGeneralCount,
            totalUnreadCount: unreadPersonalCount + unreadGeneralCount,
        };
    }

    async markNotificationAsViewedForLawyer(notificationId: number, refreshToken: string) {
        const lawyer = await userRepo.findByRefreshToken(refreshToken);
        if (!lawyer) {
            throw new Error('Юрист не найден');
        }

        const viewedNotifications = JSON.parse(lawyer.viewedNotifications);

        const updatedNotifications = [...new Set([...viewedNotifications, notificationId])];
        lawyer.viewedNotifications = JSON.stringify(updatedNotifications);

        await userRepo.saveUser(lawyer, lawyer.role || '');
    }

    async markNotificationAsViewedForUser(notificationId: number, refreshToken: string) {
        const user = await userRepo.findByRefreshToken(refreshToken);
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        const viewedNotifications = JSON.parse(user.viewedNotifications);

        const updatedNotifications = [...new Set([...viewedNotifications, notificationId])];
        user.viewedNotifications = JSON.stringify(updatedNotifications);

        await userRepo.saveUser(user, user.role || '');
    }

    async markPersonalNotifications(notificationId: number) {
        const result = await this.personalNotification.update({ id: notificationId, isViewed: false }, { isViewed: true });

        if (result.affected === 0) {
            throw new Error('Уведомление не найдено или уже было просмотрено');
        }
    }
}

export const notificationRepo = new NotificationRepo();
