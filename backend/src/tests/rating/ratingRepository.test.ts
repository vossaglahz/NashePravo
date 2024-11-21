import { RatingRepository } from '@/repositories/rating.repository';
import { userRepo } from '@/repositories/user.repository';
import { dealHistoryRepo } from '@/repositories/dealHistory.repository';

jest.mock('@/repositories/user.repository', () => ({
    userRepo: {
        findByRefreshToken: jest.fn(),
    },
}));

jest.mock('@/repositories/dealHistory.repository', () => ({
    dealHistoryRepo: {
        findDealHistoryById: jest.fn(),
        save: jest.fn(),
    },
}));

describe('RatingRepository', () => {
    let repository: RatingRepository;

    beforeEach(() => {
        repository = new RatingRepository();
    });

    it('создание нового рейтинга для юриста', async () => {
        const mockUser = {
            id: 1,
            name: 'Test User',
            surname: 'User',
            email: 'test@example.com',
            isActivatedByEmail: true,
        };

        const mockDeal = {
            id: 1,
            title: 'Deal 1',
            description: 'Test Deal',
            price: 100,
            dealDate: new Date(),
            status: 'Create',
            userClose: false,
            lawyerClose: false,
            type: 'Legal',
            userId: 1,
            lawyerId: 2,
            lawyer: { id: 2, name: 'Test Lawyer' },
        };

        const mockRatingDto = {
            description: 'Отличная услуга',
            assessment: 5,
        };

        const mockSavedRating = {
            id: 1,
            description: mockRatingDto.description,
            assessment: mockRatingDto.assessment,
            createdAt: new Date(),
            user: { id: mockUser.id },
            lawyer: { id: mockDeal.lawyer.id },
            dealHistory: { id: mockDeal.id },
        };

        const mockUpdatedDeal = {
            ...mockDeal,
            rating: mockSavedRating,
        };

        jest.spyOn(userRepo, 'findByRefreshToken').mockResolvedValue(mockUser as any);
        jest.spyOn(dealHistoryRepo, 'findDealHistoryById').mockResolvedValue(mockDeal as any);
        jest.spyOn(repository, 'save').mockResolvedValue(mockSavedRating as any);
        jest.spyOn(dealHistoryRepo, 'save').mockResolvedValue(mockUpdatedDeal as any);

        const result = await repository.createRating('1', '1', mockRatingDto);

        expect(result).toBeDefined();
        expect(result.rating).toEqual(mockSavedRating);
        expect(userRepo.findByRefreshToken).toHaveBeenCalledWith('1');
        expect(dealHistoryRepo.findDealHistoryById).toHaveBeenCalledWith('1');
        expect(repository.save).toHaveBeenCalledWith({
            user: { id: mockUser.id },
            lawyer: { id: mockDeal.lawyer.id },
            description: mockRatingDto.description,
            assessment: mockRatingDto.assessment,
        });
        expect(dealHistoryRepo.save).toHaveBeenCalledWith(mockUpdatedDeal);
    });

    it('получить рейтигни юриста', async () => {
        const mockRatings = [
            {
                id: 1,
                description: 'Хорошо',
                assessment: 4,
                createdAt: new Date(),
                user: { id: 1 },
                lawyer: { id: 2 },
                dealHistory: { id: 1 },
            },
        ];

        jest.spyOn(repository, 'find').mockResolvedValue(mockRatings as any);

        const result = await repository.getRating('2');
        expect(result).toEqual(mockRatings);
        expect(repository.find).toHaveBeenCalledWith({
            where: {
                lawyer: { id: 2 },
            },
            relations: ['lawyer'],
        });
    });
});
