export interface ILawyer {
    id?: number;
    name?: string;
    surname?: string;
    patronymicName?: string;
    caseCategories?: string;
    documents?: File[];
    lawyerType?: string;
    email?: string;
    photo?: string;
    isActivatedByEmail?: boolean;
    isConfirmed?: boolean;
    activationLink?: string;
    role?: string;
    avgRating?: number;
    accessToken?: string;
    refreshToken?: string;
    permanentBlocked?: boolean;
    dateBlocked?: string | null;
}
