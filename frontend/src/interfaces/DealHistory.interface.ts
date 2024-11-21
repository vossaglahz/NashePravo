export interface IDealHistory {
    id: number;
    title: string;
    description: string;
    price: number;
    dealDate: string;
    status: string;
    type: string;
    userId: number;
    rating: {assessment:number}
    lawyerId: number;
    responses: [];
    userClose: boolean;
    lawyerClose: boolean;
}