import { DealHistory } from "@/entities/dealHistory.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class DealHistorySeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const dealHistoryFactory = factoryManager.get(DealHistory);
        await dealHistoryFactory.saveMany(30);
    }
}