export interface IBlock {
    id: number;
    role: string;
    permanentBlocked: boolean;
    dateBloked?: string;
    success: boolean;
    message: string;
}
