import { RatingService } from '@/services/rating.service';
import { RatingRepository } from '@/repositories/rating.repository';
import { RatingDto } from '@/dto/rating.dto';
import { Rating } from '@/entities/rating.entity';
import { DealHistory } from '@/entities/dealHistory.entity';
import { validateSync } from 'class-validator';

jest.mock('@/repositories/rating.repository');

describe('RatingService', () => {
    let service: RatingService;
    let repository: jest.Mocked<RatingRepository>;

    beforeEach(() => {
        service = new RatingService();
        repository = new RatingRepository() as jest.Mocked<RatingRepository>;
        service['repository'] = repository;
    });

    describe('getRating', () => {
        it('должен возвращать рейтинги юристу', async () => {
            const mockRatings: Rating[] = [
                {
                    id: 1,
                    description: 'Хороший сервис',
                    assessment: 4,
                    createdAt: new Date(),
                    lawyer: { id: 2 } as any,
                    user: { id: 1 } as any,
                    dealHistory: { id: 3 } as any,
                },
            ];

            repository.getRating.mockResolvedValue(mockRatings);

            const result = await service.getRating('2');
            expect(repository.getRating).toHaveBeenCalledWith('2');
            expect(result).toEqual(mockRatings);
        });
    });

    describe('createRating', () => {
        it('должен успешно создать рейтинг', async () => {
            const mockRatingDto: RatingDto = {
                description: 'Отличный сервис',
                assessment: 5,
            };

            const mockSavedDealHistory: DealHistory = {
                id: 1,
                title: 'Sample Deal',
                description: 'Deal description',
                price: 100,
                dealDate: new Date(),
                status: 'COMPLETED',
                userClose: true,
                lawyerClose: true,
                type: 'LEGAL',
                lawyer: { id: 2 } as any,
                user: { id: 1 } as any,
                userId: 1,
                lawyerId: 2,
                responses: [],
                chatId: 12345,
                rating: {
                    id: 1,
                    description: 'Отличный сервис',
                    assessment: 5,
                    createdAt: new Date(),
                    lawyer: { id: 2 } as any,
                    user: { id: 1 } as any,
                    dealHistory: {} as any,
                },
            };

            repository.createRating.mockResolvedValue(mockSavedDealHistory);

            const result = await service.createRating('1', '2', mockRatingDto);

            expect(repository.createRating).toHaveBeenCalledWith('1', '2', mockRatingDto);
            expect(result).toEqual(mockSavedDealHistory);
        });

        it('должен выдавать ошибку, если проверка не удалась', () => {
            const invalidRatingDto: Partial<RatingDto> = {
                description: '',
                assessment: 10,
            };

            const instanceDto = Object.assign(new RatingDto(), invalidRatingDto);
            const errors = validateSync(instanceDto);

            expect(errors.length).toBeGreaterThan(0);
        });
    });
});
