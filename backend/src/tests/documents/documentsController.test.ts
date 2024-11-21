import request from 'supertest';
import app from '../../index';
import { AppDataSource } from '@/config/dataSource';
import { DocsService } from '@/services/documents.service';
import { IUser } from '@/interfaces/IUser.inerface';

let mockRole = 'lawyer'; 

jest.mock('../../services/documents.service', () => {
    return {
        DocsService: jest.fn().mockImplementation(() => {
            return {
                createDoc: jest.fn(),
                publishDocs: jest.fn(),
                getDocs: jest.fn(),
                getNotPublishDocs: jest.fn(),
                getPublishDocs: jest.fn(),
                rejectDoc: jest.fn(),
            };
        }),
    };
});

jest.mock('../../helpers/jwtTokens', () => ({
    validateAccessToken: jest.fn(() => ({ id: 1, role: mockRole })),
}));

describe('DocsController', () => {
    let docsServiceInstance: any;

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    beforeEach(() => {
        docsServiceInstance = new DocsService();
    });

    describe('POST /docs', () => {
        it('добавление документов юристом', async () => {
            mockRole = 'lawyer';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'lawyer',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            }            

            const newDocument = {
                lawyerId: 1,
                documents: JSON.stringify([{ src: 'doc1.pdf', name: 'Document 1' }]),
                prevDocs: JSON.stringify([{ src: 'prevDoc1.pdf', name: 'Previous Document 1' }]),
            };

            const expectedResponse = {
                id: 1,
                lawyerId: 1,
                image: [
                    { src: 'doc1.pdf', name: 'Document 1' },
                    { src: 'prevDoc1.pdf', name: 'Previous Document 1' },
                ],
                lawyer: User,
                publish: false,
            };

            (docsServiceInstance.createDoc as jest.Mock).mockResolvedValue(expectedResponse);

            const res = await request(app.getApp())
              .post('/docs')
              .send(newDocument)
              .set('Authorization', `Bearer ${User.accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
    });

    describe('POST /docs/:id', () => {
        it('успешная публикация документа', async () => {
            mockRole = 'admin';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'admin',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            }   
            const docId = 1;
            const expectedResponse = { id: docId, published: true };

            (docsServiceInstance.publishDocs as jest.Mock).mockResolvedValue(expectedResponse);

            const res = await request(app.getApp())
              .post(`/docs/${docId}`)
              .set('Authorization', `Bearer ${User.accessToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });

        it('возвращает 500 в случае ошибки сервиса', async () => {
            mockRole = 'admin';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'admin',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            };   

            (docsServiceInstance.publishDocs as jest.Mock).mockRejectedValue(new Error('Ошибка при публикации документа'));

            const res = await request(app.getApp())
                .post('/docs/1')
                .set('Authorization', `Bearer ${User.accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({}); 
        });
    });

    describe('GET /docs/all/:id', () => {
        it('успешно возвращает опубликованные документы для администратора', async () => {
            mockRole = 'admin';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'admin',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            }   
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true },
                { id: 2, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true },
            ];

            (docsServiceInstance.getDocs as jest.Mock).mockResolvedValue(mockDocs);

            const res = await request(app.getApp())
              .get('/docs/all/1')
              .set('Authorization', `Bearer ${User.accessToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
    });

    describe('GET /docs/all', () => {
        it('успешно возвращает не опубликованные документы для администратора', async () => {
            mockRole = 'admin';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'admin',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            }   
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: false },
                { id: 2, lawyerId: 3, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: false },
            ];

            (docsServiceInstance.getNotPublishDocs as jest.Mock).mockResolvedValue(mockDocs);

            const res = await request(app.getApp())
              .get('/docs/all/1')
              .set('Authorization', `Bearer ${User.accessToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
    });

    describe('GET /docs', () => {
        it('успешно возвращает опубликованные документы для юриста', async () => {
            mockRole = 'lawyer';

            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'lawyer',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            }   
            const mockDocs = [
                { id: 1, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true },
                { id: 2, lawyerId: 1, image: [{src: 'file1.pdf', name: 'file1'}, {src: 'file2.pdf', name: 'file2'}], publish: true },
            ];

            (docsServiceInstance.getPublishDocs as jest.Mock).mockResolvedValue(mockDocs);

            const res = await request(app.getApp())
              .get('/docs')
              .set('Authorization', `Bearer ${User.accessToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
    });

    describe('POST /docs/reject/:id', () => {
        it('успешное отклонение документа', async () => {
            mockRole = 'admin';
    
            const User: IUser = {
                name: 'John',
                surname: 'Doe',
                email: 'testuser@example.com',
                password: '123456',
                role: 'admin',
                isActivatedByEmail: false,
                activationLink: '',
                refreshToken: 'mockRefreshToken',
                accessToken: 'mockAccessToken',
                id: 1,
                avgRating: 0,
                rating: [],
                dateBlocked: null,
                permanentBlocked: false,
                patronymicName: '',
                photo: '',
                personalNotification: [],
                requests: [],
                viewedNotifications: '',
            };
    
            const docId = 1;
            const expectedResponse = { id: docId, published: false };
    
            (docsServiceInstance.rejectDoc as jest.Mock).mockResolvedValue(expectedResponse);
    
            const res = await request(app.getApp())
                .post(`/docs/reject/${docId}`)
                .set('Authorization', `Bearer ${User.accessToken}`);
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
    });
});
