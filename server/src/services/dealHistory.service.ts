import { DealHistoryDto } from "@/dto/dealHistory.dto";
import { DealHistoryQuery } from "@/interfaces/IDealHistoryQuery.interface";
import { DealHistoryRepository } from "@/repositories/dealHistory.repository";

export class DealHistoryService {
    private repository: DealHistoryRepository;

    constructor() {
        this.repository = new DealHistoryRepository();
    }

    getAllDealHistory = async () => {
        return await this.repository.getAllDealHistory();
    };

    getDealHistory = async (refreshToken: string, filters: DealHistoryQuery) => {
        return await this.repository.getDealHistory(refreshToken, filters);
    };

    createOrder = async (dealHistoryDto: DealHistoryDto, refreshToken: string) => {
        try {
            return await this.repository.createOrder(dealHistoryDto, refreshToken);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания заказа');
            } else {
                throw new Error('Неизвестная ошибка при создании заказа');
            }
        }
    }

}
