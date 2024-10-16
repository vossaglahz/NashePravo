import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { Repository } from 'typeorm';
import { ChatHistory } from '@/entities/chatHistory.entity';
import { IMessages } from '@/interfaces/IChatHistory.interface';

export class ChatHistoryRepository {
    private repo: Repository<ChatHistory>;
    private userRepo: Repository<User>;
    private lawyerRepo: Repository<Lawyer>;

    constructor() {
        this.repo = AppDataSource.getRepository(ChatHistory);
        this.userRepo = AppDataSource.getRepository(User);
        this.lawyerRepo = AppDataSource.getRepository(Lawyer);
    }

    async getChatHistory(refreshToken: string, opponentId: number) {
        let client = null;
        client = await this.userRepo.findOne({ where: { refreshToken } });

        if (!client) {
            client = await this.lawyerRepo.findOne({ where: { refreshToken } });
        }

        let history: IMessages[] = [];

        if (client?.role === 'user') {
            const userHistory = await this.repo.findOne({
                where: {
                    userId: client.id,
                    lawyerId: opponentId,
                },
            });
            history = userHistory?.messages || [];
        } else if (client?.role === 'lawyer') {
            const lawyerHistory = await this.repo.findOne({
                where: {
                    userId: opponentId,
                    lawyerId: client.id,
                },
            });
            history = lawyerHistory?.messages || [];
        }

        const groupedHistory = this.groupMessagesByDate(history);

        const sortedGroupedHistory = Object.fromEntries(
            Object.entries(groupedHistory).sort(([dateA], [dateB]) => {
                const parsedDateA = new Date(dateA.split('.').reverse().join('-'));
                const parsedDateB = new Date(dateB.split('.').reverse().join('-'));
                return parsedDateB.getTime() - parsedDateA.getTime();
            }),
        );

        for (const date in sortedGroupedHistory) {
            sortedGroupedHistory[date] = sortedGroupedHistory[date].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        };

        const groupHistory = Object.keys(sortedGroupedHistory).reverse().reduce((acc, key) => {
            acc[key] = sortedGroupedHistory[key];
            return acc;
        }, {} as { [key: string]: typeof sortedGroupedHistory[keyof typeof sortedGroupedHistory] });

        return groupHistory;
    }

    private groupMessagesByDate(messages: IMessages[]) {
        return messages.reduce(
            (acc, message) => {
                const date = new Date(message.data).toLocaleDateString('ru-RU');
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(message);
                return acc;
            },
            {} as Record<string, IMessages[]>,
        );
    }
}
