import ModalDealComponent from '../UI/Modal/ModalDeal';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { IDealModal } from '../../interfaces/DealList.interface';
import { useEffect, useState } from 'react';
import { useResponseLawyerMutation } from '../../store/api/dealHistory';
import { AlertComponent } from '../UI/Alert/Alert';
import './DealList.scss';

export const DealOne = ({
    id,
    title,
    type,
    description,
    username,
    usersurname,
    city,
    price,
    clicked,
    onResponseSuccess,
}: IDealModal & { onResponseSuccess: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alert, setAlert] = useState<boolean | null>(null);
    const [reponseLawyer] = useResponseLawyerMutation();

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const onResponse = async (id: number) => {
        try {
            await reponseLawyer({ id });
            onResponseSuccess();
            setAlert(true);
        } catch (error) {
            console.error('Ошибка при отклике на сделку:', error);
            setAlert(false);
        }
    };

    useEffect(() => {
        if (alert === true) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const getTypeSet = (status: string) => {
        switch (status) {
            case 'Civil':
                return { color: '#008d42', text: 'Гражданский' };
            case 'Corporate':
                return { color: '#38a0dc', text: 'Корпоративный' };
            case 'Criminal':
                return { color: '#a4b600', text: 'Уголовный' };
            default:
                return { color: 'black', text: '' };
        }
    };

    return (
        <Card key={id} className="deal-history-card">
            <AlertComponent isError={alert === false} text={'Ошибка, попробуйте еще раз'} status={'error'} />
            <AlertComponent isError={alert === true} text={'Вы успешно откликнулись на заказ'} status={'success'} />
            <CardContent className="deal-card-content">
                <Box>
                    <Typography sx={{ fontSize: 25 }} className="deal-title">
                        {title}
                    </Typography>
                </Box>
                {(() => {
                    const { color, text } = getTypeSet(type);
                    return (
                        <Typography sx={{ color, fontSize: 16 }} key={id + type}>
                            {text}
                        </Typography>
                    );
                })()}
                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {description}
                </Typography>
                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {username + ' ' + usersurname}
                </Typography>
                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {city}
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{price}₸</Typography>
            </CardContent>
            <CardActions className="deal-card-actions">
                <Button className="deal-button" variant="contained" size="small" endIcon={<SendIcon />} onClick={handleOpen}>
                    Посмотреть
                </Button>
                <ModalDealComponent
                    title={title}
                    type={type}
                    description={description}
                    username={username}
                    usersurname={usersurname}
                    city={city}
                    price={price}
                    open={isModalOpen}
                    onClose={handleClose}
                />
                {clicked === false ? (
                    <Button className="deal-button" variant="contained" size="small" endIcon={<SendIcon />} onClick={() => onResponse(id)}>
                        Откликнуться
                    </Button>
                ) : (
                    <Button
                        disabled={true}
                        className="deal-button"
                        variant="contained"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={() => onResponse(id)}
                    >
                        Вы отклинулись
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};
