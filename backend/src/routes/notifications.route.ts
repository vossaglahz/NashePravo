import { Router } from 'express';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { NotificationController } from '../controllers/notification.controller';

export class NotificationRoute implements IRoute {
    public path = '/notifications';
    public router = Router();

    private controller: NotificationController;

    constructor() {
        this.controller = new NotificationController();
        this.init();
    }

    private init() {
        this.router.get('/all', authValidate, checkRole('admin'), this.controller.getAllNotifications);
        this.router.get('/count', this.controller.getUnreadNotificationsCount);
        this.router.get('/personal', this.controller.getPersonalNotifications);
        this.router.post('/personal', this.controller.postQuestion);
        this.router.get('/general', this.controller.getGeneralNotifications);
        this.router.post('/general', authValidate, checkRole('admin'), this.controller.postGeneralNotification);
        this.router.put('/personalMark', this.controller.markAsViewedPersonal);
        this.router.put('/generalMark', this.controller.markAsViewedGeneral);
    }
}
