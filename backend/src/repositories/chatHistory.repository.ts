import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { Repository } from 'typeorm';
import { ChatHistory } from '@/entities/chatHistory.entity';
import { IMessages } from '@/interfaces/IChatHistory.interface';
import { dealHistoryRepo } from './dealHistory.repository';

export class ChatHistoryRepository {
    private repo: Repository<ChatHistory>;
    private userRepo: Repository<User>;
    private lawyerRepo: Repository<Lawyer>;

    constructor() {
        this.repo = AppDataSource.getRepository(ChatHistory);
        this.userRepo = AppDataSource.getRepository(User);
        this.lawyerRepo = AppDataSource.getRepository(Lawyer);
    }

    async getAllHistory() {
        return await this.repo.find();
    }

    async getChatHistory(refreshToken: string, opponentId: number) {
        let client = null;
        client = await this.userRepo.findOne({ where: { refreshToken } });
        
        if (!client) {
            client = await this.lawyerRepo.findOne({ where: { refreshToken } });
        }

        let history: IMessages[] = [];
        let isClose: boolean | undefined;
        await dealHistoryRepo.find({where: {
            userId: client?.id,
            lawyerId: opponentId,
            status: "Processing"
        },})
        if (client?.role === 'user') {
            const userHistory = await this.repo.findOne({
                where: {
                    userId: client.id,
                    lawyerId: opponentId,
                },
            });
            history = userHistory?.messages || [];
            isClose = userHistory?.isClose;
        } else if (client?.role === 'lawyer') {
            const lawyerHistory = await this.repo.findOne({
                where: {
                    userId: opponentId,
                    lawyerId: client.id,
                },
            });
            history = lawyerHistory?.messages || [];
            isClose = lawyerHistory?.isClose;
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
        const closed = {
            isClose,
            groupHistory
        }
        return closed;
    }

    async creatingChat(lawyerId: number, userId: number) {
        try {
            const chatData = await this.repo.findOne({ where: { lawyerId, userId } })
            if(!chatData) {
                const chatHistory = new ChatHistory();
                chatHistory.userId = userId;
                chatHistory.lawyerId = lawyerId;
                chatHistory.messages = [];
                chatHistory.isClose = false;
                return await this.repo.save(chatHistory);
            }else {
                chatData.isClose = false;
                return await this.repo.save(chatData);
            }
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания чата');
        }
    }

    async closeChat(lawyerId: number, userId: number) {
        try {
            const chatData = await this.repo.findOne({ where: { lawyerId, userId } })
            if(chatData) {
                chatData.isClose = true;
                return await this.repo.save(chatData);
            }else {
                return {message:"Данный чат не найден!", status:500}
            }
            return chatData;
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания чата');
        }
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

export const chatRepo = new ChatHistoryRepository();