import '../Notifications.scss';
import { INotify } from '../../../interfaces/Notifications.interface';
import { useGetAllGeneralNotificationsQuery } from '../../../store/api/notifications.api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { AlertComponent } from '../../UI/Alert/Alert';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';

export const GeneralNotifications = () => {
    const { data, isLoading, error} = useGetAllGeneralNotificationsQuery();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const allData = data || [];
    
    const getPaginatedNotifications = (data: INotify[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const notifications = getPaginatedNotifications(allData, currentPage);

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <AlertComponent isError={error !== undefined} text={'Ошибка сервера, попробуйте перезагрузить страницу'} status={'error'} />
            <div className="notification_cards">
                {notifications.length > 0 ? notifications.map((notify: INotify) => (
                    <Card variant="outlined" className="notify_card" key={notify.id}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                • {notify.topic} •
                            </Typography>
                            <Typography style={{marginTop: '15px'}} variant="body2">
                                {notify.content}  
                            </Typography>
                        </CardContent>
                        <CardActions style={{float: 'right'}}>
                            <Button size="small">подробнее</Button>
                        </CardActions>
                    </Card>
                )).reverse() : <div className="empty-show">Отсутствует публичные уведомления <img src="../src/assets/empty-box.png" alt="empty-box" /></div>}
            </div>
            <Pagination className="paginationDealHistory"
                size="large"
                count={Math.ceil(allData.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </>
    );
};
