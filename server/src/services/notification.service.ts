import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { NotificationRepo } from '@/repositories/notification.repository';

export class NotificationService {
    private repository: NotificationRepo;

    constructor() {
        this.repository = new NotificationRepo();
    }

    async getAllNotifications() {
        const notifications = await this.repository.getAllNotifications();
        return notifications;
    }

    async getPersonalNotifications(filters: IQuestionFiltered) {
        const personal = await this.repository.getPersonalNotifications(filters);
        return personal;
    }

    async getGeneralNotifications() {
        const general = await this.repository.getGeneralNotifications();
        return general;
    }

    async postGeneralNotification(generalNotificationDto: GeneralNotificationDto) {
        const generalNotification = await this.repository.postGeneralNotification(generalNotificationDto);
        return generalNotification;
    }

    async postQuestion(refreshToken: string, questionDto: personalNotificationDto) {
        const questions = await this.repository.postQuestion(refreshToken, questionDto);
        return questions;
    }
}
