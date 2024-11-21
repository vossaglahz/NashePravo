import { UserRepo } from '../../repositories/user.repository';
import { jest } from '@jest/globals';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { UserRoles } from '@/interfaces/IUser.inerface';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { SignInDto } from '@/dto/sign-in.dto';
import bcrypt from 'bcrypt';
import { hashPassword } from '@/helpers/hashPassword';
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwtTokens';

jest.mock('../../repositories/user.repository');

describe('UserRepo', () => {
    let userRepo: UserRepo;

    beforeEach(() => {
        userRepo = new UserRepo();

        userRepo.repo = {
            findOne: jest.fn() as jest.MockedFunction<typeof userRepo.repo.findOne>,
            save: jest.fn() as unknown as jest.MockedFunction<typeof userRepo.repo.save>,
        } as unknown as Repository<User>;

        userRepo.lawyerRepo = {
            findOne: jest.fn() as jest.MockedFunction<typeof userRepo.lawyerRepo.findOne>,
            save: jest.fn() as unknown as jest.MockedFunction<typeof userRepo.lawyerRepo.save>,
        } as unknown as Repository<Lawyer>;
    });

    describe('registration', () => {
        it('успешная регистрация пользователя', async () => {
            const userDto: RegistrationUserDto = {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: null,
                accessToken: null,
            };

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValueOnce(null);

            const userToSave: User = {
                ...userDto,
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                role: userDto.role as UserRoles.user,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
                toDoList: [],
            };

            (userRepo.repo.save as jest.MockedFunction<typeof userRepo.repo.save>).mockResolvedValueOnce(userToSave);

            const result = await userRepo.registration(userDto);
            expect(result).toBeUndefined();
        });

        it('успешная регистрация юр.лица', async () => {
            const userDto: RegistrationLawyerDto = {
                name: 'John1',
                surname: 'Doe1',
                email: 'john.doe1@example.com',
                password: '123456',
                patronymicName: 'mockPatronymicName',
                photo: 'mockPhoto',
                lawyerType: 'mockLawyerType',
                caseCategories: ['mockCaseCategories'],
                role: UserRoles.lawyer,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: null,
                accessToken: null,
                isConfirmed: false,
            };

            (userRepo.lawyerRepo.findOne as jest.MockedFunction<typeof userRepo.lawyerRepo.findOne>).mockResolvedValueOnce(null);

            const userToSave: Lawyer = {
                ...userDto,
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                role: userDto.role as UserRoles.lawyer,
                requests: [],
                dateBlocked: null,
                permanentBlocked: false,
                rating: [],
                personalNotification: [],
                viewedNotifications: '',
                toDoList: [],
                documents: [],
                averRating: 0,
            };

            (userRepo.lawyerRepo.save as jest.MockedFunction<typeof userRepo.lawyerRepo.save>).mockResolvedValueOnce(userToSave);

            const result = await userRepo.registration(userDto);
            expect(result).toBeUndefined();
        });

        it('ошибка при регистрации существующего пользователя', async () => {
            const userDto: RegistrationUserDto = {
                name: 'John',
                surname: 'Doe',
                email: 'nnn@mail.com',
                password: '123456',
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: null,
                accessToken: null,
            };

            const existingUser: User = {
                ...userDto,
                id: 1,
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                role: UserRoles.user,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
                toDoList: [],
            };

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValueOnce(existingUser);

            const result = await userRepo.registration(userDto);
            expect(result).toBeUndefined();
        });

        it('ошибка при регистрации существующего юр.лица', async () => {
            const userDto: RegistrationLawyerDto = {
                name: 'John1',
                surname: 'Doe1',
                email: 'john.doe1@example.com',
                password: '123456',
                patronymicName: 'mockPatronymicName',
                photo: 'mockPhoto',
                lawyerType: 'mockLawyerType',
                caseCategories: ['mockCaseCategories'],
                role: UserRoles.lawyer,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: null,
                accessToken: null,
                isConfirmed: false,
            };

            const userToSave: Lawyer = {
                ...userDto,
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                role: UserRoles.lawyer,
                requests: [],
                dateBlocked: null,
                permanentBlocked: false,
                rating: [],
                personalNotification: [],
                viewedNotifications: '',
                toDoList: [],
                documents: [],
                averRating: 0,
            };

            (userRepo.lawyerRepo.findOne as jest.MockedFunction<typeof userRepo.lawyerRepo.findOne>).mockResolvedValueOnce(userToSave);

            const result = await userRepo.registration(userDto);
            expect(result).toBeUndefined();
        });
    });

    describe('login', () => {
        it('успешный вход пользователя', async () => {
            const loginDto: SignInDto = {
                email: 'john.doe@example.com',
                password: '123456',
            };

            const user: User = {
                id: 1,
                name: 'John',
                surname: 'Doe',
                email: loginDto.email,
                password: await hashPassword(loginDto.password),
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
                toDoList: [],
            };

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValueOnce(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation((data: string | Buffer, encrypted: string): Promise<boolean> => {
                return Promise.resolve(data === encrypted);
            });

            jest.spyOn({ generateAccessToken, generateRefreshToken }, 'generateAccessToken').mockResolvedValue({ accessToken: 'mockAccessToken' });
            jest.spyOn({ generateAccessToken, generateRefreshToken }, 'generateRefreshToken').mockResolvedValue({ refreshToken: 'mockRefreshToken' });

            (userRepo.repo.save as jest.MockedFunction<typeof userRepo.repo.save>).mockResolvedValueOnce({
                ...user,
                refreshToken: 'newMockRefreshToken',
                accessToken: 'newMockAccessToken',
            });

            const result = await userRepo.login(loginDto);

            expect(result).toBeUndefined();
        });

        it('ошибка при неверном пароле', async () => {
            const loginDto: SignInDto = {
                email: 'john.doe@example.com',
                password: 'wrongPassword',
            };

            const user: User = {
                id: 1,
                name: 'John',
                surname: 'Doe',
                email: loginDto.email,
                password: await hashPassword(loginDto.password),
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
                toDoList: [],
            };

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockImplementation((): Promise<boolean> => {
                return Promise.resolve(false);
            });

            const result = await userRepo.login(loginDto);
            expect(result).toBeUndefined();
        });

        it('ошибка при отсутствии пользователя', async () => {
            const loginDto: SignInDto = {
                email: 'john.doe@example.com',
                password: '123456',
            };

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValue(null);

            const result = await userRepo.login(loginDto);
            expect(result).toBeUndefined();
        });
    });

    describe('deleteRefreshToken', () => {
        it('успешное удаление refreshToken', async () => {
            const refreshToken = 'mockRefreshToken';
            const user: User = {
                id: 1,
                role: UserRoles.user as UserRoles.user,
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: await hashPassword('123456'),
                isActivatedByEmail: false,
                avgRating: 0,
                activationLink: '',
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
                toDoList: [],
            };

            (userRepo.findByRefreshToken as jest.MockedFunction<typeof userRepo.findByRefreshToken>).mockResolvedValue(user);
            (userRepo.repo.save as jest.MockedFunction<typeof userRepo.repo.save>).mockResolvedValueOnce({
                ...user,
                refreshToken: '',
            });

            const result = await userRepo.deleteRefreshToken(refreshToken);
            expect(result).toBeUndefined();
        });

        it('ошибка при отсутствии пользователя', async () => {
            const refreshToken = 'mockRefreshToken';

            (userRepo.repo.findOne as jest.MockedFunction<typeof userRepo.repo.findOne>).mockResolvedValue(null);

            const result = await userRepo.deleteRefreshToken(refreshToken);
            expect(result).toBeUndefined();
        });
    });
});
