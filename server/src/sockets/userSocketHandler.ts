import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { ChatHistory } from '@/entities/chatHistory.entity';
import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { IMessages } from '@/interfaces/IChatHistory.interface';

const socketUsers: { [key: number]: string[] } = {};

export const userSocketHandler = async (server: Server): Promise<SocketIOServer> => {
    const io = new SocketIOServer(server, {
        cors: {
            credentials: true,
            origin: 'http://localhost:5173',
        },
    });

    io.on('connection', socket => {
        console.log(`A ${socket.id} connected`);

        socket.on('register', (userId: number) => {
            if (!socketUsers[userId]) {
                socketUsers[userId] = [];
            }
            socketUsers[userId].push(socket.id);
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`);
            for (const userId in socketUsers) {
                const index = socketUsers[userId].indexOf(socket.id);
                if (index !== -1) {
                    socketUsers[userId].splice(index, 1);
                    if (socketUsers[userId].length === 0) {
                        delete socketUsers[userId];
                    }
                    break;
                }
            }
        });

        socket.on('message', async data => {
            const userRepo = AppDataSource.getRepository(User);
            const lawyerRepo = AppDataSource.getRepository(Lawyer);
            const chatHistoryRepo = AppDataSource.getRepository(ChatHistory);

            let user;
            if (data.message.role === 'user') {
                user = await userRepo.findOne({
                    where: {
                        id: data.message.somebodyID,
                    },
                });
            } else if (data.message.role === 'lawyer') {
                user = await lawyerRepo.findOne({
                    where: {
                        id: data.message.somebodyID,
                    },
                });
            }

            let existingChat;
            if (data.message.role === 'user') {
                existingChat = await chatHistoryRepo.findOne({
                    where: {
                        userId: data.message.somebodyID,
                        lawyerId: data.opponentId,
                    },
                });
            } else if (data.message.role === 'lawyer') {
                existingChat = await chatHistoryRepo.findOne({
                    where: {
                        userId: data.opponentId,
                        lawyerId: data.message.somebodyID,
                    },
                });
            }

            const newMessage: IMessages = {
                ...data.message,
                id: socket.id,
                data: new Date(),
                name: user?.name,
                photo: user?.photo,
            };

            if (existingChat) {
                existingChat.messages.push(newMessage);
                try {
                    await chatHistoryRepo.save(existingChat);
                } catch (error) {
                    console.error('Ошибка сохранения истории чата:', error);
                }
            } else {
                const chatHistory: ChatHistory = new ChatHistory();

                if (data.message.role === 'user') {
                    (chatHistory.lawyerId = data.opponentId), (chatHistory.userId = data.message.somebodyID);
                } else if (data.message.role === 'lawyer') {
                    (chatHistory.lawyerId = data.message.somebodyID), (chatHistory.userId = data.opponentId);
                }
                chatHistory.messages = [newMessage];

                try {
                    await chatHistoryRepo.save(chatHistory);
                } catch (error) {
                    console.error('Ошибка при сохранении новой истории чата:', error);
                }
            }

            const recipientSocketIds = socketUsers[data.opponentId];
            if (recipientSocketIds && recipientSocketIds.length > 0) {
                recipientSocketIds.forEach(recipientSocketId => {
                    io.to(recipientSocketId).emit('response', newMessage);
                });
                console.log(`Message sent to user ${data.opponentId} via sockets: ${recipientSocketIds.join(', ')}`);
            } else {
                console.log(`User ${data.opponentId} is not connected`);
            }
        });
    });
    return io;
};
