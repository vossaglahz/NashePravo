import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { SignInDto } from '@/dto/sign-in.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { UserService } from '@/services/user.service';
import { RegistrationLawyerDto } from '@/dto/registration-lawyer.dto';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { LawyerInfoDto } from '@/dto/lawyerInfo.dto';
import { ChangePasswordDto, ChangeRecoverPasswordDto } from '@/dto/changePassword.dto';
import { BlockDto } from '@/dto/blockUser.dto';
import { RecoverPassDto } from '@/dto/recoverPass.dto';
import { UserInfoDto } from '@/dto/userInfo.dto';
import { userRepo } from '@/repositories/user.repository';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';

export class UserController {
    private service: UserService;
    private virusTotalApiKey: string;

    constructor() {
        this.service = new UserService();
        this.virusTotalApiKey = '2c6d2bd5046d673b34b0cd05f011f46c1da590b29272a2b3403bd653044e3439';
    }

    activate: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const activationLink = req.params.activationLink;
            await this.service.activate(activationLink, refreshToken);
            return res.redirect('http://localhost:5173');
        } catch (error) {
            console.log(error);
        }
    };

    registration: RequestHandler = async (req, res): Promise<void> => {
        try {
            if (req.body.role === 'user' || req.body.role === 'admin') {
                const userDto = plainToInstance(RegistrationUserDto, req.body);
                const validationErrors = await validate(userDto);

                if (validationErrors.length > 0) {
                    res.status(400).json({ errors: formatErrors(validationErrors) });
                    return;
                }

                const user = await this.service.registration(userDto);
                if (user) {
                    res.cookie('refreshToken', user.refreshToken, {
                        maxAge: 3 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                    });
                }
                res.status(201).send(user);
            } else if (req.body.role === 'lawyer') {
                const userDto = plainToInstance(RegistrationLawyerDto, req.body);
                const validationErrors = await validate(userDto);

                if (validationErrors.length > 0) {
                    res.status(400).json({ errors: formatErrors(validationErrors) });
                    return;
                }

                const lawyer = await this.service.registration(userDto);
                if (lawyer) {
                    res.cookie('refreshToken', lawyer.refreshToken, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                    });
                }
                res.status(201).send(lawyer);
            }
        } catch (error: any) {
            const formattedError = formatErrors(error);
            res.status(error.message.includes('уже существует') ? 409 : 500).json({ errors: formattedError });
        }
    };

    login: RequestHandler = async (req, res): Promise<void> => {
        try {
            const signInUserDto = plainToInstance(SignInDto, req.body);
            const validationErrors = await validate(signInUserDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const user = await this.service.login(signInUserDto);
            if (user) {
                res.cookie('refreshToken', user.refreshToken, {
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                });
            }

            res.status(200).send(user);
        } catch (error: any) {
            console.error('Error in login:', error);
            if (error.message.includes('Неверный пароль')) {
                res.status(401).json({ message: 'Неверный пароль' });
            } else if (error.message.includes('не найден')) {
                res.status(404).json({ message: 'Пользователь не найден' });
            } else if (error.message.includes('Пользователь заблокирован навсегда')) {
                res.status(400).json({ message: 'Пользователь заблокирован навсегда' });
            } else if (error.message.includes('Пользователь заблокирован временно')) {
                res.status(400).json({ message: 'Пользователь заблокирован временно' });
            } else {
                res.status(500).json({ message: 'Внутренняя ошибка сервера' });
            }
        }
    };

    getLawyersList: RequestHandler = async (req, res): Promise<void> => {
        const {page, limit, lawyerId} = req.query as {page?: number; limit?: number, lawyerId?:number};
        const requests = await this.service.getLawyersList({page, limit, lawyerId});
        res.send(requests);
    };


    logout: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                res.status(400).json({ message: 'Refresh token not provided' });
                return;
            }
            const token = await this.service.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.send(token);
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    refresh: RequestHandler = async (req, res): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const user = await this.service.refresh(refreshToken);
            res.status(201).send(user);
        } catch (error) {
            console.error('Error in refresh:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    createEditRequest: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const user = await userRepo.findByRefreshToken(refreshToken);

            let userForRequest: User | Lawyer;

            if (!user) {
                throw new Error('Пользователь не найден');
            }

            if (user.role === 'user') {
                userForRequest = user as User;
            } else if (user.role === 'lawyer') {
                userForRequest = user as Lawyer;
            } else {
                throw new Error('Неизвестная роль пользователя');
            }

            let infoDto;

            if (user?.role === 'user') {
                infoDto = plainToInstance(UserInfoDto, req.body);
            } else if (user?.role === 'lawyer') {
                infoDto = plainToInstance(LawyerInfoDto, req.body);
            }

            if (!infoDto) {
                throw new Error('Данные отсутствуют');
            }

            if (req.file) {
                const uploadPath = req.file.path;
                const form = new FormData();
                form.append('file', fs.createReadStream(uploadPath));

                try {
                    const response = await axios.post(`https://www.virustotal.com/api/v3/files`, form, {
                        headers: {
                            ...form.getHeaders(),
                            'x-apikey': this.virusTotalApiKey,
                        },
                    });

                    const scanId = response.data.data.id;
                    const resultResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
                        headers: {
                            'x-apikey': this.virusTotalApiKey,
                        },
                    });

                    const analysisStats = resultResponse.data.data.attributes.stats;
                    const isInfected = analysisStats.malicious > 0;

                    if (isInfected) {
                        fs.unlinkSync(uploadPath);
                        res.status(400).json({ message: 'Uploaded file is infected and has been removed.' });
                        return;
                    }

                    infoDto.photo = req.file.filename;
                } catch (error) {
                    console.error('Error in creating edit request:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('Axios error details:', error.response?.data);
                    }
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            }

            const validationErrors = await validate(infoDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const request = await this.service.createEditRequest(userForRequest, infoDto);
            res.status(200).send(request);
        } catch (error) {
            console.error('Error in creating edit request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    createDeleteRequest: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const request = await this.service.createDeleteRequest(refreshToken);
            res.status(200).send(request);
        } catch (error) {
            console.error('Error in creating delete request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    changePassword: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;

            const changePasswordDto = plainToInstance(ChangePasswordDto, req.body);
            const validationErrors = await validate(changePasswordDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
                res.status(400).json({ message: 'Новые пароли не совпадают' });
                return;
            }

            const result = await this.service.changePassword(changePasswordDto, refreshToken);
            res.status(200).send(result);
        } catch (error) {
            console.error('Error in change password User info:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    blockUser: RequestHandler = async (req, res): Promise<void> => {
        try {
            const blockDto = plainToInstance(BlockDto, req.body);
            const errors = await validate(blockDto);
            if (errors.length > 0) {
                const validationMessages = errors
                    .map(err => {
                        return Object.values(err.constraints || {});
                    })
                    .flat();
                res.status(400).send({
                    message: 'Validation failed',
                    errors: validationMessages,
                });
            } else {
                const request = await this.service.blockUser(req.body);
                if (request.success) {
                    res.status(200).send(request);
                } else {
                    res.status(400).send(request);
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    unblock: RequestHandler = async (req, res): Promise<void> => {
        try {
            const blockDto = plainToInstance(BlockDto, req.body);
            const errors = await validate(blockDto);
            if (errors.length > 0) {
                const validationMessages = errors
                    .map(err => {
                        return Object.values(err.constraints || {});
                    })
                    .flat();
                res.status(400).send({
                    message: 'Validation failed',
                    errors: validationMessages,
                });
            } else {
                const request = await this.service.unblock(req.body);
                if (request.success) {
                    res.status(200).send(request);
                } else {
                    res.status(400).send(request);
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    recoverPasswordUser: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const recoverPassDto = plainToInstance(RecoverPassDto, req.body);

            const errors = await validate(recoverPassDto);
            if (errors.length > 0) {
                res.status(400).json({ errors: formatErrors(errors) });
                return;
            }

            const recoverPass = await this.service.recoverPasswordUser(recoverPassDto, refreshToken);
            console.log('code: ', recoverPass);

            res.status(200).send(recoverPass);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    changeRecoverPasswordUser: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;

            const changePasswordDto = plainToInstance(ChangeRecoverPasswordDto, req.body);
            const validationErrors = await validate(changePasswordDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
                res.status(400).json({ message: 'Новые пароли не совпадают' });
                return;
            }

            const result = await this.service.changeRecoverPasswordUser(changePasswordDto, refreshToken);
            res.status(200).send(result);
        } catch (error) {
            console.error('Error in change password User info:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
