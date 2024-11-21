import { GeneralNotificationDto } from "@/dto/generalNotification.dto";
import { personalNotificationDto } from "@/dto/personalQuestion.dto";
import { IQuestion } from "@/interfaces/IQuestion.interface";
import { NotificationRepo } from "@/repositories/notification.repository";
import { userRepo } from "@/repositories/user.repository";


jest.mock('../../repositories/user.repository');
jest.mock('@/config/dataSource', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => {
            return {
                find: jest.fn(),
                findOne: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                count: jest.fn(),
                createQueryBuilder: jest.fn(() => ({
                    leftJoinAndSelect: jest.fn().mockReturnThis(),
                    select: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    take: jest.fn().mockReturnThis(),
                    getManyAndCount: jest.fn(),
                })),
            };
        }),
    },
}));

describe('NotificationRepo', () => {
    let repo: NotificationRepo;

    beforeEach(() => {
        repo = new NotificationRepo();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllNotifications', () => {
        it('should return all notifications', async () => {
            const generalNotifications = [{ id: 1, content: 'General notification' }];
            const personalNotifications = [{ id: 2, content: 'Personal notification' }];
            
            (repo['generalNotification'].find as jest.Mock).mockResolvedValue(generalNotifications);
            (repo['personalNotification'].find as jest.Mock).mockResolvedValue(personalNotifications);

            const result = await repo.getAllNotifications();
            
            expect(result).toEqual({
                generalNotifications,
                personalNotifications,
            });
        });
    });

    describe('getPersonalNotifications', () => {
        it('should return personal notifications for a user', async () => {
            const filters = { role: 'user', page: 1, limit: 5 };
            const refreshToken = 'mockToken';
            const user = { id: 1, role: 'user' };
            const notifications = [{ id: 1, content: 'User notification' }];
            
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(user);
            (repo['personalNotification'].createQueryBuilder as jest.Mock).mockReturnValue({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([notifications, 1]),
            });

            const result = await repo.getPersonalNotifications(filters, refreshToken);

            expect(result).toEqual({
                notifications,
                totalCount: 1,
            });
        });
    });

    describe('getGeneralNotifications', () => {
        it('should return general notifications based on filters', async () => {
            const filters: IQuestion = { important: "true", page: 1, limit: 5 };
            const notifications = [{ id: 1, content: 'General notification' }];
            
            (repo['generalNotification'].find as jest.Mock).mockResolvedValue(notifications);
            (repo['generalNotification'].count as jest.Mock).mockResolvedValue(1);

            const result = await repo.getGeneralNotifications(filters);

            expect(result).toEqual({
                notifications,
                totalCount: 1,
            });
        });
    });

    describe('postGeneralNotification', () => {
        it('should save a general notification', async () => {
            const notificationDto: GeneralNotificationDto = {
                topic: 'Topic',
                content: 'Content',
                important: false, 
            };
            const targetAudience = 'all';
            
            (repo['generalNotification'].save as jest.Mock).mockResolvedValue(undefined);

            const result = await repo.postGeneralNotification(notificationDto, targetAudience);

            expect(result).toEqual({ message: 'Ваше уведомление успешно отправлено всем' });
            expect(repo['generalNotification'].save).toHaveBeenCalledWith({ ...notificationDto, role: targetAudience });
        });

        it('should throw an error if save fails', async () => {
            const notificationDto: GeneralNotificationDto = {
                topic: 'Topic',
                content: 'Content',
                important: false,
            };
            const targetAudience = 'all';
            
            (repo['generalNotification'].save as jest.Mock).mockRejectedValue(new Error('Save failed'));

            await expect(repo.postGeneralNotification(notificationDto, targetAudience)).rejects.toThrow('Ваш вопрос не был отправлен');
        });
    });

    describe('postQuestion', () => {
        it('should save a personal notification from a user', async () => {
            const refreshToken = 'mockToken';
            const questionDto: personalNotificationDto = {
                topic: 'Question',
                content: 'Content',
                questionId: 1,
                userId: 1,
                lawyerId: null,
            };
            const user = { id: 1, role: 'user' };
            
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(user);
            (repo['personalNotification'].save as jest.Mock).mockResolvedValue(undefined);

            const result = await repo.postQuestion(refreshToken, questionDto);

            expect(result).toEqual({ message: 'Ваш вопрос успешно отправлен админу' });
            expect(repo['personalNotification'].save).toHaveBeenCalledWith(expect.objectContaining({
                topic: questionDto.topic,
                content: questionDto.content,
                answered: false,
                toAdmin: true,
                role: user.role,
                user: user.id,
                lawyer: null,
            }));
        });

        it('should handle admin posting a question', async () => {
            const refreshToken = 'mockToken';
            const questionDto: personalNotificationDto = {
                topic: 'Question',
                content: 'Content',
                questionId: 3,
                userId: 1,
                lawyerId: 2,
            };
            const admin = { id: 2, role: 'admin' };
            const selectedQuestion = { id: 3 };
            
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(admin);
            (repo['personalNotification'].findOne as jest.Mock).mockResolvedValue(selectedQuestion);
            (repo['personalNotification'].update as jest.Mock).mockResolvedValue({ affected: 1 });
            (repo['personalNotification'].save as jest.Mock).mockResolvedValue(undefined);

            const result = await repo.postQuestion(refreshToken, questionDto);

            expect(result).toEqual({ message: 'Ваш вопрос успешно отправлен админу' });
            expect(repo['personalNotification'].update).toHaveBeenCalledWith({ id: selectedQuestion.id }, { answered: true });
            expect(repo['personalNotification'].save).toHaveBeenCalledWith(expect.objectContaining({
                topic: questionDto.topic,
                content: questionDto.content,
                answered: false,
                toAdmin: false,
                role: admin.role,
                user: questionDto.userId,
                lawyer: questionDto.lawyerId,
            }));
        });
    });

    describe('getUnreadNotificationsCount', () => {
        it('should return counts of unread notifications', async () => {
            const refreshToken = 'mockToken';
            const user = { id: 1, role: 'user', viewedNotifications: '[]' };
            const unreadPersonalCount = 5;
            const unreadGeneralCount = 3;
            
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(user);
            (repo['personalNotification'].count as jest.Mock).mockResolvedValue(unreadPersonalCount);
            (repo['generalNotification'].count as jest.Mock).mockResolvedValue(unreadGeneralCount);

            const result = await repo.getUnreadNotificationsCount(refreshToken);

            expect(result).toEqual({
                unreadPersonalCount,
                unreadGeneralCount,
                totalUnreadCount: unreadPersonalCount + unreadGeneralCount,
            });
        });

        it('should throw an error if user is not found', async () => {
            const refreshToken = 'mockToken';
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(null);

            await expect(repo.getUnreadNotificationsCount(refreshToken)).rejects.toThrow('Пользователь не найден');
        });
    });

    describe('markNotificationAsViewedForLawyer', () => {
        it('should mark notification as viewed for a lawyer', async () => {
            const refreshToken = 'mockToken';
            const lawyer = { id: 1, viewedNotifications: '[]', role: 'lawyer' };
            const notificationId = 1;
            
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(lawyer);
            (userRepo.saveUser as jest.Mock).mockResolvedValue(undefined);

            await repo.markNotificationAsViewedForLawyer(notificationId, refreshToken);

            expect(lawyer.viewedNotifications).toEqual(JSON.stringify([notificationId]));
            expect(userRepo.saveUser).toHaveBeenCalledWith(lawyer, lawyer.role);
        });

        it('should throw an error if lawyer is not found', async () => {
            const refreshToken = 'mockToken';
            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(null);

            await expect(repo.markNotificationAsViewedForLawyer(1, refreshToken)).rejects.toThrow('Юрист не найден');
        });
    });
});
