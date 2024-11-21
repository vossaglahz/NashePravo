import request from 'supertest';
import app from '../../index'; // Основной экземпляр приложения
import { AppDataSource } from '@/config/dataSource';
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwtTokens';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { hashPassword } from '@/helpers/hashPassword';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory } from '@/entities/chatHistory.entity';

describe('ChatHistoryController', () => {
    let accessToken: string;
    let refreshToken: string;
    let chatHistoryRepository: any; // Мок для репозитория

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userPayload: RegistrationUserDto = {
            role: 'user',
            email: 'chatuser@example.com',
            password: 'password123',
            name: 'TestUser',
            surname: 'TestSurname',
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

        chatHistoryRepository = AppDataSource.getRepository(ChatHistory);
        jest.spyOn(chatHistoryRepository, 'find');
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /chat', () => {
        it('должен вернуть 200 и историю чата', async () => {
            const mockChatHistory = { groupHistory: {} };

            (chatHistoryRepository.find as jest.Mock).mockResolvedValue(mockChatHistory);

            const response = await request(app.getApp())
                .get('/chat')
                .query({ opponentId: "1" })
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockChatHistory);
        });
    });
});
