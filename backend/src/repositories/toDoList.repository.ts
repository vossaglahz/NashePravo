import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { Repository } from 'typeorm';
import { ToDoList } from '@/entities/toDoList.entity';
import { ToDoListDto } from '@/dto/toDoList.dto';

export class ToDoListRepository extends Repository<ToDoList> {
    constructor() {
        super(ToDoList, AppDataSource.createEntityManager());
    }

    async getToDoList(refreshToken: string) {
        let user = null;
        user = await this.manager.findOne(Lawyer, { where: { refreshToken } });
        if (!user) {
            user = await this.manager.findOne(User, { where: { refreshToken } });
        }

        if (!user) {
            throw new Error('Пользователь не найден');
        }
        let client;
        let clientId = user.id;

        if (user.role === 'user') {
            client = 'user';
        }
        if (user.role === 'lawyer') {
            client = 'lawyer';
        }

        const queryBuilder = this.createQueryBuilder('toDoList')
            .leftJoinAndSelect(`toDoList.${client}`, `${client}`)
            .where(`${client}.refreshToken = :refreshToken`, { refreshToken })
            .andWhere(`toDoList.${client}Id = :clientId`, { clientId })
            .orderBy('toDoList.id', 'DESC');

        const deals = await queryBuilder.getMany();

        return deals;
    }

    async createToDoList(toDoListDto: ToDoListDto, refreshToken: string) {
        try {
            const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
            const user = await this.manager.findOne(User, { where: { refreshToken } });
    
            if (!user && !lawyer) {
                throw new Error('Пользователь не найден');
            }
    
            const toDoList = new ToDoList();
            toDoList.text = toDoListDto.text;
            toDoList.status = toDoListDto.status;
    
            if (user) {
                toDoList.user = user;
            }
    
            if (lawyer) {
                toDoList.lawyer = lawyer;
            }
    
            return await this.save(toDoList);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания задачи');
        }
    }

    async changeToDoList(refreshToken: string, todoId: string, status: string) {
        try {
            const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
            const user = await this.manager.findOne(User, { where: { refreshToken } });
    
            if (!user && !lawyer) {
                throw new Error('Пользователь не найден');
            }

            const condition: any = { id: Number(todoId) };
            if (lawyer) {
                condition.lawyer = lawyer;
            } else if (user) {
                condition.user = user;
            }
    
            const todo = await this.manager.findOne(ToDoList, { where: condition });

            if (!todo) throw new Error('Задача не найдена или у вас нет прав на её изменение');

            todo.status = status;

            return await this.save(todo);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка изменение задачи');
        }
    }

    async deleteToDoList(refreshToken: string, todoId: string) {
        try {
            const lawyer = await this.manager.findOne(Lawyer, { where: { refreshToken } });
            const user = await this.manager.findOne(User, { where: { refreshToken } });
    
            if (!user && !lawyer) {
                throw new Error('Пользователь не найден');
            }
    
            const whereCondition: any = { id: Number(todoId) };
            if (lawyer) {
                whereCondition.lawyer = lawyer;
            } else if (user) {
                whereCondition.user = user;
            }
    
            const todo = await this.manager.findOne(ToDoList, { where: whereCondition });
    
            if (!todo) {
                throw new Error('Задача не найдена или у вас нет прав на её удаление');
            }
    
            await this.manager.remove(ToDoList, todo);
    
            return { message: 'Задача успешно удалена' };
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка при удалении задачи');
        }
    }
}

export const toDoListRepo = new ToDoListRepository();
