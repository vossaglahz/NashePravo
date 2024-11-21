import { AdminController } from '@/controllers/admin.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { Router } from 'express';

export class AdminRoute implements IRoute {
    path = '/admin';
    router = Router();
    private controller: AdminController;

    constructor() {
        this.controller = new AdminController();
        this.init();
    }

    private init() {
        this.router.get('/users', authValidate, checkRole('admin'), this.controller.getAllUsers);
        this.router.get('/request/all', authValidate, checkRole('admin'), this.controller.getAllRequest);
        this.router.put('/request/:id/approve', authValidate, checkRole('admin'), this.controller.approveRequest);
        this.router.put('/request/:id/reject', authValidate, checkRole('admin'), this.controller.rejectRequest);
    }
}
