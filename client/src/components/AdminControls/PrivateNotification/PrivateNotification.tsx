import { Button,TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PrivateNotification.scss";
import { AlertComponent } from "../../UI/Alert/Alert";
import { useSendPersonalNotificationMutation } from "../../../store/api/notifications.api";

export const AdminPrivateNotification = () => {
    const [content, setContent] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const location = useLocation();
    const { userId, lawyerId, role, name, surname, questionId, questionText} = location.state || {};
    const [alert, setAlert] = useState<boolean | null>(null)
    const [sendPrivateNotification, { isLoading }] = useSendPersonalNotificationMutation();
    
    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await sendPrivateNotification({ topic, content, userId, lawyerId, role, questionId}).unwrap();
            console.log(data);
            setAlert(true);
        } catch (err) {
            setAlert(false);
        }
    };

    const getRole = (role: string) => {
        switch (role) {
            case 'lawyer':
                return { color: 'rgb(0, 144, 38)', text: "Юрист" };
            case 'user':
                return { color: '#4C75A3', text: "Человек" };
            default:
                return { color: 'black' };
        }
    };

    return (
        <form className='notificationsForm' onSubmit={handleSend}>
            <Typography variant="h4" align="center" sx={{ color: '#4C75A3', marginBottom: '10px' }}>
                Отправить личное уведомление
            </Typography>
            {(() => {
                const { color, text } = getRole(role);
                return (
                    <Typography variant="h6" align="center"  sx={{color}}>
                        Получатель: {text} {surname} {name}
                    </Typography>
            );})()}
            {questionText && (
                <Typography sx={{ color: "#4C75A3" }}>
                    <span style={{ fontWeight: "bold" }}>Вопрос:</span><br /> {questionText}
                </Typography>
            )}
            <TextField required={true} label={"Тема"} type="text" value={topic} onChange={e => setTopic(e.target.value)} fullWidth />
            <TextField required={true} 
            id="outlined-multiline-static"
            label="Текст"
            multiline
            rows={4} type="text" value={content} onChange={e => setContent(e.target.value)} fullWidth />
            <Button className="buttonPrivateNot" type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                Отправить<SendIcon/>
            </Button>
            <AlertComponent isError={alert == true} text={"Уведомление не отправилось, попробуйте еще раз"} status={"error"} />
            <AlertComponent isError={alert == false} text={"Уведомление успешно отправилось"} status={"success"} />
        </form>
    );
};
