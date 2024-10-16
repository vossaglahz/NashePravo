import { FormEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import { useSendPersonalNotificationMutation } from '../../../store/api/notifications.api';
import './FeedBackForm.scss';
import { useAppSelector } from '../../../store/store';

export const FeedBackForm = () => {
  const { user, lawyer } = useAppSelector(state => state.users);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<boolean | null>(null)
  const [topic, setTopic] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [sendPersonalNotification, {isLoading}] = useSendPersonalNotificationMutation();
  
  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(user.id || lawyer.id) {
      const data = await sendPersonalNotification({topic, content}).unwrap();
      console.log(data);
      setAlert(false)
    } else {
      setAlert(true)
      setTimeout(() => {
        navigate("/registration");
      }, 1500)
    }
  };

  return (
    <form onSubmit={handleSend} className='FeedBackFormWrapper'>
      <h1>{t('Authorization.text.admin')}</h1>
      <TextField
        name="topic"
        className="InputFeedback"
        label={t('Authorization.theme')}
        variant="filled"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        aria-label={t('Authorization.theme')}
      />
      <TextField
        rows={3}
        className="InputFeedback"
        multiline
        name="content"
        variant="filled"
        label={t('Authorization.question')}
        value={content}
        onChange={e => setContent(e.target.value)}
        aria-label={t('Authorization.question')}
      />
      <Button type="submit" className="feedBackSendButton" variant="contained" disabled={isLoading}>
        {t('Authorization.button.send')}
      </Button>
      <AlertComponent isError={alert == true} text={"Чтобы написать админу, зарегистрируйтесь пожалуйста"} status={"error"} />
      <AlertComponent isError={alert == false} text={"Уведомление успешно отправилось"} status={"success"} />
    </form>
  );
};
