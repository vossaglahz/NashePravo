export interface ILawyer {
    id?: number;
    name?: string;
    surname?: string;
    patronymicName?: string | null;
    caseCategories?: string;
    documents?: File[];
    lawyerType?: string;
    email?: string;
    photo?: string | null;
    isActivatedByEmail?: boolean;
    isConfirmed?: boolean;
    activationLink?: string;
    role?: string;
    avgRating?: number;
    accessToken?: string;
    refreshToken?: string;
    permanentBlocked?: boolean;
    dateBlocked?: string | null;
    city?: string;
    about?: string;
}
export interface ILawyerList {
    id: number;
    name: string;
    surname: string;
    dealId: number;
    photo: null | string;
}