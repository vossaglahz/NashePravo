import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { IQuestion } from '@/interfaces/IQuestion.interface';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { NotificationRepo } from '@/repositories/notification.repository';
import { userRepo } from '@/repositories/user.repository';

export class NotificationService {
    private repository: NotificationRepo;

    constructor() {
        this.repository = new NotificationRepo();
    }

    async getAllNotifications() {
        const notifications = await this.repository.getAllNotifications();
        return notifications;
    }

    async getPersonalNotifications(filters: IQuestionFiltered, refreshToken: string) {
        const personal = await this.repository.getPersonalNotifications(filters, refreshToken);
        return personal;
    }


    async getGeneralNotifications(filters: IQuestion, refreshToken:string) {
        const user = await userRepo.findUserByRefreshToken(refreshToken)
        const lawyer = await userRepo.findLawyerByRefreshToken(refreshToken);
        const general = await this.repository.getGeneralNotifications(filters,user?user.role:lawyer?lawyer.role:"");
        return general;
    }

    async postGeneralNotification(generalNotificationDto: GeneralNotificationDto, targetAudience:string) {
        const generalNotification = await this.repository.postGeneralNotification(generalNotificationDto, targetAudience);
        return generalNotification;
    }

    async postQuestion(refreshToken: string, questionDto: personalNotificationDto) {
        const questions = await this.repository.postQuestion(refreshToken, questionDto);
        return questions;
    }

    async getUnreadNotificationsCount(refreshToken: string) {
        const unreadNotifications = await this.repository.getUnreadNotificationsCount(refreshToken);
        return unreadNotifications;
    }

    async markAsViewedPersonal(notificationId: number) {
        await this.repository.markPersonalNotifications(notificationId);
    }

    async markAsViewedGeneral(notificationId: number, refreshToken: string) {
        const user = await userRepo.findByRefreshToken(refreshToken);
        if(!user) {
            throw new Error('Пользователь не найден');
        }
        if (user.role === 'user') {
            await this.repository.markNotificationAsViewedForUser(notificationId, refreshToken);
        } else if(user.role === 'lawyer') {
            await this.repository.markNotificationAsViewedForLawyer(notificationId, refreshToken);
        }
    }
}
