import { ToDoListController } from '@/controllers/toDoList.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class ToDoListRoute implements IRoute {
    path = '/todo';
    router = Router();
    private controller: ToDoListController;

    constructor() {
        this.controller = new ToDoListController();
        this.init();
    }

    private init() {
        this.router.get('/', authValidate, this.controller.getToDoList);
        this.router.post('/', authValidate, this.controller.createToDoList);
        this.router.patch('/:id', authValidate, this.controller.changeToDoList);
        this.router.delete('/:id', authValidate, this.controller.deleteToDoList);
    }
}