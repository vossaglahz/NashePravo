import { DocumentsDto } from '@/dto/documents.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { DocsRepository } from '@/repositories/documents.repository';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class DocsService {
    private repository: DocsRepository;

    constructor() {
        this.repository = new DocsRepository();
    }

    createDoc = async (docsDto: DocumentsDto) => {
        const errors = await validate(docsDto, { whitelist: true });
        if (errors.length) throw formatErrors(errors);
        return await this.repository.createDoc(docsDto);
    };

    publishDocs = async (paramsId: number) => {
        const id = Number(paramsId);
        return await this.repository.publishDocs(id);
    };

    getDocs = async (lawyerId?: number): Promise<DocumentsDto[]> => {
        const docs = await this.repository.getDocs(lawyerId);
        const instanceDocs = plainToInstance(DocumentsDto, docs);
        return instanceDocs;
    };

    getPublishDocs = async (refreshToken: string): Promise<DocumentsDto> => {
        const docs = await this.repository.getPublishDocs(refreshToken);
        const instanceDocs = plainToInstance(DocumentsDto, docs);
        return instanceDocs;
    };

    getNotPublishDocs = async (): Promise<DocumentsDto[]> => {
        const docs = await this.repository.getNotPublishDocs();
        const instanceDocs = plainToInstance(DocumentsDto, docs);
        return instanceDocs;
    };

    async rejectDoc(requestId: string) {
        try {
            const request = await this.repository.rejectDoc(requestId);
            if (!request) {
                throw new Error('Запрос не найден');
            }

            return request;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка отклонения запроса');
            } else {
                throw new Error('Неизвестная ошибка при отклонении запроса');
            }
        }
    }
}
