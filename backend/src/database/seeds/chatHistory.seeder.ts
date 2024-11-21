import { ChatHistory } from '@/entities/chatHistory.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class ChatHistorySeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const chatHistoryFactory = factoryManager.get(ChatHistory);
        const chatHistory = await chatHistoryFactory.make();
        await chatHistoryFactory.save(chatHistory);
    }
}
