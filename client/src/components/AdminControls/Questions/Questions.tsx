import { useState } from "react";
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import './Questions.scss';
import { useGetAllPersonalNotificationsQuery } from "../../../store/api/notifications.api";

interface PersonalNotification {
    id: number;
    topic: string;
    content: string;
    role: string;
    toAdmin: boolean;
    answered: boolean;
    userId: number;
    lawyerId: number;
}

export const Questions = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [role, setRole] = useState<string>("user");
    const [status, setStatus] = useState<string>("false");
    const [questionDate, setQuestionDate] = useState<string>("asc");

    const { data, isLoading, error } = useGetAllPersonalNotificationsQuery({
        currentPage,
        role,
        status,
        questionDate,
    });
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error || !data || !data.notifications) {
        return <div>Ошибка сервера</div>;
    }

    const allPerNot: PersonalNotification[] = data.notifications;

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleSend = async (userId: number | null, lawyerId: number | null, role: string, questionId: number, questionText: string) => {
        navigate("/adminPanel/privateNotifications", { state: { role, lawyerId, userId, questionId, questionText} });
    };

    const filteredData = allPerNot.filter((item: PersonalNotification) => {
        const isRoleMatch = role === "user" ? item.role === "user" : item.role === "lawyer";
        return isRoleMatch;
    });

    return (
        <div className="deal-history">
            <div className="formSelect">
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={(e) => { setRole(e.target.value); }}
                    >
                        <MenuItem value={"user"}>Люди</MenuItem>
                        <MenuItem value={"lawyer"}>Юристы</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu" sx={{ marginRight: 0 }}>
                    <InputLabel id="demo-simple-select-label">Новые</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={questionDate}
                        label="questionDate"
                        onChange={(e) => { setQuestionDate(e.target.value); }}
                    >
                        <MenuItem value={"asc"}>Сначала новые</MenuItem>
                        <MenuItem value={"desc"}>Сначала старые</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">Статус</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="AnswerStatus"
                        onChange={(e) => { setStatus(e.target.value); }}
                    >
                        <MenuItem value={"true"}>Отвеченные</MenuItem>
                        <MenuItem value={"false"}>Неотвеченные</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <Card key={item.id} className="deal-history-card">
                        <CardContent className="deal-card-content">
                            <Typography sx={{ fontSize: 25 }} className="deal-title">
                                {item.topic}
                            </Typography>
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {item.content}
                            </Typography>
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {item.role}
                            </Typography>
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {item.answered ? "Отвечено" : "Не отвечено"}
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button onClick={() => handleSend(item.role === "user" ? item.userId : null, item.role === "lawyer" ? item.lawyerId : null, item.role, item.id, item.content)}
                                className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                Ответить
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">Нет уведомлений<img className="img-pro" src="../src/assets/empty-box.png" alt="empty-box" /></div>
            )}
            <Pagination className="paginationDealHistory"
                size="large"
                count={Math.ceil(data.totalCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
