import { DocumentsDto } from '@/dto/documents.dto';
import { DocsService } from '@/services/documents.service';
import { RequestHandler } from 'express';

export class DocsController {
    private service: DocsService;

    constructor() {
        this.service = new DocsService();
    }

    createDocs: RequestHandler = async (req, res): Promise<void> => {
        const docsDto = new DocumentsDto();
        docsDto.image = [];
        docsDto.lawyerId = req.body.lawyerId;

        if (req.body.documents) {
            if (typeof req.body.documents === 'string') {
                docsDto.image = [req.body.documents];
            } else {
                docsDto.image.push(...req.body.documents);
            }
        } else {
            docsDto.image = [];
        }
        if (Array.isArray(req.files)) req.files.map(file => docsDto.image.push(file.filename));

        try {
            const doc = await this.service.createDoc(docsDto);
            res.send(doc);
        } catch (error) {
            console.log(error);
            if (Array.isArray(error)) {
                res.status(400).send(error);
                return;
            }
            res.status(500).send(error);
        }
    };

    publishDocs: RequestHandler = async (req, res) => {
        const id = Number(req.params.id);
        const docs = await this.service.publishDocs(id);
        res.send(docs);
    };

    getDocs: RequestHandler = async (req, res): Promise<void> => {
        const lawyerId = parseInt(req.params.id);
        const docs = await this.service.getDocs(lawyerId);
        res.send(docs);
    };

    getPublishDocs: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const docs = await this.service.getPublishDocs(refreshToken);
        res.send(docs);
    };

    deletePublishDoc: RequestHandler = async (req, res) => {
        try {
            const deleteDoc = await this.service.deletePublishDoc(req.params.id);
            res.send(deleteDoc);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ message: `${error.message}` });
            }
        }
    };
}
