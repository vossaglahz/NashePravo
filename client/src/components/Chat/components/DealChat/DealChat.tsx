import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { MessageCard } from "../MessageCard/MessageCard";
import "./DealChat.scss";
import { useAppSelector } from "../../../../store/store";
import { socket } from "../../../../store/socket/socket";
import { useLocation } from "react-router-dom";
import { useGetMessageHistoryMutation } from "../../../../store/api/chat.api";

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
  const { user } = useAppSelector((state) => state.users);
  const [message, setMessage] = useState('');
  const { pathname } = useLocation();
  const chatId = pathname.split('/').pop() || '';
  const [getHistory] = useGetMessageHistoryMutation();
  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getHistory({ opponentId: chatId }).unwrap();
      setMessagesByDate(data);
    };

    if (user) {
      fetchHistory();
      socket.connect();
      socket.on('connect', () => {
        console.log(`Connected to server with socket ID: ${socket.id}`);
        socket.emit('register', user.id);
      });

      socket.on('response', (newMessage) => {
        setMessagesByDate((prev) => {
          const dateKey = new Date(newMessage.data).toLocaleDateString('ru-RU');
          return {
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newMessage],
          };
        });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
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
        {Object.entries(messagesByDate).map(([date, messages]) => {
          return(
            <div key={date}>
              <div className="chatDate">
                <h4 className="chatDate__h4">{date}</h4>
              </div>
              {messages.map((item) => {
                const date = new Date(item.data);
                const hours = date.getHours().toString().padStart(2, '0'); 
                const minutes = date.getMinutes().toString().padStart(2, '0'); 
                return(
                  <div
                  key={item.id}
                  className="OneMessageBlock"
                  style={{ justifyContent: item.name === user.name ? "flex-end" : "flex-start" }}
                >
                  <MessageCard 
                    date={`${hours}:${minutes}`} 
                    fullName={item.name === user.name ? "Вы" : item.name} 
                    message={item.text} 
                  />
                </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <form className="chatForm" onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
