import { ChangeEvent, FormEvent, useState } from "react";
import { useSendGlobalNotificationMutation } from "../../../store/api/notifications.api";
import { Button, FormControlLabel, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import 'dayjs/locale/ru'; 
import { AlertComponent } from "../../UI/Alert/Alert";
import Switcher from "../../Form/RegistrationForm/RegistrationUI/switcher";
import "./GlobalNotifications.scss";

export const GlobalNotifications = () => {
    const [topic, setTopic] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [important, setImportant] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean | null>(null)
    const [sendGlobalNotification, { isLoading }] = useSendGlobalNotificationMutation();

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await sendGlobalNotification({ topic, content, important }).unwrap();
            setAlert(true);
        } catch (err) {
            setAlert(false);
        }
    };

    const handleAllUsersChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImportant(event.target.checked);
    };

    return (
        <form className='notificationsForm' onSubmit={handleSend}>
            <Typography variant="h4" align="center" sx={{ color: '#4C75A3', marginBottom: '10px' }}>
                Глобальное уведомление
            </Typography>
            <TextField
                required
                label="Тема"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                fullWidth
            />
            <TextField
                required
                id="outlined-multiline-static"
                label="Текст"
                multiline
                rows={4}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
            />
            <FormControlLabel
                sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '0 auto' }}
                control={<Switcher checked={important} onChange={handleAllUsersChange} />}
                label={important ? <span style={{ color: '#65C466' }}>Важно</span> : <span style={{ color: '#4C75A3' }}>Неважно</span>}
            />
            <Button className="buttonGlobNot" type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                Отправить всем<SendIcon />
            </Button>
            <AlertComponent isError={alert == true} text={"Уведомление не отправилось, попробуйте еще раз"} status={"error"} />
            <AlertComponent isError={alert == false} text={"Уведомление успешно отправилось"} status={"success"} />
        </form>
    );
};
