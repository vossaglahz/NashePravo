import { Rating } from "@/entities/rating.entity";
import { Lawyer } from '@/entities/lawyers.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class RatingSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const ratingFactory = factoryManager.get(Rating);
        await ratingFactory.saveMany(15);
        const lawyerFactory = factoryManager.get(Lawyer);
        await lawyerFactory.saveMany(20);
    }
}
