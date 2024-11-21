import { upload } from '@/middlewares/multer';
import { Router } from 'express';
import { IRoute } from '@/interfaces/IRoute.interface';
import { DocsController } from '@/controllers/documents.controllers';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';

export class DocumentsRoute implements IRoute {
    public path = '/docs';
    public router = Router();

    private controller: DocsController;

    constructor() {
        this.controller = new DocsController();
        this.init();
    }

    private init() {
        this.router.post('/', authValidate, checkRole('lawyer'), upload.array('documents'), this.controller.createDocs);
        this.router.post('/:id', authValidate, checkRole('admin'), this.controller.publishDocs);
        this.router.get('/all/:id', authValidate, checkRole('admin'), this.controller.getDocs);
        this.router.get('/all', authValidate, checkRole('admin'), this.controller.getNotPublishDocs);
        this.router.get('/', authValidate, checkRole('lawyer'), this.controller.getPublishDocs);
        this.router.post('/reject/:id', authValidate, checkRole('admin'), this.controller.rejectDoc);
    }
}
