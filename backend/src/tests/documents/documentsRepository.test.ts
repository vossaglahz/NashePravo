import { DocumentsDto } from '@/dto/documents.dto';
import { DocsRepository } from '../../repositories/documents.repository';
import { AppDataSource } from '@/config/dataSource';

jest.mock('@/config/dataSource', () => ({
    AppDataSource: {
        createEntityManager: jest.fn().mockReturnValue({
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            getMany: jest.fn(),
            delete: jest.fn(),
            getMetadata: jest.fn().mockReturnValue({
                columns: [],
            }),
        }),
    },
}));

describe('DocsRepository', () => {
    let docsRepository: DocsRepository;
    let mockEntityManager: any;

    beforeEach(() => {
        mockEntityManager = AppDataSource.createEntityManager();
        docsRepository = new DocsRepository();
        jest.spyOn(docsRepository, 'createDoc').mockImplementation(async (docsDto) => {
            mockEntityManager.findOne({
                where: { lawyer: { id: docsDto.lawyerId } }, order: { id: 'desc' }
            });
            return mockEntityManager.save(docsDto);
        });
        jest.spyOn(docsRepository, 'publishDocs').mockImplementation(async (docId) => {
            mockEntityManager.find({
                where: { id: docId }
            });
            return mockEntityManager.save();
        });
        jest.spyOn(docsRepository, 'getDocs').mockImplementation(async (lawyerId) => {
            return mockEntityManager.getMany();
        });
        jest.spyOn(docsRepository, 'getNotPublishDocs').mockImplementation(async () => {
            return mockEntityManager.find({
                where: {
                    publish: false,
                },
                order: {
                    id: 'DESC',
                },
                relations: {
                    lawyer: true,
                },
            });
        });
        jest.spyOn(docsRepository, 'getPublishDocs').mockImplementation(async (refreshToken) => {
            return mockEntityManager.findOne({
                where: {
                    publish: true,
                    lawyer: {
                        refreshToken: refreshToken,
                    },
                },
                order: {
                    id: 'DESC',
                },
            });
        });
        jest.spyOn(docsRepository, 'rejectDoc').mockImplementation(async (requestId: string) => {
            const id = Number(requestId)
            await mockEntityManager.findOne({
                where: { id }
            });
            await mockEntityManager.delete(id);
            return { message: 'успешно удален' };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createDoc', () => {
        it('должен создать новый документ, если документа с таким lawyerId не существует', async () => {
            const newDocDto: DocumentsDto = {
                lawyerId: 1,
                image: [{ src: 'file1.pdf', name: 'file1' }],
            };

            (mockEntityManager.findOne as jest.Mock).mockResolvedValue(null);
            (mockEntityManager.save as jest.Mock).mockResolvedValue(newDocDto);

            const result = await docsRepository.createDoc(newDocDto);
            expect(mockEntityManager.findOne).toHaveBeenCalledWith({ where: { lawyer: { id: newDocDto.lawyerId } }, order: { id: 'desc' } });
            expect(mockEntityManager.save).toHaveBeenCalledWith(newDocDto);
            expect(result).toEqual(newDocDto);
        });

    });

    describe('publishDocs', () => {
        it('успешная публикация документа', async () => {
            const docId = 1; 
            const newDoc = {
                id: docId,
                lawyerId: 1,
                image: [{ src: 'file1.pdf', name: 'file1' }],
                publish: false,
            };

            (mockEntityManager.find as jest.Mock).mockResolvedValue([newDoc]);
            (mockEntityManager.save as jest.Mock).mockResolvedValue({ ...newDoc, publish: true });

            const result = await docsRepository.publishDocs(docId);
            expect(mockEntityManager.find).toHaveBeenCalledWith({ where: { id: docId } });
            expect(mockEntityManager.save).toHaveBeenCalledWith();
            expect(result).toEqual({ ...newDoc, publish: true });
        });
    });

    describe('getDocs', () => {
        it('успешно возвращает опубликованные документы для администратора', async () => {
            const lawyerId = 1;
            const mockDoc = { id: 1, lawyerId: 1, image: [{ src: 'file1.pdf', name: 'file1' }], publish: true };

            (mockEntityManager.getMany as jest.Mock).mockResolvedValue(mockDoc);

            const result = await docsRepository.getDocs(lawyerId);
            expect(mockEntityManager.getMany).toHaveBeenCalled();
            expect(result).toEqual(mockDoc);
        });
    });

    describe('getNotPublishDocs', () => {
        it('успешно возвращает не опубликованные документы для администратора', async () => {
            const mockDoc = { id: 1, lawyerId: 1, image: [{ src: 'file1.pdf', name: 'file1' }], publish: false };

            (mockEntityManager.find as jest.Mock).mockResolvedValue(mockDoc);

            const result = await docsRepository.getNotPublishDocs();
            expect(mockEntityManager.find).toHaveBeenCalledWith({
                where: {
                    publish: false,
                },
                order: {
                    id: 'DESC',
                },
                relations: {
                    lawyer: true,
                },
            });
            expect(result).toEqual(mockDoc);
        });
    });

    describe('getPublishDocs', () => {
        it('успешно возвращает опубликованные документы для юриста', async () => {
            const mockRefreshToken = 'mockRefreshToken';
            const mockDoc = { id: 1, lawyerId: 1, image: [{ src: 'file1.pdf', name: 'file1' }], publish: true };

            (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockDoc);

            const result = await docsRepository.getPublishDocs(mockRefreshToken);
            expect(mockEntityManager.findOne).toHaveBeenCalledWith({
                where: {
                    publish: true,
                    lawyer: { refreshToken: mockRefreshToken },
                },
                order: { id: 'DESC' },
            });
            expect(result).toEqual(mockDoc);
        });
    });

    describe('rejectDoc', () => {
        it('успешное отклонение документа', async () => {
            const docId = '1'; 
            const id = Number(docId);
            const newDoc = {
                id: id,
                lawyerId: 1,
                image: [{ src: 'file1.pdf', name: 'file1' }],
                publish: false,
            };

            (mockEntityManager.findOne as jest.Mock).mockResolvedValue(docId);
            (mockEntityManager.delete as jest.Mock).mockResolvedValue(newDoc.id);

            const result = await docsRepository.rejectDoc(docId);
            expect(mockEntityManager.findOne).toHaveBeenCalledWith({ where: { id: id } });
            expect(mockEntityManager.delete).toHaveBeenCalledWith(newDoc.id);
            expect(result).toEqual({ message: 'успешно удален' });
        });
    });
});