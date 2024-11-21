import { ChangeEvent, FormEvent, useState } from "react";
import { useSendGlobalNotificationMutation } from "../../../store/api/notifications.api";
import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import 'dayjs/locale/ru'; 
import { AlertComponent } from "../../UI/Alert/Alert";
import Switcher from "../../Form/RegistrationForm/RegistrationUI/switcher";
import "./GlobalNotifications.scss";
import { Loader } from "../../UI/Loader/Loader";
import { useTranslation } from "react-i18next";

export const GlobalNotifications = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useState<string>("");
    const [sourceLink, setSource] = useState<string | null>(null);
    const [content, setContent] = useState<string>("");
    const [important, setImportant] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean | null>(null)
    const [sendGlobalNotification, { isLoading }] = useSendGlobalNotificationMutation();
    const [checkBox, setCheckBox] = useState({
        all:true,
        user:false,
        lawyer:false
    })

    if(isLoading) {
        return (
            <Loader/>
        )
    }

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const  targetAudience = checkBox.all?"all":checkBox.lawyer?"lawyer":checkBox.user?"user":""
            await sendGlobalNotification({ topic, content, important, sourceLink, targetAudience}).unwrap();
            setAlert(true);
        } catch (err) {
            setAlert(false);
        }
    };

    const handleCheckBoxChange = (name: "all" | "user" | "lawyer") => {
        setContent("")
        setTopic("")
        if (name === "all") {
            setCheckBox({
                all: true,
                user: false,
                lawyer: false,
            });
        } else {
            setCheckBox((prev) => ({
                ...prev, 
                all: false,
                [name]: !prev[name],
                user: name === "user" ? !prev.user : false,
                lawyer: name === "lawyer" ? !prev.lawyer : false,
            }));
        }
    };

    const handleAllUsersChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImportant(event.target.checked);
    };

    return (
        <form className='notificationsForm' onSubmit={handleSend}>
            <Typography variant="h4" align="center" sx={{ color: '#4C75A3', marginBottom: '10px' }}>
                {t('Panel.notifications.global')}
            </Typography>
            <div className="typeNotification">
                <div className="typeNotification__items">
                    <label className="typeNotification__label">{t('Panel.notifications.toAll')}</label>
                    <Checkbox onChange={() => handleCheckBoxChange("all")} checked={checkBox.all} />
                    
                </div>
                <div className="typeNotification__items">
                    <label className="typeNotification__label">{t('Panel.notifications.lawyers')}</label>
                    <Checkbox  onChange={() => handleCheckBoxChange("lawyer")} checked={checkBox.lawyer} />
                </div>
                <div className="typeNotification__items">
                    <label className="typeNotification__label">{t('Panel.notifications.users')}</label>
                    <Checkbox onChange={() => handleCheckBoxChange("user")}  checked={checkBox.user} />
                </div>
            </div>
            <TextField
                required
                label={t('Panel.notifications.theme')}
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                fullWidth
            />
            <TextField
                required
                label="ссылка на источник (не обязательно)"
                type="text"
                value={sourceLink}
                onChange={(e) => setSource(e.target.value)}
                fullWidth
            />
            <TextField
                required
                id="outlined-multiline-static"
                label={t('Panel.notifications.text')}
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
                label={important ? <span style={{ color: '#65C466' }}>{t('Panel.notifications.important')}</span> : <span style={{ color: '#4C75A3' }}>{t('Panel.notifications.notImportant')}</span>}
            />
            <Button className="buttonGlobNot" type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {t('Panel.notifications.send')}<SendIcon />
            </Button>
            <AlertComponent isError={alert == true} text={t('Panel.notifications.tryAgain')} status={"error"} />
            <AlertComponent isError={alert == false} text={t('Panel.notifications.trySuccess')} status={"success"} />
        </form>
    );
};
