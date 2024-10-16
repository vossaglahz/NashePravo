import { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Pagination, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './DocsConfirmations.scss';

export const DocsConfirmations = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const BASE_URL = 'http://localhost:8000/uploads/';
    const dealsCount: number = data.length || 0;

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const onApproveHandler = () => {
        console.log(1);
    };

    const onRejectHandler = () => {
        console.log(2);
    };

    return (
        <div className="deal-history">
            {data.length > 0 ? (
                data.map((user, index) => (
                    <Card key={index} className="deal-history-card">
                        <CardContent className="deal-card-content">
                            <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                Пользователь: {user.lawyerId}
                            </Typography>
                            <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                Фото:
                            </Typography>
                            <Typography style={{ display: 'flex', flexWrap: 'wrap' }} gap={5}>
                                {user.image.map((imgSrc, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        width="200"
                                        height="200"
                                        image={`${BASE_URL}${imgSrc}`}
                                        sx={{ borderRadius: '6px', width: { xs: '100%', sm: 200 } }}
                                        alt={`Image${index + 1}`}
                                    />
                                ))}
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button onClick={onApproveHandler} className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                Одобрить
                            </Button>
                            <Button onClick={onRejectHandler} className="reject-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                Отклонить
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">
                    Нет пользователей для рассмотрения
                    <img src="../src/assets/empty-box.png" alt="empty-box" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
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
        lawyerId: '2',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', '9a6096c5-933c-4dda-8bfa-d60a45ab67cf.jpg'],
        publish: false,
    },
    {
        id: 1,
        lawyerId: '3',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', '9a6096c5-933c-4dda-8bfa-d60a45ab67cf.jpg'],
        publish: false,
    },

    {
        id: 1,
        lawyerId: '1',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', '9a6096c5-933c-4dda-8bfa-d60a45ab67cf.jpg'],
        publish: false,
    },
    {
        id: 1,
        lawyerId: '2',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', 'ac31ced0-762b-4db2-a5d3-3833f15206a8.png'],
        publish: false,
    },
    {
        id: 1,
        lawyerId: '2',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', 'ac31ced0-762b-4db2-a5d3-3833f15206a8.png'],
        publish: false,
    },
    {
        id: 1,
        lawyerId: '2',
        image: ['78433c70-3173-420f-83d0-d08263fe8f4c.jpg', 'ac31ced0-762b-4db2-a5d3-3833f15206a8.png'],
        publish: false,
    },
];
