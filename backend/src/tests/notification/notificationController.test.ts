import request from 'supertest';
import app from '../../index';
import { NotificationService } from '@/services/notification.service';
import { AppDataSource } from '@/config/dataSource';
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwtTokens';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { hashPassword } from '@/helpers/hashPassword';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@/services/notification.service');

describe('NotificationController', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userPayload: RegistrationUserDto = {
            role: 'admin',
            email: 'testuser@example.com',
            password: '123456',
            name: 'mockedUser',
            surname: 'mockedSurName',
            isActivatedByEmail: false,
            activationLink: '',
            refreshToken: null,
            accessToken: null,
        };
        userPayload.password = await hashPassword(userPayload.password);
        userPayload.activationLink = uuidv4();
        accessToken = (await generateAccessToken(userPayload)).accessToken;
        refreshToken = (await generateRefreshToken(userPayload)).refreshToken;
        userPayload.accessToken = accessToken;
        userPayload.refreshToken = refreshToken;
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /notifications/all', () => {
        it('должен вернуть 200 и список всех уведомлений', async () => {
            const notifications = {
                generalNotifications: [],
                personalNotifications: [],
            };
            jest.spyOn(NotificationService.prototype, 'getAllNotifications').mockResolvedValue(notifications);

            const response = await request(app.getApp())
                .get('/notifications/all')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(notifications);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'getAllNotifications').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .get('/notifications/all')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('GET /notifications/personal', () => {
        it('должен вернуть 200 и персональные уведомления пользователя', async () => {
            const notifications = {
                notifications: [],
                totalCount: 0,
            };
            jest.spyOn(NotificationService.prototype, 'getPersonalNotifications').mockResolvedValue(notifications);

            const response = await request(app.getApp())
                .get('/notifications/personal')
                .query({ role: 'user', sorted: 'ASC' })
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(notifications);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'getPersonalNotifications').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .get('/notifications/personal')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('GET /notifications/general', () => {
        it('должен вернуть 200 и общие уведомления', async () => {
            const notifications = {
                notifications: [],
                totalCount: 0,
            };
            jest.spyOn(NotificationService.prototype, 'getGeneralNotifications').mockResolvedValue(notifications);

            const response = await request(app.getApp())
                .get('/notifications/general')
                .query({ page: 1, limit: 10, important: false, sorted: 'ASC' })
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(notifications);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'getGeneralNotifications').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .get('/notifications/general')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('GET /notifications/count', () => {
        it('должен вернуть 200 и количество непрочитанных уведомлений', async () => {
            const unreadCount = {
                unreadPersonalCount: 5,
                unreadGeneralCount: 6,
                totalUnreadCount: 11,
            };
            jest.spyOn(NotificationService.prototype, 'getUnreadNotificationsCount').mockResolvedValue(unreadCount);

            const response = await request(app.getApp())
                .get('/notifications/count')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(unreadCount);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'getUnreadNotificationsCount').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .get('/notifications/count')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('POST /notifications/general', () => {
        it('должен вернуть 200 и сообщение при успешной публикации уведомления', async () => {
            const message = { message: 'Ваше уведомление успешно отправлено всем' };
            (NotificationService.prototype.postGeneralNotification as jest.Mock).mockResolvedValue(message);

            const response = await request(app.getApp())
                .post('/notifications/general')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .query({ targetAudience: 'user' })
                .send({ topic: 'General Notification', content: 'Content', important: false });

            expect(response.status).toBe(200);
        });

        it('должен вернуть 400 при ошибке валидации', async () => {
            const response = await request(app.getApp())
                .post('/notifications/general')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send({ title: 12, content: 300 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('PUT /notifications/personalMark', () => {
        it('должен вернуть 200 при успешной пометке уведомления как прочитанного', async () => {
            jest.spyOn(NotificationService.prototype, 'markAsViewedPersonal');

            const response = await request(app.getApp())
                .put('/notifications/personalMark')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send({ notificationId: 1 });
            console.log(response.body);

            expect(response.status).toBe(200);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'markAsViewedPersonal').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .put('/notifications/personalMark')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send({ notificationId: 1 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });

    describe('PUT /notifications/generalMark', () => {
        it('должен вернуть 200 при успешной пометке общего уведомления как прочитанного', async () => {
            jest.spyOn(NotificationService.prototype, 'markAsViewedGeneral');

            const response = await request(app.getApp())
                .put('/notifications/generalMark')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send({ notificationId: 1 });

            expect(response.status).toBe(200);
        });

        it('должен вернуть 500 при ошибке сервиса', async () => {
            jest.spyOn(NotificationService.prototype, 'markAsViewedPersonal').mockRejectedValue(new Error('Service error'));

            const response = await request(app.getApp())
                .put('/notifications/personalMark')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .send({ notificationId: 1 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal Server Error' });
        });
    });
});
