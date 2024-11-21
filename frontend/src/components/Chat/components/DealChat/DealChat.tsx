import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetMessageHistoryMutation } from '../../../../store/api/chat.api';
import { socket } from '../../../../store/socket/socket';
import { useAppSelector } from '../../../../store/store';
import { MessageCard } from '../MessageCard/MessageCard';
import { IoSend } from 'react-icons/io5';
import './DealChat.scss';

interface IMessage {
    id: string;
    data: string;
    name: string;
    role: string;
    text: string;
    photo: string | null;
    somebodyID: number;
}

interface IMessageHistory {
    [date: string]: IMessage[];
}

export const DealChat = () => {
    const [messagesByDate, setMessagesByDate] = useState<IMessageHistory>({});
    const [isClosed, setIsClosed] = useState<boolean>();
    const { user } = useAppSelector(state => state.users);
    const [message, setMessage] = useState('');
    const { pathname } = useLocation();
    const chatId = pathname.split('/').pop() || '';
    const [getHistory] = useGetMessageHistoryMutation();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const fetchHistory = async () => {
        const response = await getHistory({ opponentId: chatId }).unwrap();
        if (response.groupHistory) {
            setMessagesByDate(response.groupHistory);
            setIsClosed(response.isClose)
        }
    };

    useEffect(() => {
        fetchHistory();

        if (user) {
            socket.on('response', (newMessage: IMessage) => {
                const dateKey = new Date(newMessage.data).toLocaleDateString('ru-RU');
                setMessagesByDate(prev => ({
                    ...prev,
                    [dateKey]: [...(prev[dateKey] || []), newMessage],
                }));
            });

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected`);
            });

            return () => {
                socket.off('response');
                socket.disconnect();
            };
        }
    }, [user, chatId, getHistory]);

    useEffect(() => {
        scrollToBottom();
    }, [messagesByDate]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && user) {
            socket.emit('message', {
                message: {
                    role: user.role,
                    somebodyID: user.id,
                    text: message,
                },
                opponentId: Number(chatId),
            });
            setMessage('');
        }
    };

    return (
        <div className="message-form">
            <div className="messageHistory">
                {Object.entries(messagesByDate).map(([date, messages]) => (
                    <div key={date}>
                        <div className="chatDate">
                            <h4 className="chatDate__h4">{date}</h4>
                        </div>
                        {messages.map((item, index) => {
                            const messageDate = new Date(item.data);
                            const hours = messageDate.getHours().toString().padStart(2, '0');
                            const minutes = messageDate.getMinutes().toString().padStart(2, '0');
                            return (
                                <div
                                    key={index}
                                    className="OneMessageBlock"
                                    style={{ justifyContent: item.name === user.name ? 'flex-end' : 'flex-start' }}
                                >
                                    <MessageCard
                                        date={`${hours}:${minutes}`}
                                        fullName={item.name === user.name ? 'Вы' : item.name}
                                        message={item.text}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {}
            <form className="chatForm" onSubmit={handleSubmit}>
                <div className="input-container">
                    <textarea
                        value={message}
                        disabled = {isClosed}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Введите сообщение..."
                        rows={4}
                        style={{ resize: 'none' }}
                    />
                </div>
                <button className="chatForm__button" type="submit">
                    <IoSend size={25} color="black" />
                </button>
            </form>
        </div>
    );
};
