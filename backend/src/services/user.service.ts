import { ChangePasswordDto } from '@/dto/changePassword.dto';
import { LawyerInfoDto } from '@/dto/lawyerInfo.dto';
import { RecoverPassDto } from '@/dto/recoverPass.dto';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { SignInDto } from '@/dto/sign-in.dto';
import { UserInfoDto } from '@/dto/userInfo.dto';
import { Lawyer } from '@/entities/lawyers.entity';
import { User } from '@/entities/user.entity';
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

    async getLawyersList(filters: {page?: number; limit?: number, lawyerId?:number}) {
        return await userRepo.getLawyersList(filters);
    }

    async activate(activationLink: string, refreshToken: string) {
        return await userRepo.activate(activationLink, refreshToken);
    }

    async createEditRequest(userForRequest: User | Lawyer, infoDto: UserInfoDto | LawyerInfoDto) {
        try {
            let request;
            if (userForRequest.role === 'user') {
                request = await userRepo.createUserRequest(userForRequest, 'edit', infoDto);
            } else if (userForRequest.role === 'lawyer') {
                if (this.isLawyerInfoDto(infoDto)) {
                    request = await userRepo.createLawyerRequest(userForRequest, 'edit', infoDto);
                }
            }
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
            const user = await userRepo.findByRefreshToken(refreshToken);
            let userForRequest: User | Lawyer;

            if (!user) {
                throw new Error('Пользователь не найден');
            }

            let request;
            if (user.role === 'user') {
                userForRequest = user as User;
                request = await userRepo.createUserRequest(userForRequest, 'delete');
            } else if (user.role === 'lawyer') {
                userForRequest = user as Lawyer;
                request = await userRepo.createLawyerRequest(userForRequest, 'delete');
            }
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

    async changeRecoverPasswordUser(body: any, refreshToken: string) {
        try {
            const user = await userRepo.changeRecoverPasswordUser(body, refreshToken);
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка смены пароля');
            } else {
                throw new Error('Неизвестная ошибка при смене пароля');
            }
        }
    }

    async recoverPasswordUser(recoverPassDto: RecoverPassDto, refreshToken: string) {
        const request = await userRepo.recoverPasswordUser(recoverPassDto, refreshToken);
        return request;
    }

    private isLawyerInfoDto(infoDto: UserInfoDto | LawyerInfoDto): infoDto is LawyerInfoDto {
        return 'lawyerType' in infoDto && 'caseCategories' in infoDto;
    }
}
