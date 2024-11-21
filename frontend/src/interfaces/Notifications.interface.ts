export interface INotifications {
    id: number;
    topic: string;
    content: string;
    sourceLink: string | null;
    answered: boolean;
    role: string;
    userId?: number;
    lawyerId?: number;
    adminId: number;
    toAdmin: boolean;
}

export interface INotify {
    id?: string;
    topic: string;
    content: string;
    sourceLink: string | null;
    important?: boolean;
    _createdAt: string;
    role: string;
    user?: {
        name: string;
        surname: string;
    };
}
