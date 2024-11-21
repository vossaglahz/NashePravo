import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import { ILawyerList } from "../../interfaces/Lawyer.interface";
import { useLocation, useNavigate } from "react-router-dom";
import { useApproveDealMutation } from "../../store/api/dealHistory";
import { AlertComponent } from "../UI/Alert/Alert";
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; 
import "./DealHistory.scss";

dayjs.locale('ru');

export const DealLawyers = () => {
    const [alert, setAlert] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { dealId, responses} = location.state || {};
    const [approveDeal] = useApproveDealMutation();

    const handleApprove = async (dealId: number, lawyerId: number) => {
        try {
            await approveDeal({ dealId, lawyerId });
            setAlert(true);
            const timer = setTimeout(() => {
                navigate("/cabinet/dealHistory");
            }, 500);
            return () => clearTimeout(timer);
        } catch (error) {
            console.error("Ошибка при отклике на сделку:", error);
            setAlert(false);
        }
    };

    const handleProfile = (lawyerId: number) => {
        navigate(`/lawyer_detail/${lawyerId}`);
    }

    return (
        <div className="deal-lawyers">
            <AlertComponent isError={alert === false} text={'Ошибка, попробуйте еще раз'} status={'error'} />
            <AlertComponent isError={alert === true} text={'Вы успешно откликнулись на заказ'} status={'success'} />
            {responses && responses.length > 0 ? (
                responses.map((lawyer: ILawyerList) => (
                    <Card key={lawyer.id} className="deal-history-card">
                        <CardContent className="deal-lawyers-content">
                            <div className="profile__info-image">
                                <img
                                    src={
                                        lawyer.photo
                                            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${lawyer.photo}`
                                            : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`
                                            }
                                            alt="profile-photo"
                                    />
                            </div>
                            <Typography sx={{ fontSize: 25 }} className="deal-title">
                                {lawyer.name}  {lawyer.surname}
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button className="deal-button" variant="contained" size="small" endIcon={<PersonIcon />}
                            onClick={() => handleProfile( lawyer.id )}>
                                Профиль
                            </Button>
                            <Button className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}
                            onClick={() => handleApprove( dealId, lawyer.id )}>
                                Принять
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">Отсутствуют отклики<img src={`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="empty-box" /></div>
            )}
        </div>
    );
};
