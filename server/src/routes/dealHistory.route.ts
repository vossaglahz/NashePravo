import { DealHistoryController } from '@/controllers/dealHistory.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { Router } from 'express';

export class DealHistoryRoute implements IRoute {
    path = '/deal';
    router = Router();
    private controller: DealHistoryController;

    constructor() {
        this.controller = new DealHistoryController();
        this.init();
    }

    private init() {
        this.router.get('/all', authValidate, checkRole('admin'), this.controller.getAllDealHistory);
        this.router.get('/', authValidate, this.controller.getDealHistory);
        this.router.post('/', authValidate, this.controller.createOrder);
    }
}