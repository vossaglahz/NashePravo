import { ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { RequestWithUser } from '@/interfaces/IRequest.interface';
import { formatErrors } from '@/helpers/formatErrors';
import { validateAccessToken } from '@/helpers/jwtTokens';
import _ from 'lodash';

export const authValidate: RequestHandler = async (req: RequestWithUser, res, next): Promise<any> => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) return res.status(401).send({ message: 'Invalid authorizationHeader' });

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) return res.status(401).send({ message: 'Invalid accessToken' });

        const userData = await validateAccessToken(accessToken);
        if (!userData) return res.status(401).send({ message: 'Invalid accessToken' });

        const userWithoutPass = _.omit(userData, 'password');
        req.user = userWithoutPass;
        next();
    } catch (e) {
        if (e instanceof Array) {
            return res.status(400).send(formatErrors(e as ValidationError[]));
        } else if (e instanceof ValidationError) {
            return res.status(400).send(formatErrors([e]));
        } else {
            console.error('Error in authValidate:', e);
            return res.status(500).send({ message: 'Internal server error' });
        }
    }
};
