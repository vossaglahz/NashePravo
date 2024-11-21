import { User } from '@/entities/user.entity';
import { UserRoles } from '@/interfaces/IUser.inerface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userFactory = factoryManager.get(User);
        await userFactory.saveMany(20);

        const adminUser = await userFactory.make({ role: UserRoles.admin });
        await dataSource.getRepository(User).save(adminUser);
    }
}
