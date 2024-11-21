import { GeneralNotifications } from '@/entities/generalNotification.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class GeneralNotificationSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const generalNotificationFactory = factoryManager.get(GeneralNotifications);
        await generalNotificationFactory.saveMany(15);
    }
}
