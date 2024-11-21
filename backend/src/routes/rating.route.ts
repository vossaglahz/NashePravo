import { Router } from 'express';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { UserRoles } from '@/interfaces/IUser.inerface';
import { RatingController } from '@/controllers/rating.contoller';

export class RatingRoute implements IRoute {
    public path = '/rating';
    public router = Router();

    private controller: RatingController;

    constructor() {
        this.controller = new RatingController();
        this.init();
    }

    private init() {
        this.router.post('/:id',authValidate, checkRole(UserRoles.user),  this.controller.createRating);
        this.router.get('/:id', this.controller.getRating);
    }

} 
