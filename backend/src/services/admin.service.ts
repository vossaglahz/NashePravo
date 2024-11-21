import { IFilterUsers } from '@/interfaces/IFilterUsers.interface';
import { AdminRepo } from '@/repositories/admin.repository';

export class AdminService {
    private repository: AdminRepo;

    constructor() {
        this.repository = new AdminRepo();
    }

    async getAllRequest() {
        const requests = await this.repository.getAllRequest();
        return requests;
    }

    async getAllUsers(filters: IFilterUsers) {
        const users = await this.repository.getAllUsers(filters);
        return users;
    }

    async approveRequest(requestId: string) {
        try {
            const request = await this.repository.approveRequest(requestId);
            let req;
            if (!request) {
                throw new Error('Запрос не найден');
            }

            if (request.type === 'edit') {
                if (request.lawyer) {
                    req = await this.repository.updateLawyerInfo(request.lawyer.id, request.data);
                } else if (request.user) {
                    req = await this.repository.updateUserInfo(request.user.id, request.data);
                }
            }

            if (request.type === 'delete') {
                if (request.lawyer) {
                    req = await this.repository.deleteLawyerPhoto(request.lawyer.id);
                } else if (request.user) {
                    req = await this.repository.deleteUserPhoto(request.user.id);
                }
            }

            return req;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка одобрения запроса');
            } else {
                throw new Error('Неизвестная ошибка при одобрении запроса');
            }
        }
    }

    async rejectRequest(requestId: string) {
        try {
            const request = await this.repository.rejectRequest(requestId);
            if (!request) {
                throw new Error('Запрос не найден');
            }

            return request;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка отклонения запроса');
            } else {
                throw new Error('Неизвестная ошибка при отклонении запроса');
            }
        }
    }
}
