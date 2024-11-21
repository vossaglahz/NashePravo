import { ChatHistoryRepository } from '@/repositories/chatHistory.repository';

export class ChatHistoryService {
    private repository: ChatHistoryRepository;

    constructor() {
        this.repository = new ChatHistoryRepository();
    }

    getChatHistory = async (refreshToken: string, opponentId: number) => {
        return await this.repository.getChatHistory(refreshToken, opponentId);
    };
}
