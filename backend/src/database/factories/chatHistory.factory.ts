import { ChatHistory } from '@/entities/chatHistory.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ChatHistoryFactory = setSeederFactory(ChatHistory, async faker => {
    const chatHistory = new ChatHistory();
    chatHistory.userId = 1;
    chatHistory.lawyerId = 1;
    chatHistory.messages = [];

    return chatHistory;
});