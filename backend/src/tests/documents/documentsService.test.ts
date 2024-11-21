import { DocsService } from '../../services/documents.service';
import { DocsRepository } from '../../repositories/documents.repository';
import { DocumentsDto } from '../../dto/documents.dto';
import { validate } from 'class-validator';
import { formatErrors } from '../../helpers/formatErrors';
import { plainToInstance } from 'class-transformer';

jest.mock('class-validator');
jest.mock('../../repositories/documents.repository');
jest.mock('../../helpers/formatErrors');

describe('DocsService', () => {
    let docsService: DocsService;
    let mockRepository: DocsRepository;

    beforeEach(() => {
        docsService = new DocsService();
        mockRepository = docsService['repository'] as unknown as DocsRepository;
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('createDoc', () => {
        it('успешно создает документ при валидных данных', async () => {
            const mockDocDto: DocumentsDto = {
                lawyerId: 1,
                image: [{ src: 'doc1.pdf', name: 'Document 1' }],
            };

            (validate as jest.Mock).mockResolvedValue([]);
            (mockRepository.createDoc as jest.Mock).mockResolvedValue(mockDocDto);

            const result = await docsService.createDoc(mockDocDto);

            expect(validate).toHaveBeenCalledWith(mockDocDto, { whitelist: true });
            expect(mockRepository.createDoc).toHaveBeenCalledWith(mockDocDto);
            expect(result).toEqual(mockDocDto); 
        });

        it('возвращает ошибку валидации при некорректных данных', async () => {
            const mockDocDto: DocumentsDto = {
                lawyerId: 1,
                image: [{ src: 'doc1.pdf', name: 'Document 1' }],
            };

            const validationErrors = [{ property: 'documents', constraints: { isUrl: 'Invalid URL format' } }];
            (validate as jest.Mock).mockResolvedValue(validationErrors);
            (formatErrors as jest.Mock).mockReturnValue('Validation failed');

            await expect(docsService.createDoc(mockDocDto)).rejects.toEqual('Validation failed');

            expect(validate).toHaveBeenCalledWith(mockDocDto, { whitelist: true });
            expect(mockRepository.createDoc).not.toHaveBeenCalled();
            expect(formatErrors).toHaveBeenCalledWith(validationErrors);
        });
    });

    describe('publishDocs', () => {
        it('успешная публикация документа', async () => {
            const mackId = 1;
            const mockResponse = { id: mackId, publish: true };

            (mockRepository.publishDocs as jest.Mock).mockResolvedValue(mockResponse);

            const result = await docsService.publishDocs(mackId);

            expect(mockRepository.publishDocs).toHaveBeenCalledWith(mackId);
            expect(result).toEqual(mockResponse); 
        });
    });

    describe('getDocs', () => {
        it('успешно возвращает опубликованные документы для администратора', async () => {
            const lawyerId = 1;
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true },
            ];

            (mockRepository.getDocs as jest.Mock).mockResolvedValue(mockDocs);

            const result = await docsService.getDocs(lawyerId);

            expect(mockRepository.getDocs).toHaveBeenCalledWith(lawyerId);
            expect(result).toEqual(mockDocs); 
        });
    });


    describe('getNotPublishDocs', () => {
        it('успешно возвращает не опубликованные документы для администратора', async () => {
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: false },
                { id: 2, lawyerId: 2, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: false },
            ];

            (mockRepository.getNotPublishDocs as jest.Mock).mockResolvedValue(mockDocs);

            const result = await docsService.getNotPublishDocs();

            expect(mockRepository.getNotPublishDocs).toHaveBeenCalledWith();
            expect(result).toEqual(mockDocs); 
        });
    });

    describe('getPublishDocs', () => {
        it('успешно возвращает опубликованные документы для юриста', async () => {
            const mockRefreshToken = 'mockRefreshToken';
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true }
            ];

            const expectedDocs = plainToInstance(DocumentsDto, mockDocs);

            (mockRepository.getPublishDocs as jest.Mock).mockResolvedValue(mockDocs);

            const result = await docsService.getPublishDocs(mockRefreshToken);

            expect(mockRepository.getPublishDocs).toHaveBeenCalledWith(mockRefreshToken);
            expect(result).toEqual(expectedDocs); 
        });
    });

    
    describe('rejectDoc', () => {
        it('успешное отклонение документа', async () => {
            const requestId = '1';
            const expectedResponse = { message: 'успешно удален' };
    
            (mockRepository.rejectDoc as jest.Mock).mockResolvedValue(expectedResponse);

            const result = await docsService.rejectDoc(requestId);

            expect(mockRepository.rejectDoc).toHaveBeenCalledWith(requestId);
            expect(result).toEqual(expectedResponse); 
        });

        it('возвращает ошибку, если возникает ошибка в репозитории', async () => {
            const requestId = '1';
            const errorMessage = 'Ошибка при удалении документа';

            (mockRepository.rejectDoc as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(docsService.rejectDoc(requestId)).rejects.toThrow('Ошибка при удалении документа');
            expect(mockRepository.rejectDoc).toHaveBeenCalledWith(requestId);
        });

        it('возвращает общую ошибку при неизвестной ошибке', async () => {
            const requestId = '1';

            (mockRepository.rejectDoc as jest.Mock).mockRejectedValue(new Error());

            await expect(docsService.rejectDoc(requestId)).rejects.toThrow('Ошибка отклонения запроса');
            expect(mockRepository.rejectDoc).toHaveBeenCalledWith(requestId);
        });
    });
});