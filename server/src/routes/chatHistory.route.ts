import { ChatHistoryController } from '@/controllers/chatHistory.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { Router } from 'express';

export class ChatHistoryRoute implements IRoute {
    path = '/chat';
    router = Router();
    private controller: ChatHistoryController;

    constructor() {
        this.controller = new ChatHistoryController();
        this.init();
    }

    private init() {
        this.router.get('/', this.controller.getChatHistory);
    }
}