import { INotifications } from "../../../interfaces/Notifications.interface";
import { useGetAllPersonalNotificationsQuery } from "../../../store/api/notifications.api";
import { useAppSelector } from "../../../store/store";
import { AlertComponent } from "../../UI/Alert/Alert";
import '../Notifications.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useState } from "react";
import Pagination from "@mui/material/Pagination";

export const PrivateNotifications = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {user} = useAppSelector(state => state.users);
    const { data, error, isLoading } = useGetAllPersonalNotificationsQuery({
        role: user.role || 'user',
        questionDate: 'asc',
        status: 'true',
        currentPage,
        limit: 5,
      });
      console.log(data);

      if (isLoading) return <div>Loading...</div>

      const privateNotifications = data?.notifications.filter((people: INotifications) => people.userId === user.id) || [];
      const dealsCount: number = data?.totalCount || 0;

      const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
        console.log(currentPage);
    };

      return <>
      <AlertComponent isError={error !== undefined} text={'Ошибка сервера, попробуйте перезагрузить страницу'} status={'error'} />
      <div className="notification_cards">
                {privateNotifications[0] ? privateNotifications.map((notify: INotifications) => (
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
                )) : <div className="empty-show">Отсутствует приватные уведомления <img src="../src/assets/empty-box.png" alt="empty-box" /></div>}
            </div>
            <Pagination className="paginationDealHistory"
                size="large"
                count={Math.ceil(dealsCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
      </>
}