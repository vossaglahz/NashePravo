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
        this.router.get('/', authValidate, this.controller.getDealHistory);
        this.router.post('/', authValidate, this.controller.createOrder);
        this.router.post('/close/:id', this.controller.closeDeal);
        this.router.get('/new-deals', authValidate, checkRole('lawyer'), this.controller.getNewСreatedDeals);
        this.router.post('/lawyer-response/:id', authValidate, checkRole('lawyer'), this.controller.lawyerResponseToDeal);
        this.router.post('/approve-deal/:id', authValidate, checkRole('user'), this.controller.approveDeal);
    }
}