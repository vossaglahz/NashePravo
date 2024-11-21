import { PersonalNotification } from '@/entities/personalNotification.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PersonalNotificationSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const personalNotificationFactory = factoryManager.get(PersonalNotification);
        await personalNotificationFactory.saveMany(20);
    }
}
