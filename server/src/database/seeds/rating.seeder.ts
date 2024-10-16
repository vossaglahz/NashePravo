import { Lawyer } from '@/entities/lawyers.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class LawyerSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const lawyerFactory = factoryManager.get(Lawyer);
        await lawyerFactory.saveMany(20);
    }
}
