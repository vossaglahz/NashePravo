import { RatingService } from "@/services/rating.service";
import { RequestHandler } from "express";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RatingDto } from "@/dto/rating.dto";

export class RatingController {
    private service: RatingService;

    constructor() {
        this.service = new RatingService();
    }

    getRating: RequestHandler = async (req, res): Promise<void> => {
        try {
            const lawyerId = req.params.id;
            const docs = await this.service.getRating(lawyerId);
            res.send(docs);
        } catch (error) {
            console.log(error);
            
        }
    };

    createRating: RequestHandler = async (req, res): Promise<void> => {
        try {
            const dealHistoryId = req.params.id;
            const { refreshToken } = req.cookies;
            const ratingDto = plainToInstance(RatingDto, req.body);
            const errors = await validate(ratingDto);
            if (errors.length > 0) {
                const validationMessages = errors.map(err => {
                    return Object.values(err.constraints || {});
                }).flat();
                res.status(400).send({
                    message: 'Validation failed',
                    errors: validationMessages, 
                });
            }
            const docs = await this.service.createRating(refreshToken, dealHistoryId, ratingDto);
            res.send(docs);
        } catch (error) {
            console.log(error);
            
        }
    };
}
