import { RequestHandler } from 'express';
import { ToDoListService } from '@/services/toDoList.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { formatErrors } from '@/helpers/formatErrors';
import { ToDoListDto } from '@/dto/toDoList.dto';

export class ToDoListController {
    private service: ToDoListService;

    constructor() {
        this.service = new ToDoListService();
    }

    getToDoList: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const data = await this.service.getToDoList(refreshToken);
        res.send(data);
    };

    createToDoList: RequestHandler = async (req, res): Promise<void> => {
        try {
            const toDoListDto = plainToInstance(ToDoListDto, req.body);
            const validationErrors = await validate(toDoListDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const { refreshToken } = req.cookies;
            const toDoList = await this.service.createToDoList(toDoListDto, refreshToken);
            res.status(201).send(toDoList);
        } catch (error: any) {
            console.error('Error in create todo:', error);
            res.status(500).json({ message: error.message });
        }
    };

    changeToDoList: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const todoId = req.params.id;
            const status = String(req.body.status);

            const changeToDoList = await this.service.changeToDoList(refreshToken, todoId, status);
            res.status(201).send(changeToDoList);
        } catch (error: any) {
            console.error('Error in change todo:', error);
            res.status(500).json({ message: error.message });
        }
    };

    deleteToDoList: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const todoId = req.params.id;

            const deleteToDoList = await this.service.deleteToDoList(refreshToken, todoId);
            res.status(201).send(deleteToDoList);
        } catch (error: any) {
            console.error('Error in delete todo:', error);
            res.status(500).json({ message: error.message });
        }
    };
}
