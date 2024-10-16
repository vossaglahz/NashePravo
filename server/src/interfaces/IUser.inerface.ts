export interface IUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    password?: string;
    isActivatedByEmail: boolean;
    activationLink: string;
    refreshToken: string;
    accessToken: string;
    role?: 'user' | 'admin' | 'lawyer';
}

export enum UserRoles {
    admin = 'admin',
    user = 'user',
    lawyer = 'lawyer',
}

export interface IBlockUser {
    id:number, 
    role:string
    permanentBlocked: boolean
    dateBlocked: Date
}