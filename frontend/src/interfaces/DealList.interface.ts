import { IUser } from "./User.interface";

export interface IDealList {
    id: number;
    title: string;
    description: string;
    price: number;
    dealDate: string | null;
    status: string;
    type: string;
    city: string;
    userId: number;
    lawyerId: number | null;
    user: IUser
    clicked: boolean;
}

export interface IDealListOne {
    id: number;
    title: string;
    type: string;
    description: string;
    user: IUser;
    city: string;
    price: number;
    clicked: boolean;
}
export interface IDealModal {
    id: number;
    title: string;
    type: string;
    description: string;
    username?: string;
    usersurname?: string;
    city: string;
    price: number;
    clicked: boolean;
}
