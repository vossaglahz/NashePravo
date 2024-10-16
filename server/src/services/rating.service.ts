import { RatingDto } from '@/dto/rating.dto';
import { RatingRepository } from '@/repositories/rating.repository';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class RatingService {
    private repository: RatingRepository;

    constructor() {
        this.repository = new RatingRepository();
    }

    getRating = async (lawyerId:string): Promise<RatingDto> => {
        const lawyer = await this.repository.getRating(lawyerId);
        const instanceDocs = plainToInstance(RatingDto, lawyer);
        return instanceDocs;
    };


    createRating = async (userId: string, dealHistoryId: string, ratingDto: RatingDto) => {
        const instanceDocs = plainToInstance(RatingDto, ratingDto);
        const errors = await validate(instanceDocs);
        if (errors.length > 0) {
            throw new Error;
        }

        const data = await this.repository.createRating(userId, dealHistoryId, instanceDocs);  
        return data;
    };

}
