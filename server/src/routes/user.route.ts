import { UserController } from '@/controllers/user.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { upload } from '@/middlewares/multer';
import { Router } from 'express';

export class UserRoute implements IRoute {
    path = '/users';
    router = Router();
    private controller: UserController;

    constructor() {
        this.controller = new UserController();
        this.init();
    }

    private init() {
        this.router.post('/registration', this.controller.registration);
        this.router.post('/login', this.controller.login);
        this.router.post('/logout', this.controller.logout);
        this.router.post('/refresh', this.controller.refresh);
        this.router.get('/activate/:activationLink', this.controller.activate);
        this.router.get('/', authValidate, checkRole('admin'), this.controller.getAllLawyers);

        this.router.post('/edit-request', authValidate, checkRole('lawyer'), upload.single('photo'), this.controller.createEditRequest);
        this.router.post('/delete-request', authValidate, checkRole('lawyer'), this.controller.createDeleteRequest);
        this.router.put('/change-password', authValidate, this.controller.changePassword);

        this.router.post('/admin/block', authValidate, checkRole('admin'), this.controller.blockUser);
        this.router.post('/admin/unblock', authValidate, checkRole('admin'), this.controller.unblock);
        // this.router.post('/admin/unblock', this.controller.unblock);
        // this.router.post('/admin/block', this.controller.blockUser);
    }
}
