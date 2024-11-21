import request from 'supertest';
import app from '../../index';
import { userRepo } from '../../repositories/user.repository';
import { AppDataSource } from '@/config/dataSource';
import { UserRoles } from '@/interfaces/IUser.inerface';

jest.mock('../../repositories/user.repository');

describe('UserController', () => {
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('POST /users/registration', () => {
        it('регистрация нового пользователя', async () => {
            const newUser = {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
                role: UserRoles.user,
            };

            (userRepo.registration as jest.Mock).mockResolvedValue(newUser);

            const res = await request(app.getApp()).post('/users/registration').send(newUser).expect(201);

            expect(res.body).toEqual(
                expect.objectContaining({
                    name: 'John',
                    surname: 'Doe',
                    email: 'john.doe@example.com',
                }),
            );
            expect(res.header['set-cookie']).toBeDefined();
            expect(res.header['set-cookie'][0]).toMatch(/refreshToken=/);
        });

        it('проверка ошибки недействительных данных', async () => {
            const invalidUser = {
                name: '',
                email: 'invalidemail',
                password: 'short',
                role: UserRoles.user,
            };

            const res = await request(app.getApp()).post('/users/registration').send(invalidUser).expect(400);

            expect(res.body.errors).toBeDefined();
        });

        it('проверка на существующего пользователя', async () => {
            const newUser = {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
                role: UserRoles.user,
            };

            (userRepo.registration as jest.Mock).mockRejectedValue(new Error('Пользователь с почтовым адресом john.doe@example.com уже существует'));

            const res = await request(app.getApp()).post('/users/registration').send(newUser).expect(409);

            expect(res.body.errors).toBeDefined();
        });
    });

    describe('POST /users/login', () => {
        it('авторизация пользователя', async () => {
            const loginData = {
                email: 'john.doe@example.com',
                password: '123456',
            };

            const userResponse = {
                email: 'john.doe@example.com',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
            };

            (userRepo.login as jest.Mock).mockResolvedValue(userResponse);

            const res = await request(app.getApp()).post('/users/login').send(loginData).expect(200);

            expect(res.body).toEqual(expect.objectContaining(userResponse));
            expect(res.header['set-cookie']).toBeDefined();
            expect(res.header['set-cookie'][0]).toMatch(/refreshToken=/);
        });

        it('проверка недействительных учетных данных', async () => {
            const loginDta = {
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            };

            (userRepo.login as jest.Mock).mockRejectedValue(new Error('Неверный пароль'));

            const res = await request(app.getApp()).post('/users/login').send(loginDta).expect(401);

            expect(res.body.message).toBe('Неверный пароль');
        });

        it('проверка на не существующего пользователя', async () => {
            const loginDta = {
                email: 'nonexistent@example.com',
                password: '123456',
            };

            (userRepo.login as jest.Mock).mockRejectedValue(new Error('Пользователь не найден'));

            const res = await request(app.getApp()).post('/users/login').send(loginDta).expect(404);

            expect(res.body.message).toBe('Пользователь не найден');
        });
    });

    describe('POST /users/logout', () => {
        it('выход пользователя из системы', async () => {
            const refreshToken = 'mockRefreshToken';

            const res = await request(app.getApp()).post('/users/logout').set('Cookie', `refreshToken=${refreshToken}`).expect(200);

            expect(res.body).toEqual(expect.objectContaining({}));
            expect(res.header['set-cookie']).toBeDefined();
            expect(res.header['set-cookie'][0]).toMatch(/refreshToken=; Path=\/; Expires=/);
        });

        it('ошибка на отсутствие токена в запросе', async () => {
            const res = await request(app.getApp()).post('/users/logout').expect(400);

            expect(res.body.message).toBe('Refresh token not provided');
        });
    });
});
