import { userRepo } from '../../repositories/user.repository';
import { UserService } from '@/services/user.service';
import { UserRoles } from '@/interfaces/IUser.inerface';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import { SignInDto } from '@/dto/sign-in.dto';

jest.mock('../../repositories/user.repository');

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    describe('registration', () => {
        it('регистрация нового пользователя', async () => {
            const newUser: RegistrationUserDto = {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
            };

            (userRepo.registration as jest.Mock).mockResolvedValue(newUser);

            const res = await userService.registration(newUser);
            expect(res).toEqual(newUser);
        });

        it('регистрация нового юр.лица', async () => {
            const newUser: RegistrationLawyerDto = {
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
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
                isConfirmed: false,
            };

            (userRepo.registration as jest.Mock).mockResolvedValue(newUser);

            const res = await userService.registration(newUser);
            expect(res).toEqual(newUser);
        });

        it('проверка ошибки недействительных данных', async () => {
            const invalidUser: RegistrationUserDto = {
                name: '',
                surname: 'Doe',
                email: 'invalidemail',
                password: 'short',
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
            };

            (userRepo.registration as jest.Mock).mockRejectedValue(new Error('Ошибка регистрации пользователя'));
            await expect(userService.registration(invalidUser)).rejects.toThrow('Ошибка регистрации пользователя');
        });

        it('проверка ошибки недействительных данных юр.лица', async () => {
            const invalidUser: RegistrationLawyerDto = {
                name: '',
                surname: 'Doe',
                email: 'invalidemail',
                password: 'short',
                patronymicName: 'mockPatronymicName',
                photo: 'mockPhoto',
                lawyerType: 'mockLawyerType',
                caseCategories: ['mockCaseCategories'],
                role: UserRoles.lawyer,
                isActivatedByEmail: false,
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
                isConfirmed: false,
            };

            (userRepo.registration as jest.Mock).mockRejectedValue(new Error('Ошибка регистрации юр.лица'));
            await expect(userService.registration(invalidUser)).rejects.toThrow('Ошибка регистрации юр.лица');
        });

        it('проверка на существующего пользователя', async () => {
            const newUser: RegistrationUserDto = {
                name: 'John',
                surname: 'Doe',
                email: 'john.doe@example.com',
                password: '123456',
                role: UserRoles.user,
                isActivatedByEmail: false,
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
            };

            (userRepo.registration as jest.Mock).mockRejectedValue('Unexpected error');
            await expect(userService.registration(newUser)).rejects.toThrow('Неизвестная ошибка при регистрации пользователя');
        });

        it('проверка на существующего пользователя юр.лица', async () => {
            const newUser: RegistrationLawyerDto = {
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
                activationLink: 'mockActivationLink',
                refreshToken: null,
                accessToken: null,
                isConfirmed: false,
            };

            (userRepo.registration as jest.Mock).mockRejectedValue('Unexpected error');
            await expect(userService.registration(newUser)).rejects.toThrow('Неизвестная ошибка при регистрации пользователя');
        });
    });

    describe('login', () => {
        it('авторизация пользователя', async () => {
            const loginData: SignInDto = {
                email: 'john.doe@example.com',
                password: '123456',
            };

            (userRepo.login as jest.Mock).mockResolvedValue(loginData);
            const res = await userService.login(loginData);
            expect(res).toEqual(loginData);
        });

        it('проверка недействительных учетных данных', async () => {
            const loginDta: SignInDto = {
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            };
            (userRepo.login as jest.Mock).mockRejectedValue(new Error('Ошибка входа в систему'));
            await expect(userService.login(loginDta)).rejects.toThrow('Ошибка входа в систему');
        });

        it('проверка на не существующего пользователя', async () => {
            const loginDta: SignInDto = {
                email: 'nonexistent@example.com',
                password: '123456',
            };

            (userRepo.login as jest.Mock).mockRejectedValue('Unexpected error');
            await expect(userService.login(loginDta)).rejects.toThrow('Неизвестная ошибка при входе в систему');
        });
    });

    describe('logout', () => {
        it('выход пользователя из системы', async () => {
            const refreshToken = 'mockRefreshToken';

            (userRepo.deleteRefreshToken as jest.Mock).mockRejectedValue(new Error(refreshToken));
            await expect(userService.logout(refreshToken)).rejects.toThrow(refreshToken);
        });

        it('ошибка на отсутствие токена в запросе', async () => {
            const refreshToken = 'mockRefreshToken';

            (userRepo.deleteRefreshToken as jest.Mock).mockRejectedValue(new Error('Ошибка выхода из системы'));
            await expect(userService.logout(refreshToken)).rejects.toThrow('Ошибка выхода из системы');
        });
    });
});
