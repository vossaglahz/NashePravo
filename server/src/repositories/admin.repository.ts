import { AppDataSource } from '@/config/dataSource';
import { LawyerInfoDto } from '@/dto/lawyerInfo.dto';
import { LawyerRequest } from '@/entities/lawyerRequest.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { User } from '@/entities/user.entity';
import { IFilterUsers } from '@/interfaces/IFilterUsers.interface';
import { Repository } from 'typeorm';

export class AdminRepo {
    private lawyerRequestRepo: Repository<LawyerRequest>;
    private lawyerRepo: Repository<Lawyer>;
    private userRepo: Repository<User>;

    constructor() {
        this.lawyerRequestRepo = AppDataSource.getRepository(LawyerRequest);
        this.lawyerRepo = AppDataSource.getRepository(Lawyer);
        this.userRepo = AppDataSource.getRepository(User);
    }

    async getAllRequest() {
        const requests = await this.lawyerRequestRepo.find({ where: { isApproved: false } });
        return requests;
    }

    async getAllUsers(filters: IFilterUsers) {
        const userWhere: any = {};
        const lawyerWhere: any = {};
        const order: any = {};

        if (filters.role === 'user') {
            userWhere.role = filters.role;

            if (filters.isActivatedByEmail) {
                userWhere.isActivatedByEmail = filters.isActivatedByEmail;
            }
            if (filters.permanentBlock) {
                userWhere.permanentBlocked = filters.permanentBlock;
            }
        } else if (filters.role === 'lawyer') {
            lawyerWhere.role = filters.role;

            if (filters.isActivatedByEmail) {
                lawyerWhere.isActivatedByEmail = filters.isActivatedByEmail;
            }

            if (filters.isConfirmed) {
                lawyerWhere.isConfirmed = filters.isConfirmed;
            }
            if (filters.permanentBlock) {
                lawyerWhere.permanentBlocked = filters.permanentBlock;
            }
        }

        if (filters.sorted) order.id = filters.sorted;

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
        const offset = (page - 1) * limit;

        let data: any[] = [];
        let count = 0;

        if (filters.role === 'user') {
            const [users, countUsers] = await this.userRepo.findAndCount({
                where: userWhere,
                order,
                skip: offset,
                take: limit,
            });
            data = users;
            count = countUsers;
        } else if (filters.role === 'lawyer') {
            const [lawyers, countLawyers] = await this.lawyerRepo.findAndCount({
                where: lawyerWhere,
                order,
                skip: offset,
                take: limit,
            });
            data = lawyers;
            count = countLawyers;
        }

        console.log('data: ', data);
        console.log('count: ', count);
        console.log(userWhere, lawyerWhere);

        return { data, count };
    }

    async updateLawyerInfo(id: number, lawyerInfoDto: LawyerInfoDto) {
        const lawyer = await this.lawyerRepo.findOne({ where: { id } });

        if (!lawyer) {
            throw new Error('Юрист не найден');
        }

        const changes: Record<string, { before: any; after: any }> = {};

        for (const key in lawyerInfoDto) {
            if (lawyerInfoDto[key as keyof LawyerInfoDto] !== lawyer[key as keyof Lawyer]) {
                changes[key] = {
                    before: lawyer[key as keyof Lawyer],
                    after: lawyerInfoDto[key as keyof LawyerInfoDto],
                };
            }
        }

        Object.assign(lawyer, lawyerInfoDto);

        await this.lawyerRepo.save(lawyer);
        return changes;
    }

    async deletePhoto(id: number) {
        if (isNaN(id)) {
            throw Error('Invalid ID');
        }

        const lawyer = await this.lawyerRepo.findOne({ where: { id } });

        if (!lawyer) {
            throw new Error('Юрист не найден');
        }

        lawyer.photo = '';
        await this.lawyerRepo.save(lawyer);
        return { message: 'Фото успешно удалено' };
    }

    async approveRequest(requestId: string) {
        const id = Number(requestId);
        const request = await this.lawyerRequestRepo.findOne({ where: { id }, relations: ['lawyer'] });

        if (!request) {
            throw new Error('Запрос не найден');
        }

        request.isApproved = true;
        request.approvedAt = new Date();

        return await this.lawyerRequestRepo.save(request);
    }

    async rejectRequest(requestId: string) {
        const id = Number(requestId);
        const request = await this.lawyerRequestRepo.findOne({ where: { id }, relations: ['lawyer'] });

        if (!request) {
            throw new Error('Запрос не найден');
        }

        request.isApproved = false;
        request.approvedAt = new Date();
        return await this.lawyerRequestRepo.save(request);
    }
}

export const adminRepo = new AdminRepo();