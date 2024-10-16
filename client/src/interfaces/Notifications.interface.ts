export interface INotifications {
    id: number;
    topic: string;
    content: string;
    answered: boolean;
    role: string;
    userId?: number;
    lawyerId?: number;
    adminId: number;
    toAdmin: boolean;
}

export interface INotify {
    id: string
    topic: string,
    content: string,
    important: boolean
}