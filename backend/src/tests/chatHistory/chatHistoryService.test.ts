import { ChatHistoryService } from '@/services/chatHistory.service';
import { ChatHistoryRepository } from '@/repositories/chatHistory.repository';

jest.mock('@/repositories/chatHistory.repository', () => {
    return {
        ChatHistoryRepository: jest.fn().mockImplementation(() => ({
            getChatHistory: jest.fn(),
        })),
    };
});

describe('ChatHistoryService', () => {
    let service: ChatHistoryService;
    let repositoryMock: jest.Mocked<ChatHistoryRepository>;

    beforeEach(() => {
        repositoryMock = new ChatHistoryRepository() as jest.Mocked<ChatHistoryRepository>;
        service = new ChatHistoryService();
        // Внедряем mock репозитория в сервис
        (service as any).repository = repositoryMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getChatHistory', () => {
        it('should call repository.getChatHistory with correct arguments', async () => {
            const mockResult = { isClose: false, groupHistory: { '2024-11-15': [], '2024-11-16': [] } };
            repositoryMock.getChatHistory.mockResolvedValue(mockResult);

            const refreshToken = 'test-refresh-token';
            const opponentId = 42;

            const result = await service.getChatHistory(refreshToken, opponentId);

            expect(repositoryMock.getChatHistory).toHaveBeenCalledWith(refreshToken, opponentId);
            expect(result).toEqual(mockResult);
        });

        it('should propagate errors from the repository', async () => {
            const error = new Error('Repository error');
            repositoryMock.getChatHistory.mockRejectedValue(error);

            const refreshToken = 'test-refresh-token';
            const opponentId = 42;

            await expect(service.getChatHistory(refreshToken, opponentId)).rejects.toThrow('Repository error');
            expect(repositoryMock.getChatHistory).toHaveBeenCalledTimes(1);
            expect(repositoryMock.getChatHistory).toHaveBeenCalledWith(refreshToken, opponentId);
        });
    });
});
