export interface DealHistoryQuery {
    page: number;
    limit: number;
    startPeriod?: string;
    endPeriod?: string;
    type?: string;
    price?: string;
    status?: string;
    dealDate?: string;
}