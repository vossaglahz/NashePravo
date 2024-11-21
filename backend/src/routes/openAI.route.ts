import { Router } from 'express';
import { IRoute } from '@/interfaces/IRoute.interface';
import { OpenAIController } from '@/controllers/OpenAI.controller';
import { upload } from '@/middlewares/multer';

export class OpenAIRoute implements IRoute {
    public path = '/openAi';
    public router = Router();

    private controller: OpenAIController;

    constructor() {
        this.controller = new OpenAIController();
        this.init();
    }

    private init() {
        this.router.post('/', upload.single('document'), this.controller.getMessageOpenAi);
    }
}
