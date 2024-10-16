import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
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
            const filters: IQuestionFiltered = {
                role: req.query.role as string,
                questionDate: req.query.questionDate as 'asc' | 'desc',
                status: req.query.status as unknown as string,
                page: req.query.page as unknown as number,
                limit: req.query.limit as unknown as number,
            };

            const personal = await this.service.getPersonalNotifications(filters);
            res.status(200).send(personal);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getGeneralNotifications: RequestHandler = async (req, res): Promise<void> => {
        try {
            const general = await this.service.getGeneralNotifications();
            res.status(200).send(general);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    postGeneralNotification: RequestHandler = async (req, res): Promise<void> => {
        console.log(1);
        try {
            console.log(1);
            const generalNotificationDto = plainToInstance(GeneralNotificationDto, req.body);
            const validationErrors = await validate(generalNotificationDto);
            console.log(1);

            console.log(generalNotificationDto, '=============');

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const generalNotification = await this.service.postGeneralNotification(generalNotificationDto);
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
}
