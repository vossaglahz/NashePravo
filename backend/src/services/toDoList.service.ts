import { ToDoListDto } from "@/dto/toDoList.dto";
import { ToDoListRepository } from "@/repositories/toDoList.repository";

export class ToDoListService {
    private repository: ToDoListRepository;

    constructor() {
        this.repository = new ToDoListRepository();
    }

    getToDoList = async (refreshToken: string) => {
        return await this.repository.getToDoList(refreshToken);
    };

    createToDoList = async (toDoListDto: ToDoListDto, refreshToken: string) => {
        try {
            return await this.repository.createToDoList(toDoListDto, refreshToken);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания задачи');
            } else {
                throw new Error('Неизвестная ошибка при создании задачи');
            }
        }
    }

    changeToDoList = async (refreshToken: string, todoId: string, status: string) => {
        try {
            return await this.repository.changeToDoList(refreshToken, todoId, status);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка изменений задачи');
            } else {
                throw new Error('Неизвестная ошибка при изменений задачи');
            }
        }
    }

    deleteToDoList = async (refreshToken: string, todoId: string) => {
        try {
            return await this.repository.deleteToDoList(refreshToken, todoId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка при удалении задачи');
            } else {
                throw new Error('Неизвестная ошибка при удалении задачи');
            }
        }
    }
}
