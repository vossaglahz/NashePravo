import { RequestHandler } from 'express';
import { DealHistoryService } from '@/services/dealHistory.service';
import { plainToInstance } from 'class-transformer';
import { DealHistoryDto } from '@/dto/dealHistory.dto';
import { validate } from 'class-validator';
import { formatErrors } from '@/helpers/formatErrors';
import { DealHistoryQuery } from '@/interfaces/IDealHistoryQuery.interface';

export class DealHistoryController {
    private service: DealHistoryService;

    constructor() {
        this.service = new DealHistoryService();
    }

    getAllDealHistory: RequestHandler = async (req, res): Promise<void> => {
        const docs = await this.service.getAllDealHistory();
        res.send(docs);
    };

    getDealHistory: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const { page, limit, startPeriod, endPeriod, type, price, status, dealDate } = req.query as unknown as DealHistoryQuery;

        const docs = await this.service.getDealHistory(refreshToken, { page, limit, startPeriod, endPeriod, type, price, status, dealDate });
        res.send(docs);
    };

    createOrder: RequestHandler = async (req, res): Promise<void> => {
        try {
            const dealHistoryDto = plainToInstance(DealHistoryDto, req.body);
            const validationErrors = await validate(dealHistoryDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const { refreshToken } = req.cookies;
            const dealHistory = await this.service.createOrder(dealHistoryDto, refreshToken);
            res.status(201).send(dealHistory);
        } catch (error) {
            console.error('Error in create order:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
