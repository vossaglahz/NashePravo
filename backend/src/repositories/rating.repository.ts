import { AppDataSource } from '@/config/dataSource';
import { RatingDto } from '@/dto/rating.dto';
import { Rating } from '@/entities/rating.entity';
import { Repository} from 'typeorm';
import { userRepo } from './user.repository';
import { dealHistoryRepo } from './dealHistory.repository';

export class RatingRepository extends Repository<Rating> {
    constructor() {
        super(Rating, AppDataSource.createEntityManager());
    }
    async getRating(lawyerId: string): Promise<RatingDto[] | null> {
        return await this.find({where:{
            lawyer: {
                id: Number(lawyerId)
            }
        },relations:['lawyer']});
     }

    async createRating(userId: string, dealHistoryId: string, docsDto: RatingDto) {
        const user = await userRepo.findByRefreshToken(userId);
        const deal = await dealHistoryRepo.findDealHistoryById(dealHistoryId)
        if (user && deal) {
            const data = {
                user: { id: user.id },
                lawyer: {id:deal.lawyer.id} ,
                description: docsDto.description,
                assessment: docsDto.assessment
            };

            const rating = await this.save(data);
            deal.rating = rating
            return await dealHistoryRepo.save(deal)
        } else {
            throw new Error('Пользователь или юрист не найдены');
        }
    }
}
