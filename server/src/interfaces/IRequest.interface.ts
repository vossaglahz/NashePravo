import { Request } from 'express';
import { IUser } from './IUser.inerface';

export interface RequestWithUser extends Request {
    user?: IUser;
}
