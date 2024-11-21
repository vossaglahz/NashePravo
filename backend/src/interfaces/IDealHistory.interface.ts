import { IUser } from '@/interfaces/IUser.inerface';

export interface IDealHistory {
    id: number;
    title: string;
    description: string;
    price: number;
    dealDate: Date;
    status: 'Create' | 'Processing' | 'Done';
    type: 'Criminal' | 'Civil' | 'Corporate';
    user: IUser;
    lawyer: IUser;
}
