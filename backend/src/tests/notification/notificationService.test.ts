import { NotificationService } from '@/services/notification.service';
import { NotificationRepo } from '@/repositories/notification.repository';
import { userRepo } from '@/repositories/user.repository';
import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { GeneralNotifications } from '@/entities/generalNotification.entity';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { IQuestion } from '@/interfaces/IQuestion.interface';
import { PersonalNotification } from '@/entities/personalNotification.entity';

jest.mock('@/repositories/notification.repository');
jest.mock('@/repositories/user.repository');

describe('NotificationService', () => {
    let service: NotificationService;
    let notificationRepoMock: jest.Mocked<NotificationRepo>;

    beforeEach(() => {
        notificationRepoMock = new NotificationRepo() as jest.Mocked<NotificationRepo>;
        service = new NotificationService();
        (service as any).repository = notificationRepoMock;
    });

    describe('getAllNotifications', () => {
        it('should return all notifications', async () => {
            const notifications = {
                generalNotifications: [
                    Object.assign(new GeneralNotifications(), {
                        id: 1,
                        content: 'General notification',
                        topic: 'General',
                        important: false,
                        role: 'user',
                        createdAt: '2024-01-01T00:00:00Z',
                        _createdAt: new Date()
                    })
                ],
                personalNotifications: [
                    Object.assign(new PersonalNotification(), {
                        id: 2,
                        content: 'Personal notification',
                        topic: 'Personal',
                        role: 'user',
                        createdAt: '2024-01-01T00:00:00Z',
                        _createdAt: new Date()
                    })
                ]
            };

            notificationRepoMock.getAllNotifications.mockResolvedValue(notifications);

            const result = await service.getAllNotifications();
            expect(result).toEqual(notifications);
        });
    });

    describe('getPersonalNotifications', () => {
        it('should return personal notifications for a user', async () => {
            const filters: IQuestionFiltered = { limit: 5, page: 1 };
            const refreshToken = 'mockToken';
            const notifications = [ Object.assign(new GeneralNotifications(), {
                id: 1,
                content: 'General notification',
                topic: 'General',
                important: false,
                role: 'user',
                createdAt: '2024-01-01T00:00:00Z',
                _createdAt: new Date()
            })];
            notificationRepoMock.getPersonalNotifications.mockResolvedValue({
                notifications,
                totalCount: 1,
            });

            const result = await service.getPersonalNotifications(filters, refreshToken);
            expect(result).toEqual({ notifications, totalCount: 1 });
        });
    });

    describe('getGeneralNotifications', () => {
        it('should return general notifications based on user or lawyer role', async () => {
            const filters: IQuestion = { limit: 5, page: 1 };
            const refreshToken = 'mockToken';
            const notifications = [
                Object.assign(new GeneralNotifications(), {
                    id: 1,
                    content: 'General notification',
                    topic: 'General',
                    important: false,
                    role: 'user',
                    createdAt: '2024-01-01T00:00:00Z',
                    _createdAt: new Date()
                })
            ];
            jest.spyOn(userRepo, 'findUserByRefreshToken').mockResolvedValue({
                id: 0,
                name: 'Almaz',
                surname: 'Taigara',
                email: 'mocked@gmail.com',
                password: 'mockedPasswd',
                patronymicName: 'mockedName',
                isActivatedByEmail: true,
                activationLink: 'mockedActiveLink',
                refreshToken: 'mockedToken',
                accessToken: 'mockedAccessToken',
                viewedNotifications: '[]',
                role: 'user',
                photo: 'mocked.png',
                avgRating: 5,
                personalNotification: [],
                rating: [],
                dateBlocked: null,
                city: 'Almaty',
                about: 'Just a boy',
                permanentBlocked: false,
                requests: []
            });

            notificationRepoMock.getGeneralNotifications.mockResolvedValue({
                notifications,
                totalCount: 1,
            });

            const result = await service.getGeneralNotifications(filters, refreshToken);
            expect(result).toEqual({ notifications, totalCount: 1 });
        });
    });

    describe('postGeneralNotification', () => {
        it('should send a general notification successfully', async () => {
            const notificationDto: GeneralNotificationDto = { content: 'New general notification', important: false, topic: 'mocked Topic' };
            const targetAudience = 'all';
            const response = { message: 'Ваше уведомление успешно отправлено всем' };

            notificationRepoMock.postGeneralNotification.mockResolvedValue(response);

            const result = await service.postGeneralNotification(notificationDto, targetAudience);
            expect(result).toEqual(response);
            expect(notificationRepoMock.postGeneralNotification).toHaveBeenCalledWith(notificationDto, targetAudience);
        });
    });
});