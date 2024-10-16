export interface IUser {
    id?: number;
    name?: string;
    surname?: string;
    patronymicName?: string;
    email?: string;
    photo?: string;
    isActivatedByEmail?: boolean;
    activationLink?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    permanentBlocked?: boolean;
    dateBlocked?: string | null;
}
