import { ChatHistoryService } from '@/services/chatHistory.service';
import { RequestHandler } from 'express';

export class ChatHistoryController {
    private service: ChatHistoryService;

    constructor() {
        this.service = new ChatHistoryService();
    }

    getChatHistory: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const opponentId = Number(req.query.opponentId);

        const chatHistory = await this.service.getChatHistory(refreshToken, opponentId);
        res.send(chatHistory);
    };
}
