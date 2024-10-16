import { AppDataSource } from '@/config/dataSource';
import { DocumentsDto } from '@/dto/documents.dto';
import { Documents } from '@/entities/documents.entity';
import { IDocuments } from '@/interfaces/IDocuments.interface';
import { Repository } from 'typeorm';
import { Request } from 'express';

export class DocsRepository extends Repository<Documents> {
    constructor() {
        super(Documents, AppDataSource.createEntityManager());
    }

    async createDoc(docsDto: DocumentsDto) {
        return await this.save(docsDto);
    }

    async publishDocs(id: number) {
        const doc = await this.find({ where: { id } });
        doc[0].publish = true;
        return await this.save(doc[0]);
    }

    async getDocs(lawyerId?: number): Promise<IDocuments[]> {
        const queryBuilder = this.createQueryBuilder('documents').leftJoinAndSelect('documents.lawyer', 'lawyer');
        if (lawyerId) {
            queryBuilder.where('documents.lawyerId = :lawyerId', { lawyerId });
        }
        queryBuilder.orderBy('documents.id', 'ASC');

        return await queryBuilder.getMany();
    }

    async getPublishDocs(refreshToken: string): Promise<IDocuments | null> {
        return await this.findOne({
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
    }

    async getOnePublish(req: Request) {
        const msg = req.query.documents as string;
        return await this.find({ where: { id: Number(msg), publish: true }, relations: { lawyer: true } });
    }

    async deletePublishDoc(id: number) {
        const doc = await this.find({ where: { id } });
        if (doc[0].publish == true) {
            return await this.delete(doc[0]);
        } else {
            throw Error;
        }
    }
}
