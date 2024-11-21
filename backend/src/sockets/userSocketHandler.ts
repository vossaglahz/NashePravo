import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { ChatHistory } from '@/entities/chatHistory.entity';
import { AppDataSource } from '@/config/dataSource';
import { User } from '@/entities/user.entity';
import { Lawyer } from '@/entities/lawyers.entity';
import { IMessages } from '@/interfaces/IChatHistory.interface';
import { UserRoles } from '@/interfaces/IUser.inerface';
import { userRepo } from '@/repositories/user.repository';
import { chatRepo } from '@/repositories/chatHistory.repository';

const socketUsers: { [key: string]: { socketId:string[], id: number, role: UserRoles} } = {};

export const userSocketHandler = async (server: Server): Promise<SocketIOServer> => {
    const io = new SocketIOServer(server, {
        cors: {
            credentials: true,
            origin: 'http://localhost:5173',
        },
    });

    let filteredUsers: User[] | Lawyer[] = [];
    let filteredChatHistory;

    io.on('connection', socket => {
        console.log(`A ${socket.id} connected`);

        socket.on('register', async (id: number, role: UserRoles) => {
            const key = `${id}_${role}`;
            if (!id || !role) {
                console.error('Регистрация не удалась: отсутствует id или role', { id, role });
                return; 
            }

            if (!socketUsers[key]) {
                socketUsers[key] = { socketId: [socket.id], id, role };
            } else {
                socketUsers[key].socketId.push(socket.id);
            }
            
            let users: User[] | Lawyer[];
            const chats = await chatRepo.getAllHistory();
            
            let userIds: number[];
            if (role === 'lawyer') {
                filteredChatHistory = chats.filter(chat => chat.lawyerId === id);
                userIds = filteredChatHistory.map(chat => chat.userId);
                users = await userRepo.getAllUsers();
                filteredUsers = users.filter(user => userIds.includes(user.id));
            } else if (role === 'user') {
                filteredChatHistory = chats.filter(chat => chat.userId === id);
                userIds = filteredChatHistory.map(chat => chat.lawyerId);
                users = await userRepo.getAll();
                filteredUsers = users.filter(lawyer => userIds.includes(lawyer.id));
            }

            const result = filteredUsers.map(user => {
                const isOnline = Object.values(socketUsers).some(socketUsers => 
                  socketUsers.id === user.id && socketUsers.role === user.role && socketUsers.socketId.length > 0  
                );
                
                return {
                  id: user.id,
                  name: user.name,
                  photo: user.photo,
                  online: isOnline, 
                  role: user.role,
                };
              });

            socket.emit('lawyersList', result);

            socketUsers[key].socketId.push(socket.id);
            console.log(`User ${id} registered with socket ID ${socket.id}`);
            io.emit('userOnline', { userId: id, role });
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`);

            for (const key in socketUsers) {
                const user = socketUsers[key];
                const index = user.socketId.indexOf(socket.id);
                
                if (index !== -1) {
                  user.socketId = user.socketId.filter(id => id !== socket.id);

                  if (user.socketId.length === 0) {
                        const role = user.role;
                        const userId = user.id;
                        io.emit('userOffline', { userId, role });
                        
                        delete socketUsers[key];
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

            const recipientSocketIds = Object.values(socketUsers).filter(socketUser => 
                socketUser.id === data.opponentId 
            );
            if (recipientSocketIds.length > 0) {
                recipientSocketIds.forEach(recipientSocketId => {
                    const uniqueSocketIds = [...new Set(recipientSocketId.socketId)];


                    uniqueSocketIds.forEach(id => {
                        io.to(id).emit('response', newMessage);
                    });
                });
                console.log(`Message sent to user ${data.opponentId} via sockets: ${recipientSocketIds.map(user => user.socketId.join(', ')).join(', ')}`);
            } else {
                console.log(`User ${data.opponentId} is not connected`);
            }
        });
    });
    return io;
};
