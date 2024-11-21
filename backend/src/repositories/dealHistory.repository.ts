import { AppDataSource } from '@/config/dataSource';
import { DealHistoryDto } from '@/dto/dealHistory.dto';
import { DealHistory, DealHistoryWithClicked } from '@/entities/dealHistory.entity';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { DealHistoryQuery } from '@/interfaces/IDealHistoryQuery.interface';
import { Repository } from 'typeorm';
import { ChatHistoryRepository } from '@/repositories/chatHistory.repository';
import { userRepo } from './user.repository';

export class DealHistoryRepository extends Repository<DealHistory> {
    private chatHistoryRepo: ChatHistoryRepository;

    constructor() {
        super(DealHistory, AppDataSource.createEntityManager());
        this.chatHistoryRepo = new ChatHistoryRepository();
    }

    async getNewСreatedDeals(refreshToken: string, filters: DealHistoryQuery) {
        const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
        if (!lawyer) {
            throw new Error('Пользователь не найден');
        }

        const queryBuilder = this.createQueryBuilder('dealHistory')
            .leftJoinAndSelect(`dealHistory.user`, `user`)
            .select([
                'dealHistory.id',
                'dealHistory.title',
                'dealHistory.description',
                'dealHistory.price',
                'dealHistory.dealDate',
                'dealHistory.status',
                'dealHistory.type',
                'dealHistory.userId',
                'dealHistory.lawyerId',
                'dealHistory.responses',
                'user.id',
                'user.name',
                'user.surname',
                'user.patronymicName',
                'user.photo',
                'user.role',
                'user.email',
            ])
            .where(`dealHistory.status = :status`, { status: 'Create' })
            .orderBy('dealHistory.id', 'DESC');

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;

        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);

        if (filters.type) {
            queryBuilder.andWhere('dealHistory.type = :type', { type: filters.type });
        }

        if (filters.price) {
            if (filters.price === 'LOWEST') {
                queryBuilder.orderBy('dealHistory.price', 'ASC');
            } else if (filters.price === 'HIGHEST') {
                queryBuilder.orderBy('dealHistory.price', 'DESC');
            }
        }

        const [deals, totalCount] = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);

        const dealsWithClickedField: DealHistoryWithClicked[] = deals.map(deal => {
            const dealWitchClicked: DealHistoryWithClicked = {
                ...deal,
                clicked: false,
            };
            if (Array.isArray(deal.responses)) {
                deal.responses.find(response => {
                    if (response && response.id === lawyer.id) {
                        dealWitchClicked.clicked = true;
                    }
                    if (!response) {
                        console.warn('Response is null or undefined');
                    }
                    return false;
                });
            }
            return dealWitchClicked;
        });

        return {
            deals: dealsWithClickedField,
            totalCount,
        };
    }

    async getDealHistory(refreshToken: string, filters: DealHistoryQuery) {
        let user = null;
        user = await this.manager.findOne(Lawyer, { where: { refreshToken } });
        if (!user) {
            user = await this.manager.findOne(User, { where: { refreshToken } });
        }

        if (!user) {
            throw new Error('Пользователь не найден');
        }
        let client;
        let clientId = user.id;

        if (user.role === 'user') {
            client = 'user';
        }
        if (user.role === 'lawyer') {
            client = 'lawyer';
        }

        const queryBuilder = this.createQueryBuilder('dealHistory')
            .leftJoinAndSelect(`dealHistory.${client}`, `${client}`)
            .leftJoinAndSelect('dealHistory.rating', 'rating') // Добавляем join с рейтингом
            .where(`${client}.refreshToken = :refreshToken`, { refreshToken })
            .andWhere(`dealHistory.${client}Id = :clientId`, { clientId })
            .orderBy('dealHistory.id', 'DESC');

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

        const [deals, totalCount] = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);

        return {
            deals,
            totalCount,
        };
    }

    async createOrder(dealHistoryDto: DealHistoryDto, refreshToken: string) {
        try {
            const user = await this.manager.findOne(User, { where: { refreshToken } });

            if (!user) throw new Error('Пользователь не найден');

            const dealHistory = new DealHistory();
            dealHistory.title = dealHistoryDto.title;
            dealHistory.description = dealHistoryDto.description;
            dealHistory.price = dealHistoryDto.price;
            dealHistory.type = dealHistoryDto.type;
            dealHistory.userId = user.id;

            return await this.save(dealHistory);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания сделки');
        }
    }

    async findDealHistoryById(id: string) {
        const deal = await this.manager.findOne(DealHistory, {
            where: { id: Number(id) },
            relations: ['lawyer'],
        });
        if (!deal) throw new Error('Сделка не найден');
        return deal;
    }

    async lawyerResponseToDeal(refreshToken: string, dealId: string) {
        try {
            const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
            if (!lawyer) throw new Error('Пользователь не найден');

            const deal = await this.manager.findOne(DealHistory, {
                where: { id: Number(dealId) },
            });
            if (!deal) throw new Error('Сделка не найдена');
            if (deal.status !== 'Create') throw new Error('Данная сделка не доступна');

            deal.responses = deal.responses || [];
            deal.responses = deal.responses.filter(response => response !== null);

            const lawyerExists = deal.responses.some(response => response.id === lawyer.id);
            if (lawyerExists) throw new Error('Вы уже ответили на эту сделку');

            const lawyerResponse = {
                id: lawyer.id,
                name: lawyer.name,
                surname: lawyer.surname,
                photo: lawyer.photo,
            };

            deal.responses.push(lawyerResponse);

            return await this.save(deal);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка запроса на сделку');
        }
    }

    async approveDeal(refreshToken: string, dealId: string, lawyerId: number) {
        try {
            const user = await this.manager.findOne(User, { where: { refreshToken } });
            if (!user) throw new Error('Пользователь не найден');

            const deal = await this.manager.findOne(DealHistory, {
                where: { id: Number(dealId) },
            });
            if (!deal) throw new Error('Сделка не найдена');

            deal.dealDate = new Date();
            deal.lawyerId = lawyerId;
            deal.responses = [];
            deal.status = 'Processing';

            const userId = user.id;
            const chat = await this.chatHistoryRepo.creatingChat(lawyerId, userId);
            deal.chatId = chat.id
            return await this.save(deal);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания сделки');
        }
    }

    async closeDeal(refreshToken: string, dealId: string) {
        const user = await userRepo.findByRefreshToken(refreshToken);
        const deal = await this.findDealHistoryById(dealId)
        try {
            if (deal.userClose && deal.lawyerClose) {
                console.log("closed");
            } else if (user?.role == "lawyer") {
                deal.lawyerClose = true
                await this.save(deal)
            }else if (user?.role == "user") {
                deal.userClose = true
                await this.save(deal)
            }
            if (deal.userClose && deal.lawyerClose) {
                deal.userClose = false
                deal.lawyerClose = false
                deal.status = "Done"

                this.chatHistoryRepo.closeChat(deal.lawyerId, deal.userId);
                return await this.save(deal)
            }
            return {message:"Предложение на закрытие сделки отправлено",status: 200}
            }catch (error: any) {
            throw new Error(error.message || 'Ошибка закрытия сделки');
        }
    }
}

export const dealHistoryRepo = new DealHistoryRepository();
