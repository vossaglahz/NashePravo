import { LawyerRequest } from "@/entities/lawyerRequest.entity";
import { PersonalNotification } from "@/entities/personalNotification.entity";
import { Rating } from "@/entities/rating.entity";

export interface IUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    password?: string;
    patronymicName?: string;
    isActivatedByEmail: boolean;
    activationLink: string;
    refreshToken: string;
    accessToken: string;
    viewedNotifications: string;
    role?: 'user' | 'admin' | 'lawyer';
    photo: string; 
    avgRating?: number; 
    personalNotification:PersonalNotification[];
    rating:Rating[];
    dateBlocked: string | null;
    city?: string;
    about?: string;
    permanentBlocked: boolean;
    requests: LawyerRequest[];
}

export enum UserRoles {
    admin = 'admin',
    user = 'user',
    lawyer = 'lawyer',
}


export enum NotificationRole {
    all = 'all',
    user = 'user',
    lawyer = 'lawyer',
}


export interface IBlockUser {
    id:number, 
    role:string
    permanentBlocked: boolean
    dateBlocked: Date
}

export interface GeneralNotificationTarget {
    targetAudience: string
}