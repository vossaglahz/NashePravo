import { Request, Response, NextFunction } from 'express';
import { RatingController } from '../../controllers/rating.contoller';
import { RatingService } from '../../services/rating.service';

jest.mock('../../services/rating.service');

const mockGetRating = jest.fn();
const mockCreateRating = jest.fn();

describe('RatingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let ratingController: RatingController;

  beforeEach(() => {

    RatingService.prototype.getRating = mockGetRating;
    RatingService.prototype.createRating = mockCreateRating;

    ratingController = new RatingController();

    req = {
      params: { id: '123' },
      body: {
        description: 'Отличный сервис!',
        assessment: 5,
      },
      cookies: {
        refreshToken: 'mock-refresh-token',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRating', () => {
    it('должен обрабатывать ошибки', async () => {
      const error = new Error('Ошибка получения рейтинга');
      mockGetRating.mockRejectedValue(error);

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await ratingController.getRating(req as Request, res as Response, next);

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(res.send).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('должен корректно обрабатывать успешный ответ', async () => {
      const rating = [{ description: 'Отличный сервис!', assessment: 5 }];
      mockGetRating.mockResolvedValue(rating);

      await ratingController.getRating(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(rating);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('createRating', () => {
    it('должен возвращать ошибки валидации', async () => {
      req.body = {};

      await ratingController.createRating(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          errors: expect.arrayContaining([
            'Отзыв не должно быть пустым',
            'Оценка не должна быть пустой',
            'Оценка должна быть числом',
            'Оценка должна быть не меньше 1',
            'Оценка должна быть не больше 5',
          ]),
        })
      );
    });

    it('должен обрабатывать ошибки из сервиса', async () => {
      const error = new Error('Ошибка создания рейтинга');
      mockCreateRating.mockRejectedValue(error);

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await ratingController.createRating(req as Request, res as Response, next);

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(res.send).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('должен корректно обрабатывать успешное создание', async () => {
      const newRating = {
        id: 1,
        description: 'Отличный сервис!',
        assessment: 5,
      };
      mockCreateRating.mockResolvedValue(newRating);

      await ratingController.createRating(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(newRating);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
