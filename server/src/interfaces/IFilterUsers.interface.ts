export interface IFilterUsers {
    page: number;
    limit: number;
    role: string;
    sorted: string;
    isActivatedByEmail: boolean;
    isConfirmed: boolean;
    permanentBlock: boolean;
}
