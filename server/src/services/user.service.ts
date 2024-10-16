import { ChangePasswordDto } from '@/dto/changePassword.dto';
import { LawyerInfoDto } from '@/dto/lawyerInfo.dto';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { SignInDto } from '@/dto/sign-in.dto';
import { IBlockUser } from '@/interfaces/IUser.inerface';
import { userRepo } from '@/repositories/user.repository';

export class UserService {
    async registration(userDto: RegistrationUserDto | RegistrationLawyerDto) {
        try {
            return await userRepo.registration(userDto);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка регистрации пользователя');
            } else {
                throw new Error('Неизвестная ошибка при регистрации пользователя');
            }
        }
    }

    async login(signInUserDto: SignInDto) {
        try {
            return await userRepo.login(signInUserDto);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка входа в систему');
            } else {
                throw new Error('Неизвестная ошибка при входе в систему');
            }
        }
    }

    async logout(refreshToken: string) {
        const token = await userRepo.deleteRefreshToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: string) {
        return await userRepo.refresh(refreshToken);
    }

    async getAllLawyers() {
        return await userRepo.getAll();
    }

    async activate(activationLink: string, refreshToken: string) {
        return await userRepo.activate(activationLink, refreshToken);
    }

    async createEditRequest(refreshToken: string, lawyerInfoDto: LawyerInfoDto) {
        try {
            const lawyer = await userRepo.findLawyerByRefreshToken(refreshToken);
            if (!lawyer) {
                throw new Error('Юрист не найден');
            }

            const request = await userRepo.createRequest(lawyer, 'edit', lawyerInfoDto);
            return request;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания запроса на редактирование');
            } else {
                throw new Error('Неизвестная ошибка при создании запроса на редактирование');
            }
        }
    }

    async createDeleteRequest(refreshToken: string) {
        try {
            const lawyer = await userRepo.findLawyerByRefreshToken(refreshToken);
            if (!lawyer) {
                throw new Error('Юрист не найден');
            }

            const request = await userRepo.createRequest(lawyer, 'delete');
            return request;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания запроса на удаление');
            } else {
                throw new Error('Неизвестная ошибка при создании запроса на удаление');
            }
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto, refreshToken: string) {
        try {
            const user = await userRepo.changePassword(changePasswordDto, refreshToken);
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка смены пароля');
            } else {
                throw new Error('Неизвестная ошибка при смене пароля');
            }
        }
    }

    async blockUser(data: IBlockUser) {
        const request = await userRepo.blockUser(data);
        return request;
    }
    async unblock(data: IBlockUser) {
        const request = await userRepo.unblock(data);
        return request;
    }
}
