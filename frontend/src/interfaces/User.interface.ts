export interface IUser {
    id?: number;
    name?: string;
    surname?: string;
    patronymicName?: string | null;
    email?: string;
    photo?: string | null;
    isActivatedByEmail?: boolean;
    activationLink?: string;
    role?: string;
    about?: string;
    city?: string;
    accessToken?: string;
    refreshToken?: string;
    permanentBlocked?: boolean;
    dateBlocked?: string | null;
}
