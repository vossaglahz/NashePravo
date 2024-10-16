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

    getPublishDocs = async(refreshToken: string): Promise<DocumentsDto> => {
        const docs = await this.repository.getPublishDocs(refreshToken);        
        const instanceDocs = plainToInstance(DocumentsDto, docs);
        return instanceDocs;
    }

    deletePublishDoc = async (paramsId: string) => {
        const id = Number(paramsId);
        return await this.repository.deletePublishDoc(id);
    };

}
