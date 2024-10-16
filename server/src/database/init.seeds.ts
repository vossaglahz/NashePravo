import { AppDataSource } from '@/config/dataSource';
import DealHistorySeeder from '@/database/seeds/dealHistory.seeder';
import { UserSeeder } from '@/database/seeds/user.seeder';
import { runSeeders } from 'typeorm-extension';
import PersonalNotificationSeeder from './seeds/personalNotification.seeder';
import { RatingSeeder } from './seeds/lawyer.seeder';
import { LawyerSeeder } from './seeds/rating.seeder';

AppDataSource.initialize()
    .then(async () => {
        await AppDataSource.synchronize(true);
        await runSeeders(AppDataSource, {
            seeds: [UserSeeder, LawyerSeeder, DealHistorySeeder, PersonalNotificationSeeder, RatingSeeder],
        });
        process.exit();
    })
    .catch(error => {
        console.error('Error during Data Source initialization', error);
        process.exit(1);
    });
