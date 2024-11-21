export interface IChatHistory {
    lawyerId: number | null,
    userId: number | null,
    messages: IMessages[],
};

export interface IMessages {
    id: string,
    data: Date,
    name: string,
    photo: string,
    text: string,
    role: string,
    somebodyID: number
};