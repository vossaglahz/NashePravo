import { ChatHistoryRepository } from '@/repositories/chatHistory.repository';
import { AppDataSource } from '@/config/dataSource';
import { Repository } from 'typeorm';
import { ChatHistory } from '@/entities/chatHistory.entity';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { IMessages } from '@/interfaces/IChatHistory.interface';
import { UserRoles } from '@/interfaces/IUser.inerface';

jest.mock('@/config/dataSource', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock('@/repositories/dealHistory.repository', () => ({
    dealHistoryRepo: {
        find: jest.fn(),
    },
}));

describe('ChatHistoryRepository', () => {
    let chatRepo: ChatHistoryRepository;
    let chatHistoryRepoMock: jest.Mocked<Repository<ChatHistory>>;
    let userRepoMock: jest.Mocked<Repository<User>>;
    let lawyerRepoMock: jest.Mocked<Repository<Lawyer>>;

    beforeEach(() => {
        chatHistoryRepoMock = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<ChatHistory>>;
        userRepoMock = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<User>>;
        lawyerRepoMock = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<Lawyer>>;

        (AppDataSource.getRepository as jest.Mock).mockImplementation(entity => {
            if (entity === ChatHistory) return chatHistoryRepoMock;
            if (entity === User) return userRepoMock;
            if (entity === Lawyer) return lawyerRepoMock;
            return undefined;
        });

        chatRepo = new ChatHistoryRepository();
    });

    describe('getChatHistory', () => {
        it('should return grouped chat history for a user', async () => {
            const mockChat: ChatHistory = {
                userId: 1,
                lawyerId: 2,
                messages: [
                    { id: '1', name: 'Almaz', photo: '', role: 'user', text: 'Hello!', somebodyID: 1, data: new Date('2024-11-15T12:42:08.756Z') },
                    { id: '2', name: 'Deimos', photo: '', role: 'lawyer', text: 'Hi!', somebodyID: 2, data: new Date('2024-11-15T12:43:08.756Z') },
                ],
                isClose: false,
                id: 1,
            };

            const mockedUser: User = {
                id: 1,
                role: UserRoles.user,
                refreshToken: 'valid-token',
                name: 'Almaz',
                surname: 'Taigara',
                email: 'mocked@gmail.com',
                password: 'mockedPasswd',
                photo: 'mocked.png',
                avgRating: 5,
                isActivatedByEmail: true,
                activationLink: 'mockedActiveLink',
                personalNotification: [],
                patronymicName: '',
                accessToken: '',
                rating: [],
                toDoList: [],
                dateBlocked: null,
                permanentBlocked: false,
                viewedNotifications: '',
                requests: [],
            };

            userRepoMock.findOne.mockResolvedValue(mockedUser);
            chatHistoryRepoMock.findOne.mockResolvedValueOnce(mockChat);

            const result = await chatRepo.getChatHistory('valid-token', 2);
            console.log('this is issue =====', result.groupHistory);

            expect(result.isClose).toBe(false);
            expect(result.groupHistory['15.11.2024']).toHaveLength(2);
            expect(userRepoMock.findOne).toHaveBeenCalledWith({ where: { refreshToken: 'valid-token' } });
        });
    });

    describe('groupMessagesByDate', () => {
        it('should group messages by date', () => {
            const messages: IMessages[] = [
                { data: new Date('2024-11-15T12:42:08.756Z'), id: '1', name: 'Almaz', photo: '', text: 'go?', role: 'user', somebodyID: 1 },
                { data: new Date('2024-11-15T12:43:08.756Z'), id: '2', name: 'Deimos', photo: '', text: 'yes', role: 'lawyer', somebodyID: 2 },
                { data: new Date('2024-11-16T12:43:08.756Z'), id: '3', name: 'Almaz', photo: '', text: 'then lets go', role: 'user', somebodyID: 1 },
            ];

            const result = chatRepo['groupMessagesByDate'](messages);
            expect(result['15.11.2024']).toHaveLength(2);
        });
    });
});
