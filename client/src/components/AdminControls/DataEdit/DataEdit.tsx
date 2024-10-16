import { useState } from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Pagination, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import "./DataEdit.scss";

export const DataEdit = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const BASE_URL = "http://localhost:8000/uploads/"
    const dealsCount: number = data.length || 0;

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    return (
        <div className="deal-history">
            {data ? (
                    data.map((user) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 18, color: "green" }} className="deal-title">
                                   Имя: {user.data.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: "green" }} className="deal-title">
                                   Отчество: {user.data.patronymicName}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: "green" }} className="deal-title">
                                   Фамилия: {user.data.surname}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                   Раздел законодательства: {user.data.lawyerType}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                   Тип юр.лица: {user.data.caseCategories}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: "green" }} className="deal-title">
                                   Фото:
                                   <CardMedia 
                                   component="img" 
                                   width="100" 
                                   height="100" 
                                   image={`${BASE_URL}${user.data.photo}`} 
                                   sx={{borderRadius: '6px',
                                    width: { xs: '100%', sm: 100 }}} 
                                    alt={user.data.photo} 
                                />
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                    Одобрить
                                </Button>
                                <Button className="reject-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                    Отклонить
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) 
            : (
                <div className="empty-show">Нет пользователей для рассмотрения<img src="../src/assets/empty-box.png" alt="empty-box" /></div>
            )}
            <Pagination className="paginationDealHistory"
                size="large"
                count={Math.ceil(dealsCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};

const data = [
            {
                id: 1,
                type: "edit",
                data: {"name":"Юрий","surname":"Смирнов","patronymicName":"Павлович","lawyerType":"АО","caseCategories":"[\"\",\"Civil\"]","photo":"93bc9a50-88bb-4a52-88a2-649284487b16.jpg"},
                isApproved: false,
                createdAt: "2024-10-09 16:06:09.224338",
                approvedAt: null,
                lawyerId: "2"
            },
            {
                id: 2,
                type: "edit",
                data:{"name":"Юрий","surname":"Смирнов","patronymicName":"Павлович","lawyerType":"АО","caseCategories":"[\"\",\"Civil\"]","photo":"93bc9a50-88bb-4a52-88a2-649284487b16.jpg"},
                isApproved: false,
                createdAt: "2024-10-09 16:06:09.224338",
                approvedAt: null,
                lawyerId: "1"
            },
            {
                id: 3,
                type: "edit",
                data: {"name":"Юрий","surname":"Смирнов","patronymicName":"Павлович","lawyerType":"АО","caseCategories":"[\"\",\"Civil\"]","photo":"93bc9a50-88bb-4a52-88a2-649284487b16.jpg"},
                isApproved: false,
                createdAt: "2024-10-09 16:06:09.224338",
                approvedAt: null,
                lawyerId: "2"
            },
            {
                id: 4,
                type: "edit",
                data: {"name":"Юрий","surname":"Смирнов","patronymicName":"Павлович","lawyerType":"АО","caseCategories":"[\"\",\"Civil\"]","photo":"93bc9a50-88bb-4a52-88a2-649284487b16.jpg"},
                isApproved: false,
                createdAt: "2024-10-09 16:06:09.224338",
                approvedAt: null,
                lawyerId: "1"
            },
        ]
