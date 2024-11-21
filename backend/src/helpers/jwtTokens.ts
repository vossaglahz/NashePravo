import jws from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { IUser } from '@/interfaces/IUser.inerface';

dotenv.config();

const access = process.env.JWT_ACCESS_SECRET;
const refresh = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = async (payload: any) => {
    if (!access) throw new Error('accessToken is not defined in environment variables');
    if (payload.accessToken) payload.accessToken = null;

    const accessToken = jws.sign(payload, access, { expiresIn: '15m' });
    return {
        accessToken
    };
};

export const generateRefreshToken = async (payload: any) => {
    if (!refresh) throw new Error('refreshToken is not defined in environment variables');
    if (payload.refreshToken) payload.refreshToken = null;

    const refreshToken = jws.sign(payload, refresh, { expiresIn: '3d' });
    return {
        refreshToken
    };
};

export const validateAccessToken = async (accessToken: string): Promise<IUser | null> => {
    if (!access) throw new Error('Access token secret not defined');
    try {
        const userData = jws.verify(accessToken, access) as IUser;
        return userData;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                return null;
            }
            throw new Error(error.message);
        }
        throw new Error('Unknown error occurred during token validation');
    }
};

export const validateRefreshToken = async (refreshToken: string) => {
    if (!refresh) throw new Error('Refresh token secret not defined');
    try {
        const userData = jws.verify(refreshToken, refresh);
        return userData;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Unknown error occurred during refresh token validation');
    }
};

