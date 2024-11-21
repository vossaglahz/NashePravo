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

    getNewСreatedDeals: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const { page, limit, type, price } = req.query as unknown as DealHistoryQuery;

        const newDeals = await this.service.getNewСreatedDeals(refreshToken, {page, limit, type, price});
        res.send(newDeals);
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
        } catch (error: any) {
            console.error('Error in create deal:', error);
            res.status(500).json({ message: error.message });
        }
    };

    lawyerResponseToDeal: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const dealId = req.params.id;

            const responseToDeal = await this.service.lawyerResponseToDeal(refreshToken, dealId);
            res.status(201).send(responseToDeal);
        } catch (error: any) {
            console.error('Error in response to deal:', error);
            res.status(500).json({ message: error.message });  
        }
    };

    closeDeal: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const dealId = req.params.id;
            const approveDeal = await this.service.closeDeal(refreshToken, dealId);
            res.status(200).send(approveDeal);
        } catch (error: any) {
            console.error('Error in approve deal:', error);
            res.status(500).json({ message: error.message });
        }
    };

    approveDeal: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const dealId = req.params.id;
            const lawyerId = Number(req.query.lawyerId);

            const approveDeal = await this.service.approveDeal(refreshToken, dealId, lawyerId);
            res.status(201).send(approveDeal);
        } catch (error: any) {
            console.error('Error in approve deal:', error);
            res.status(500).json({ message: error.message });
        }
    };
}
