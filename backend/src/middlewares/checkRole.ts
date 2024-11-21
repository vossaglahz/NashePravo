import { RequestWithUser } from '@/interfaces/IRequest.interface';
import { Response, NextFunction } from 'express';

export function checkRole(...allowedRoles: string[]) {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { user } = req;
        if (user && user.role && allowedRoles.includes(user.role)) {
            next();
            return;
        }
        res.status(403).send({ error: { message: 'permission denied' } });
    };
}
