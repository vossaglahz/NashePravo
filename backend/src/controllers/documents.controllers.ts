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
        docsDto.lawyerId = req.body.lawyerId;
        docsDto.image = [];

        if (req.body.documents) {
            if (typeof req.body.documents === 'string') {
                const doc = JSON.parse(req.body.documents);
                docsDto.image.push({ src: doc.src, name: doc.name });
            } else if (Array.isArray(req.body.documents)) {
                docsDto.image = req.body.documents.map((doc: any) => ({
                    src: doc.src,
                    name: doc.name,
                }));
            }
        }

        if (req.body.prevDocs) {
            if (typeof req.body.prevDocs === 'string') {
                const parsedPrevDocs = JSON.parse(req.body.prevDocs);
                docsDto.image = [...docsDto.image, ...parsedPrevDocs];
            } else if (Array.isArray(req.body.prevDocs)) {
                docsDto.image = [...docsDto.image, ...req.body.prevDocs];
            }
        }

        if (Array.isArray(req.files) && req.files.length > 0) {
            req.files.forEach(file => {
                docsDto.image.push({ src: file.filename, name: file.originalname });
            });
        } else {
            console.log('No files found in the request');
        }

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

    getNotPublishDocs: RequestHandler = async (req, res): Promise<void> => {
        const docs = await this.service.getNotPublishDocs();
        res.send(docs);
    };

    getPublishDocs: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const docs = await this.service.getPublishDocs(refreshToken);
        res.send(docs);
    };

    // deletePublishDoc: RequestHandler = async (req, res) => {
    //     try {
    //         const deleteDoc = await this.service.deletePublishDoc(req.params.id);
    //         res.send(deleteDoc);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(400).send({ message: `${error.message}` });
    //         }
    //     }
    // };
    rejectDoc: RequestHandler = async (req, res): Promise<void> => {
        try {
            const requestId = req.params.id;
            const request = await this.service.rejectDoc(requestId);

            res.status(200).send(request);
        } catch (error) {
            console.error('Error in rejecting request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
