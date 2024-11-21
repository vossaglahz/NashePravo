import { DealHistoryDto } from "@/dto/dealHistory.dto";
import { DealHistoryQuery } from "@/interfaces/IDealHistoryQuery.interface";
import { DealHistoryRepository } from "@/repositories/dealHistory.repository";

export class DealHistoryService {
    private repository: DealHistoryRepository;

    constructor() {
        this.repository = new DealHistoryRepository();
    }

    getNewСreatedDeals = async (refreshToken: string, filters: DealHistoryQuery) => {
        return await this.repository.getNewСreatedDeals(refreshToken, filters);
    };

    getDealHistory = async (refreshToken: string, filters: DealHistoryQuery) => {
        return await this.repository.getDealHistory(refreshToken, filters);
    };

    closeDeal = async (refreshToken: string, dealId: string) => {
        return await this.repository.closeDeal(refreshToken, dealId);
    };


    createOrder = async (dealHistoryDto: DealHistoryDto, refreshToken: string) => {
        try {
            return await this.repository.createOrder(dealHistoryDto, refreshToken);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания сделки');
            } else {
                throw new Error('Неизвестная ошибка при создании сделки');
            }
        }
    }

    lawyerResponseToDeal = async (refreshToken: string, dealId: string) => {
        try {
            return await this.repository.lawyerResponseToDeal(refreshToken, dealId);
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка запроса на сделку');
            } else {
                throw new Error('Неизвестная ошибка при запросе на сделку');
            }
        }
    }

    approveDeal = async (refreshToken: string, dealId: string, lawyerId: number) => {
        try {
            return await this.repository.approveDeal(refreshToken, dealId, lawyerId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка принятия сделки');
            } else {
                throw new Error('Неизвестная ошибка при принятии сделки');
            }
        }
    }

}
