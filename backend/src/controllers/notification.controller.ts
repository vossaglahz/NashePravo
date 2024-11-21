import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { MarNotificationDto } from '@/dto/notificationViewed.dto';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { IQuestion } from '@/interfaces/IQuestion.interface';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { GeneralNotificationTarget } from '@/interfaces/IUser.inerface';
import { NotificationService } from '@/services/notification.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export class NotificationController {
    private service: NotificationService;

    constructor() {
        this.service = new NotificationService();
    }

    getAllNotifications: RequestHandler = async (req, res): Promise<void> => {
        try {
            const notifications = await this.service.getAllNotifications();
            res.status(200).send(notifications);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getPersonalNotifications: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const filters: IQuestionFiltered = {
                role: req.query.role as string,
                sorted: req.query.sorted as 'ASC' | 'DESC',
                status: req.query.status as unknown as string,
                page: req.query.page as unknown as number,
                limit: req.query.limit as unknown as number,
            };

            const personal = await this.service.getPersonalNotifications(filters, refreshToken);
            res.status(200).send(personal);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getGeneralNotifications: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const { page, limit, important, sorted } = req.query as unknown as IQuestion;
            const general = await this.service.getGeneralNotifications({ page, limit, important, sorted }, refreshToken);
            res.status(200).send(general);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getUnreadNotificationsCount: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const unreadNotificationsCount = await this.service.getUnreadNotificationsCount(refreshToken);  
            res.status(200).send(unreadNotificationsCount);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    postGeneralNotification: RequestHandler = async (req, res): Promise<void> => {
        const {targetAudience} = req.query as unknown as GeneralNotificationTarget;
        try {
            const generalNotificationDto = plainToInstance(GeneralNotificationDto, req.body);
            const validationErrors = await validate(generalNotificationDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const generalNotification = await this.service.postGeneralNotification(generalNotificationDto, targetAudience);
            res.status(200).send(generalNotification.message);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    postQuestion: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const questionDto = plainToInstance(personalNotificationDto, req.body);

            const validationErrors = await validate(questionDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const question = await this.service.postQuestion(refreshToken, questionDto);
            res.status(200).send(question.message);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    markAsViewedPersonal: RequestHandler = async (req, res): Promise<void> => {
        try {
            const notificationDto = plainToInstance(MarNotificationDto, req.body);

            const validationErrors = await validate(notificationDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const result = await this.service.markAsViewedPersonal(notificationDto.notificationId);
            res.status(200).send(result);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    markAsViewedGeneral: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const notificationDto = plainToInstance(MarNotificationDto, req.body);

            const validationErrors = await validate(notificationDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const result = await this.service.markAsViewedGeneral(notificationDto.notificationId, refreshToken);
            res.status(200).send(result);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
