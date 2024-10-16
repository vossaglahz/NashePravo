import { useEffect, useState } from "react";
import { useGetDealHistoryQuery } from "../../store/api/dealHistory";
import { Box, Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Rating, Select, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { IDealHistory } from "../../interfaces/DealHistory.interface";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AlertComponent } from "../UI/Alert/Alert";
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; 
import "./DealHistory.scss";

dayjs.locale('ru');

export const DealHistory = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startPeriod, setStartPeriod] = useState<string>("");
    const [endPeriod, setEndPeriod] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [dealDate, setDealDate] = useState<string>("");

    const { data, error, isLoading } = useGetDealHistoryQuery({
        currentPage,
        startPeriod,
        endPeriod,
        type,
        price,
        status,
        dealDate 
    });

    const deals = data?.deals || [];
    const dealsCount: number = data?.totalCount || 0;

    useEffect(() => {
        if (data) {
            console.log('История сделок:', data.deals);
        }
    }, [data]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    const getStatusSet = (status: string) => {
        switch (status) {
            case 'Done':
                return { color: 'green', text: "Завершено" };
            case 'Processing':
                return { color: 'blue', text: "В процессе" };
            default:
                return { color: 'black' };
        }
    };
    
    const getTypeSet = (status: string) => {
        switch (status) {
            case 'Civil':
                return { color: '#008d42', text: "Гражданский" };
            case 'Corporate':
                return { color: '#38a0dc', text: "Корпоративный" };
            case 'Criminal':
                return { color: '#a4b600', text: "Уголовный" };
            default:
                return { color: 'black' };
        }
    };

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
        console.log(currentPage);
    };

    return (
        <div className="deal-history">
            <AlertComponent isError={error !== undefined} text={'Ошибка сервера, попробуйте перезагрузить страницу'} status={'error'} />
            <div className="formSelect">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{maxWidth: 200, marginTop: "8px", marginRight: "5px", paddingTop: 0}} components={['DatePicker']}>
                        <DatePicker
                            label="С"
                            value={startPeriod ? dayjs(startPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={(e) => {
                                if (e) {
                                    const formattedDate = e.format('YYYY-MM-DD');
                                    setStartPeriod(formattedDate);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                    </DemoContainer>
                    <DemoContainer sx={{ maxWidth: 200, marginTop: "8px", marginRight: "5px", paddingTop: 0}} components={['DatePicker']}>
                        <DatePicker
                            label="По"
                            value={endPeriod ? dayjs(endPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={(e) => {
                                if (e) {
                                    const formattedDate = e.format('YYYY-MM-DD');
                                    setEndPeriod(formattedDate);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            <FormControl className="formSelectMenu">
                <InputLabel id="demo-simple-select-label">Тип</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={(e) => {setType(e.target.value); setCurrentPage(0)}}
                    >
                    <MenuItem value={""}>Все</MenuItem>                    
                    <MenuItem value={"Criminal"}>Уголовный</MenuItem>
                    <MenuItem value={"Corporate"}>Корпоративный</MenuItem>
                    <MenuItem value={"Civil"}>Гражданский</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu">
                <InputLabel id="demo-simple-select-label">Цена</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={price}
                        label="Price"
                        onChange={(e) => {setPrice(e.target.value); setCurrentPage(0); setDealDate("")}}
                    >
                    <MenuItem value={""}>Все</MenuItem>    
                    <MenuItem value={"HIGHEST"}>Сначала высокие</MenuItem>
                    <MenuItem value={"LOWEST"}>Сначала низкие</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu">
                <InputLabel id="demo-simple-select-label">Статус</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={(e) => {setStatus(e.target.value); setCurrentPage(0)}}
                    >
                    <MenuItem value={""}>Все</MenuItem>    
                    <MenuItem value={"Processing"}>В процессе</MenuItem>
                    <MenuItem value={"Done"}>Завершено</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu" sx={{marginRight: 0}}>
                <InputLabel id="demo-simple-select-label">Новые</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={dealDate}
                        label="DealDate"
                        onChange={(e) => {setDealDate(e.target.value); setCurrentPage(0); setPrice("")}}
                    >
                    <MenuItem value={"NEWEST"}>Сначала новые</MenuItem>
                    <MenuItem value={"OLDEST"}>Сначала старые</MenuItem>
                    </Select>
            </FormControl>
            </div>
            {deals.length > 0 ? (
                deals.map((deal: IDealHistory) => (
                    <Card key={deal.id} className="deal-history-card">
                        <CardContent className="deal-card-content">
                            <Box>
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {deal.title}
                                </Typography>
                                {
                                    deal.status==="Done"?deal.rating!==null?
                                    <Rating name="half-rating-read" size="large" value={deal.rating.assessment} precision={0.5} readOnly />:
                                    <Rating name="half-rating-read" size="large" value={0} precision={0.5} readOnly /> :""
                                    
                                }
                            </Box>
                            {(() => {
                                const { color, text } = getTypeSet(deal.type);
                                return (
                                    <Typography sx={{ color, fontSize: 16 }} key={deal.id + deal.type}>
                                        {text}
                                    </Typography>
                                );
                            })()}
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {deal.description.length > 100 ? `${deal.description.slice(0, 100)}...` : deal.description}
                            </Typography>
                            {(() => {
                                const { color, text } = getStatusSet(deal.status);
                                return (
                                    <Typography sx={{ color, fontSize: 14 }} key={deal.id + deal.status}>
                                        {text}
                                    </Typography>
                                );
                            })()}
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {dayjs(deal.dealDate).format('DD MMMM YYYY, HH:mm')}
                            </Typography>
                            <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                                {deal.price}₸
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                Перейти в чат
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">Отсутствует история заказов <img src="../src/assets/empty-box.png" alt="empty-box" /></div>
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
