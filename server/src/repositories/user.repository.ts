import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { SignInDto } from '@/dto/sign-in.dto';
import { Repository } from 'typeorm';
import { IBlockUser, IUser, UserRoles } from '@/interfaces/IUser.inerface';
import { Mailer } from '@/helpers/mailer';
import { generateAccessToken, generateRefreshToken, validateAccessToken, validateRefreshToken } from '@/helpers/jwtTokens';
import { hashPassword } from '@/helpers/hashPassword';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import { Lawyer } from '@/entities/lawyers.entity';
import { LawyerInfoDto } from '@/dto/lawyerInfo.dto';
import { ChangePasswordDto } from '@/dto/changePassword.dto';
import { LawyerRequest } from '@/entities/lawyerRequest.entity';

export class UserRepo {
    public repo: Repository<User>;
    public lawyerRepo: Repository<Lawyer>;
    public lawyerRequestRepo: Repository<LawyerRequest>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
        this.lawyerRepo = AppDataSource.getRepository(Lawyer);
        this.lawyerRequestRepo = AppDataSource.getRepository(LawyerRequest);
    }

    async registration(userDto: RegistrationUserDto | RegistrationLawyerDto) {
        try {
            let updatedUser;
            if (userDto.role === 'user' || userDto.role === 'admin') {
                const foundUser = await this.repo.findOne({ where: { email: userDto.email } });
                if (foundUser) throw new Error(`Пользователь с почтовым адресом ${userDto.email} уже существует`);

                userDto.password = await hashPassword(userDto.password);

                const activationLink = uuidv4();
                const mailerSend = new Mailer();

                await mailerSend.sendActivationMail(userDto.email, `http://localhost:8000/users/activate/${activationLink}`);

                const payload = {
                    ...userDto,
                    role: UserRoles.user,
                };

                const getAccessToken = await generateAccessToken(payload);
                const getRefreshToken = await generateRefreshToken(payload);

                const user = await this.repo.save({
                    ...userDto,
                    isActivatedByEmail: userDto.isActivatedByEmail,
                    activationLink,
                    refreshToken: getRefreshToken.refreshToken,
                    accessToken: getAccessToken.accessToken,
                    role: UserRoles.user,
                });
                updatedUser = _.omit(user, 'password');
            } else if (userDto.role === 'lawyer') {
                const foundUser = await this.lawyerRepo.findOne({ where: { email: userDto.email } });
                if (foundUser) throw new Error(`Пользователь с почтовым адресом ${userDto.email} уже существует`);

                userDto.password = await hashPassword(userDto.password);

                const activationLink = uuidv4();
                const mailerSend = new Mailer();

                await mailerSend.sendActivationMail(userDto.email, `http://localhost:8000/users/activate/${activationLink}`);

                const payload = {
                    ...userDto,
                    role: UserRoles.lawyer,
                };

                const getAccessToken = await generateAccessToken(payload);
                const getRefreshToken = await generateRefreshToken(payload);

                const lawyer = await this.lawyerRepo.save({
                    ...userDto,
                    isActivatedByEmail: userDto.isActivatedByEmail,
                    activationLink,
                    isConfirmed: false,
                    refreshToken: getRefreshToken.refreshToken,
                    accessToken: getAccessToken.accessToken,
                    role: UserRoles.lawyer,
                });
                updatedUser = _.omit(lawyer, 'password');
            }
            return updatedUser;
        } catch (error: any) {
            console.error('Ошибка при регистрации:', error);
            throw new Error(error.message || 'Ошибка регистрации пользователя');
        }
    }

    async login(loginUserDto: SignInDto) {
        try {
            let updatedClient: User | Lawyer | null = null;

            const user = await this.repo.findOne({ where: { email: loginUserDto.email } });
            const date = new Date()
            const lawyerDate = new Date(user?.dateBlocked?? "")
            if (user) {
                if(date.getTime()<lawyerDate.getTime()) throw new Error(`Пользователь заблокирован временно`);
                if(user.permanentBlocked) throw new Error(`Пользователь заблокирован навсегда`); 
                const password = await bcrypt.compare(loginUserDto.password, user.password);
                if (!password) throw new Error(`Неверный пароль: ${loginUserDto.password}`);

                const userWithoutPass = _.omit(user, 'password');

                const payload = {
                    ...loginUserDto,
                    role: user.role,
                };

                const getAccessToken = await generateAccessToken(payload);
                const getRefreshToken = await generateRefreshToken(payload);

                const updatedUser = await this.repo.save({
                    ...userWithoutPass,
                    dateBlocked: null,
                    refreshToken: getRefreshToken.refreshToken,
                    accessToken: getAccessToken.accessToken,
                });
                updatedClient = updatedUser;
            }

            if (!user) {
                const lawyer = await this.lawyerRepo.findOne({ where: { email: loginUserDto.email } ,  relations: ['rating']});
                const date = new Date()
                const lawyerDate = new Date(lawyer?.dateBlocked?? "")
                if (!lawyer) throw new Error('Пользователь не найден');
                if(date.getTime()>lawyerDate.getTime() || lawyer.permanentBlocked) throw new Error(`Пользователь заблокирован`);
                const password = await bcrypt.compare(loginUserDto.password, lawyer.password);
                if (!password) throw new Error(`Неверный пароль: ${loginUserDto.password}`);

                const userWithoutPass = _.omit(lawyer, 'password', "rating");
                const payload = {
                    ...loginUserDto,
                    role: UserRoles.lawyer,
                };
                const average = lawyer.rating.reduce((sum, { assessment }) => sum + assessment, 0) / lawyer.rating.length;
                const getAccessToken = await generateAccessToken(payload);
                const getRefreshToken = await generateRefreshToken(payload);

                const updatedUser = await this.lawyerRepo.save({
                    ...userWithoutPass,
                    avgRating: average,
                    refreshToken: getRefreshToken.refreshToken,
                    accessToken: getAccessToken.accessToken,
                });

                updatedClient = updatedUser;
            }
            return updatedClient;
        } catch (error: any) {
            console.log('Ошибка при логине: ', error);
            throw new Error(error.message || 'Ошибка логина пользователя');
        }
    }

    async activate(activationLink: string, refreshToken: string) {
        const client = await this.findByRefreshToken(refreshToken);

        if (!client) {
            throw new Error('Invalid activation link ');
        }

        if (client?.role === 'user' || client?.role === 'admin') {
            const user = await this.repo.findOne({ where: { activationLink } });

            if (!user) {
                throw new Error('Invalid activation link');
            }
            user.isActivatedByEmail = true;
            await this.repo.save(user);
        }

        if (client?.role === 'lawyer') {
            const user = await this.lawyerRepo.findOne({ where: { activationLink } });

            if (!user) {
                throw new Error('Invalid activation link');
            }
            user.isActivatedByEmail = true;
            await this.lawyerRepo.save(user);
        }
        return { message: 'Account activated successfully' };
    }

    async deleteRefreshToken(refreshToken: string) {
        const user = await this.findByRefreshToken(refreshToken);
        // let updatedUser;

        if (user?.role === 'user' || user?.role === 'admin') {
            await this.repo.save({ ...user, refreshToken: '' } as User);
        }

        if (user?.role === 'lawyer') {
            await this.lawyerRepo.save({ ...user, refreshToken: '' } as Lawyer);
        }

        // return updatedUser;
    }

    async refresh(refreshToken: string) {
        const user = await this.findByRefreshToken(refreshToken);
        if (!user) throw new Error("Refresh token doesn't exist");

        const isRefreshTokenValid = await validateRefreshToken(refreshToken);
        if (!isRefreshTokenValid) throw new Error('Refresh token is not valid anymore');

        const isAccessTokenValid = await validateAccessToken(user.accessToken);
        const userWithoutPass = _.omit(user, 'password','rating');

        let updatedUser;
        if (user?.role === 'user' || user?.role === 'admin') {
            if (!isAccessTokenValid) {
                const getNewAccessToken = await generateAccessToken({ ...user });
                user.accessToken = getNewAccessToken.accessToken;
                await this.repo.save(user as User);
                updatedUser = { ...userWithoutPass, accessToken: getNewAccessToken.accessToken };
            } else {
                updatedUser = { ...userWithoutPass, accessToken: user.accessToken };
            }
        }

        if (user?.role === 'lawyer') {
            const lawyer = user as Lawyer
            const average = lawyer.rating.reduce((sum, { assessment }) => sum + assessment, 0) / lawyer.rating.length;
            if (!isAccessTokenValid) {
                const getNewAccessToken = await generateAccessToken({ ...user });
                user.accessToken = getNewAccessToken.accessToken;
                await this.lawyerRepo.save(user as Lawyer);
                updatedUser = { ...userWithoutPass, avgRating: average, accessToken: getNewAccessToken.accessToken };
            } else {
                updatedUser = { ...userWithoutPass, accessToken: user.accessToken, avgRating: average};
            }
        }
        return updatedUser;
    }

    async getAll() {
        return await this.lawyerRepo.find();
    }

    async createRequest(lawyer: Lawyer, type: 'edit' | 'delete', data?: LawyerInfoDto) {
        const request = this.lawyerRequestRepo.create({
            lawyer,
            type,
            data,
            isApproved: false,
        });

        return await this.lawyerRequestRepo.save(request);
    }

    async updateLawyerInfo(id: number, lawyerInfoDto: LawyerInfoDto) {
        const lawyer = await this.lawyerRepo.findOne({ where: { id } });

        if (!lawyer) {
            throw new Error('Юрист не найден');
        }

        Object.assign(lawyer, lawyerInfoDto);

        return await this.lawyerRepo.save(lawyer);
    }

    async deletePhoto(id: number) {
        if (isNaN(id)) {
            throw Error('Invalid ID');
        }

        const lawyer = await this.lawyerRepo.findOne({ where: { id } });

        if (!lawyer) {
            throw new Error('Юрист не найден');
        }

        lawyer.photo = '';
        await this.lawyerRepo.save(lawyer);
        return { message: 'Фото успешно удалено' };
    }

    async changePassword(changePassowrdDto: ChangePasswordDto, refreshToken: string) {
        const user = await this.findByRefreshToken(refreshToken);

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        if (!user.password) {
            throw new Error('Пароль пользователя не определен');
        }

        const passwordMatch = await bcrypt.compare(changePassowrdDto.currentPassword, user.password);
        if (!passwordMatch) throw new Error('Неверный текущий пароль');

        const hashNewPassword = await hashPassword(changePassowrdDto.newPassword);
        user.password = hashNewPassword;

        let updatedUser;
        if (user.role === 'user' || user.role === 'admin') {
            updatedUser = await this.repo.save(user as User);
        }

        if (user.role === 'lawyer') {
            updatedUser = await this.lawyerRepo.save(user as Lawyer);
        }

        return updatedUser;
    }

    async approveRequest(requestId: string) {
        const id = Number(requestId);
        const request = await this.lawyerRequestRepo.findOne({ where: { id }, relations: ['lawyer'] });

        if (!request) {
            throw new Error('Запрос не найден');
        }

        request.isApproved = true;
        request.approvedAt = new Date();
        return await this.lawyerRequestRepo.save(request);
    }

    async rejectRequest(requestId: string) {
        const id = Number(requestId);
        const request = await this.lawyerRequestRepo.findOne({ where: { id }, relations: ['lawyer'] });

        if (!request) {
            throw new Error('Запрос не найден');
        }

        request.isApproved = false;
        request.approvedAt = new Date();
        return await this.lawyerRequestRepo.save(request);
    }

    async findByRefreshToken(refreshToken: string): Promise<IUser | null> {
        let user = await this.findUserByRefreshToken(refreshToken);
        if (!user) {
            user = await this.findLawyerByRefreshToken(refreshToken);
        }
        return user;
    }

    async findUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
        return this.repo.findOne({ where: { refreshToken } });
    }

    async findLawyerByRefreshToken(refreshToken: string): Promise<Lawyer | null> {
        return this.lawyerRepo.findOne({ where: { refreshToken }, relations:["rating"]});
    }
    async findLawyerById(id: number): Promise<Lawyer | null> {
        return this.lawyerRepo.findOne({ where: { id } });
    }
    async blockUser(data: IBlockUser) {
        const { id, role, permanentBlocked, dateBlocked} = data;
        try {
            if (role === UserRoles.lawyer) {
                const lawyer = await this.lawyerRepo.findOne({ where: { id } });
                if (!lawyer) return { success: false, message: 'Юрист не найден' };
                if(!dateBlocked && !permanentBlocked) return { success: false, message: 'Некорректная дата' };
                if (lawyer.permanentBlocked) return { success: false, message: 'Юрист уже заблокирован' }
                else if (dateBlocked) {
                    lawyer.dateBlocked = new Date(dateBlocked).toISOString();
                    lawyer.permanentBlocked = true;
                } else {
                    lawyer.permanentBlocked = true;
                }
                lawyer.refreshToken = ""
                lawyer.accessToken = ""
    
                await this.lawyerRepo.save(lawyer);

                return { success: true, message: 'Юрист заблокирован успешно' };
            }
    
            if (role === UserRoles.user) {
                const user = await this.repo.findOne({ where: { id } });
                if (!user) return { success: false, message: 'Пользователь не найден' };
                if(!dateBlocked && !permanentBlocked) return { success: false, message: 'Некорректная дата' };
                if (user.permanentBlocked) return { success: false, message: 'Пользователь уже заблокирован' }
                else if (dateBlocked) {
                    user.dateBlocked = new Date(dateBlocked).toISOString();
                    user.permanentBlocked = true;
                } else {
                    user.permanentBlocked = true;
                }
                await this.repo.save(user);
                return { success: true, message: 'Пользовать заблокирован успешно' };
            }
    
            return { success: false, message: 'Некорректная роль пользователя' };
        } catch (error) {
            console.error(error);
            return { success: false, message: error instanceof Error ? error.message : 'Неизвестная ошибка' };
        }
    }
    async unblock(data: IBlockUser) {
        const { id, role} = data;
        try {
            if (role === UserRoles.lawyer) {
                const lawyer = await this.lawyerRepo.findOne({ where: { id } });
                if (!lawyer) return { success: false, message: 'Юрист не найден' };
                if (!lawyer.permanentBlocked) return { success: false, message: 'Юрист не заблокирован'}
                else if (lawyer.permanentBlocked) {
                    lawyer.permanentBlocked = false;
                    lawyer.dateBlocked = null;
                } else lawyer.dateBlocked = null
                await this.lawyerRepo.save(lawyer);
                return { success: true, message: 'Юрист разблокирован успешно' };
            }
    
            if (role === UserRoles.user) {
                const user = await this.repo.findOne({ where: { id } });
                if (!user) return { success: false, message: 'Пользователь не найден' };
                if (!user.permanentBlocked) return { success: false, message: 'Пользователь не заблокирован' }
                else if (user.permanentBlocked) {
                    user.permanentBlocked = false;
                    user.dateBlocked = null;
                } else user.dateBlocked = null;
    
                await this.repo.save(user);
                return { success: true, message: 'Пользовать раблокирован успешно' };
            }
    
            return { success: false, message: 'Некорректная роль пользователя' };
        } catch (error) {
            console.error(error);
            return { success: false, message: error instanceof Error ? error.message : 'Неизвестная ошибка' };
        }
    }
}

export const userRepo = new UserRepo();
