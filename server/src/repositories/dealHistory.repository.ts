import { AppDataSource } from '@/config/dataSource';
import { DealHistoryDto } from '@/dto/dealHistory.dto';
import { DealHistory } from '@/entities/dealHistory.entity';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { DealHistoryQuery } from '@/interfaces/IDealHistoryQuery.interface';
import { Repository } from 'typeorm';

export class DealHistoryRepository extends Repository<DealHistory> {
    constructor() {
        super(DealHistory, AppDataSource.createEntityManager());
    }

    async getAllDealHistory() {
        return await this.find({
            order: {
                id: 'DESC',
            },
        });
    }

    async getDealHistory(refreshToken: string, filters: DealHistoryQuery) {
        let client = '';
        const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
        
        if (lawyer) {
            client = 'lawyer';
        } else {
            const user = await this.manager.findOne(User, { where: { refreshToken } });
            if (user) {
                client = 'user';
            } else {
                throw new Error('Пользователь не найден');
            }
        }
    
        const queryBuilder = this.createQueryBuilder('dealHistory')
            .leftJoinAndSelect(`dealHistory.${client}`, `${client}`)
            .leftJoinAndSelect('dealHistory.rating', 'rating') // Добавляем join с рейтингом
            .where(`${client}.refreshToken = :refreshToken`, { refreshToken })
            .orderBy('dealHistory.dealDate', 'DESC');
    
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
    
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
    
        if (filters.startPeriod) {
            queryBuilder.andWhere('dealHistory.dealDate >= :startPeriod', { startPeriod: new Date(filters.startPeriod) });
        }
    
        if (filters.endPeriod) {
            queryBuilder.andWhere('dealHistory.dealDate <= :endPeriod', { endPeriod: new Date(filters.endPeriod) });
        }
    
        if (filters.type) {
            queryBuilder.andWhere('dealHistory.type = :type', { type: filters.type });
        }
    
        if (filters.status) {
            queryBuilder.andWhere('dealHistory.status = :status', { status: filters.status });
        }
    
        if (filters.price) {
            if (filters.price === 'LOWEST') {
                queryBuilder.orderBy('dealHistory.price', 'ASC');
            } else if (filters.price === 'HIGHEST') {
                queryBuilder.orderBy('dealHistory.price', 'DESC');
            }
        }
    
        if (filters.dealDate) {
            if (filters.dealDate === 'NEWEST') {
                queryBuilder.orderBy('dealHistory.dealDate', 'DESC');
            } else if (filters.dealDate === 'OLDEST') {
                queryBuilder.orderBy('dealHistory.dealDate', 'ASC');
            }
        }
    
        const [deals, totalCount] = await Promise.all([
            queryBuilder.getMany(), 
            queryBuilder.getCount()
        ]);
    
        return {
            deals,
            totalCount,
        };
    }
    

    async createOrder(dealHistoryDto: DealHistoryDto, refreshToken: string) {
        try {
            const user = await this.manager.findOne(User, { where: { refreshToken } });

            if(!user) throw new Error('Пользователь не найден');

            const dealHistory = new DealHistory();
            dealHistory.title = dealHistoryDto.title;
            dealHistory.description = dealHistoryDto.description;
            dealHistory.price = dealHistoryDto.price;
            dealHistory.userId = user.id;

            return await this.save(dealHistory);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания заказа');
        }
    }
    async findDealHistoryById(id:string) {
        const deal = await this.manager.findOne(DealHistory, {
            where: { id: Number(id) },
            relations: ['lawyer'],
        });
        if(!deal) throw new Error('Сделка не найден');
        return deal
    }
}

export const dealHistoryRepo = new DealHistoryRepository();