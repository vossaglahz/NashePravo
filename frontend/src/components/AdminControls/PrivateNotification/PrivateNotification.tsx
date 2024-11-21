import { Button,TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PrivateNotification.scss";
import { AlertComponent } from "../../UI/Alert/Alert";
import { useSendPersonalNotificationMutation } from "../../../store/api/notifications.api";
import { useTranslation } from "react-i18next";

export const AdminPrivateNotification = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [sourceLink, setSource] = useState<string | null>(null);
    const location = useLocation();
    const { userId, lawyerId, role, username, usersurname, lawyername, lawyersurname, questionId, questionText} = location.state || {};
    const [alert, setAlert] = useState<boolean | null>(null)
    const [sendPrivateNotification, { isLoading }] = useSendPersonalNotificationMutation();
    
    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await sendPrivateNotification({ topic, content, userId, lawyerId, role, questionId, sourceLink}).unwrap();
            console.log(data);
            setAlert(true);
        } catch (err) {
            setAlert(false);
        }
    };

    const getRole = (role: string) => {
        switch (role) {
            case 'lawyer':
                return { color: 'rgb(0, 144, 38)', text: t('Panel.private.lawyer') };
            case 'user':
                return { color: '#4C75A3', text: t('Panel.private.user') };
            default:
                return { color: 'black' };
        }
    };

    return (
        <form className='notificationsForm' onSubmit={handleSend}>
            <Typography variant="h4" align="center" sx={{ color: '#4C75A3', marginBottom: '10px' }}>
                {t('Panel.private.sendPersonal')}
            </Typography>
            {(() => {
                const { color, text } = getRole(role);
                return (
                    <Typography variant="h6" align="center"  sx={{color}}>
                        {t('Panel.private.recipient')}: {text} {role == "user" ? username + " " + usersurname : lawyername + " " + lawyersurname}
                    </Typography>
            );})()}
            {questionText && (
                <Typography sx={{ color: "#4C75A3" }}>
                    <span style={{ fontWeight: "bold" }}>{t('Panel.private.question')}:</span><br /> {questionText}
                </Typography>
            )}
            <TextField required={true} label={t('Panel.private.theme')} type="text" value={topic} onChange={e => setTopic(e.target.value)} fullWidth />
            <TextField required={true} 
            id="outlined-multiline-static"
            label={t('Panel.private.text')}
            multiline
            rows={4} type="text" value={content} onChange={e => setContent(e.target.value)} fullWidth />
            <TextField required={true} label="ссылка на источник (не обязательно)" type="text" value={sourceLink} onChange={e => setSource(e.target.value)} fullWidth />
            <Button className="buttonPrivateNot" type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {t('Panel.private.send')}<SendIcon/>
            </Button>
            <AlertComponent isError={alert == true} text={t('Panel.private.unSuccess')} status={"error"} />
            <AlertComponent isError={alert == false} text={t('Panel.private.success')} status={"success"} />
        </form>
    );
};
