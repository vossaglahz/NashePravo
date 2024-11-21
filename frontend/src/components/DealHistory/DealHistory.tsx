import { useEffect, useState } from 'react';
import { useCreateDealMutation, useGetDealHistoryQuery, useCloseDealMutation } from '../../store/api/dealHistory';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Rating,
    Select,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { IDealHistory } from '../../interfaces/DealHistory.interface';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AlertComponent } from '../UI/Alert/Alert';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useAppSelector } from '../../store/store';
import { CreatingDealModal } from './CreatingDealModal/CreatingDealModal';
import { Loader } from '../UI/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import './DealHistory.scss';
import { usePostRatingMutation } from '../../store/api/rating.api';
import { RatingDeal } from './RatingDeal/RatingDeal';
import { useTranslation } from 'react-i18next';

dayjs.locale('ru');

export const DealHistory = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startPeriod, setStartPeriod] = useState<string>('');
    const [endPeriod, setEndPeriod] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [dealDate, setDealDate] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [dealId, setDealId] = useState<number>(0);
    const [openRating, setRatingOpen] = useState(false);
    const { user } = useAppSelector(state => state.users);
    const navigate = useNavigate();

    const [createDeal, { isError: createDealError, isSuccess: createDealSuccess }] = useCreateDealMutation();
    const [rating] = usePostRatingMutation();
    const [closeDeal, { isSuccess: closeSuccess }] = useCloseDealMutation();
    const { data, error, isLoading, refetch } = useGetDealHistoryQuery({
        currentPage,
        startPeriod,
        endPeriod,
        type,
        price,
        status,
        dealDate,
    });
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

    const deals = data?.deals || [];
    const dealsCount: number = data?.totalCount || 0;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (data) {
            console.log('История сделок:', data.deals);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [location.pathname, createDealSuccess]);

    if (isLoading) {
        return <Loader />;
    }

    const handleList = async (dealId: number, responses: []) => {
        navigate('/dealList/lawyers', { state: { dealId, responses } });
    };

    const handleCloseDeal = async (dealId: number) => {
        await closeDeal(dealId);
        refetch();
    };

    const handleGoToChat = async (opId: number) => {
        navigate(`/chat/${opId}`);
    };

    const getStatusSet = (status: string) => {
        switch (status) {
            case 'Create':
                return { color: '#aa9201', text: 'Создано' };
            case 'Done':
                return { color: 'green', text: 'Завершено' };
            case 'Processing':
                return { color: 'blue', text: 'В процессе' };
            default:
                return { color: 'black' };
        }
    };

    const getTypeSet = (status: string) => {
        switch (status) {
            case 'Civil':
                return { color: '#008d42', text: 'Гражданский' };
            case 'Corporate':
                return { color: '#38a0dc', text: 'Корпоративный' };
            case 'Criminal':
                return { color: '#a4b600', text: 'Уголовный' };
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

    const toggleOpen = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const toggleRatingOpen = (dealId: number) => {
        setRatingOpen(prevOpen => !prevOpen);
        setDealId(dealId);
    };

    const toggleRatingClose = () => {
        setRatingOpen(false);
    };

    return (
        <div className="deal-history">
            <AlertComponent isError={error !== undefined || createDealError} text={t('Aside.deals.createDealError')} status={'error'} />
            <AlertComponent isError={createDealSuccess} text={t('Aside.deals.createDealSuccess')} status={'success'} />
            <AlertComponent isError={closeSuccess} text={t('Aside.deals.closeSuccess')} status={'success'} />
            <Modal open={open} onClose={toggleOpen}>
                <Box>
                    <CreatingDealModal createDeal={createDeal} closeModal={toggleOpen} />
                </Box>
            </Modal>
            <Modal style={{ height: '70%' }} open={openRating} onClose={toggleRatingOpen}>
                <Box>
                    <RatingDeal rating={rating} closeModal={toggleRatingClose} dealId={dealId} />
                </Box>
            </Modal>
            {user.role === 'user' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button className="open-deal-button" variant="contained" onClick={toggleOpen}>
                        {t('Aside.deals.createNewDeal')}
                    </Button>
                </div>
            )}
            <div className="formSelect">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{ maxWidth: 200, marginTop: '8px', marginRight: '5px', paddingTop: 0 }} components={['DatePicker']}>
                        <DatePicker
                            label={t('Aside.deals.from')}
                            value={startPeriod ? dayjs(startPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={e => {
                                if (e) {
                                    const formattedDate = e.format('YYYY-MM-DD');
                                    setStartPeriod(formattedDate);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                    </DemoContainer>
                    <DemoContainer sx={{ maxWidth: 200, marginTop: '8px', marginRight: '5px', paddingTop: 0 }} components={['DatePicker']}>
                        <DatePicker
                            label={t('Aside.deals.to')}
                            value={endPeriod ? dayjs(endPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={e => {
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
                    <InputLabel id="demo-simple-select-label">{t('Aside.deals.type')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={e => {
                            setType(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('Aside.deals.typeAll')}</MenuItem>
                        <MenuItem value={'Criminal'}>{t('Aside.deals.criminal')}</MenuItem>
                        <MenuItem value={'Corporate'}>{t('Aside.deals.corporate')}</MenuItem>
                        <MenuItem value={'Civil'}>{t('Aside.deals.civil')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Aside.deals.price')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={price}
                        label="Price"
                        onChange={e => {
                            setPrice(e.target.value);
                            setCurrentPage(0);
                            setDealDate('');
                        }}
                    >
                        <MenuItem value={''}>{t('Aside.deals.priceAll')}</MenuItem>
                        <MenuItem value={'HIGHEST'}>{t('Aside.deals.highest')}</MenuItem>
                        <MenuItem value={'LOWEST'}>{t('Aside.deals.lowest')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Aside.deals.status')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={e => {
                            setStatus(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('Aside.deals.statusAll')}</MenuItem>
                        {user.role === 'user' && <MenuItem value={'Create'}>{t('Aside.deals.сreated')}</MenuItem>}
                        <MenuItem value={'Processing'}>{t('Aside.deals.processing')}</MenuItem>
                        <MenuItem value={'Done'}>{t('Aside.deals.done')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu" sx={{ marginRight: 0 }}>
                    <InputLabel id="demo-simple-select-label">{t('Aside.deals.newDeals')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={dealDate}
                        label="DealDate"
                        onChange={e => {
                            setDealDate(e.target.value);
                            setCurrentPage(0);
                            setPrice('');
                        }}
                    >
                        <MenuItem value={'NEWEST'}>{t('Aside.deals.newest')}</MenuItem>
                        <MenuItem value={'OLDEST'}>{t('Aside.deals.oldest')}</MenuItem>
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
                                {deal.status === 'Done' ? (
                                    deal.rating !== null ? (
                                        <Rating name="half-rating-read" size="large" value={deal.rating.assessment} precision={0.5} readOnly />
                                    ) : (
                                        <Rating name="half-rating-read" size="large" value={0} precision={0.5} readOnly />
                                    )
                                ) : (
                                    ''
                                )}
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
                            {deal.dealDate && (
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {dayjs(deal.dealDate).format('DD MMMM YYYY, HH:mm')}
                                </Typography>
                            )}
                            <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{deal.price}₸</Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            {user.role === 'user' && deal.status === 'Create' ? (
                                <Button
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<PeopleAltIcon />}
                                    onClick={() => handleList(deal.id, deal.responses)}
                                >
                                    {t('Aside.deals.responces')}
                                </Button>
                            ) : (
                                <>
                                    {user.role === 'user' ? (
                                        <Button
                                            className="deal-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleGoToChat(deal.lawyerId)}
                                        >
                                            {t('Aside.deals.goToChat')}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="deal-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleGoToChat(deal.userId)}
                                        >
                                            {t('Aside.deals.goToChat')}
                                        </Button>
                                    )}
                                    {user.role === 'user' && deal.userClose === false && deal.lawyerClose === false && deal.status !== 'Done' ? (
                                        <Button
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDeal')}
                                        </Button>
                                    ) : user.role === 'user' && deal.userClose === true && deal.lawyerClose === false ? (
                                        <Button
                                            disabled={true}
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDealWait')}
                                        </Button>
                                    ) : user.role === 'user' && deal.userClose === false && deal.lawyerClose === true ? (
                                        <Button
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDealResp')}
                                        </Button>
                                    ) : user.role === 'user' && deal.status == 'Done' && deal.rating == null ? (
                                        <Button
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => toggleRatingOpen(deal.id)}
                                        >
                                            {t('Aside.deals.feedback')}
                                        </Button>
                                    ) : null}
                                    {user.role === 'lawyer' && deal.userClose === false && deal.lawyerClose === false && deal.status !== 'Done' ? (
                                        <Button
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDeal')}
                                        </Button>
                                    ) : user.role === 'lawyer' && deal.userClose === false && deal.lawyerClose === true ? (
                                        <Button
                                            disabled={true}
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDealWait')}
                                        </Button>
                                    ) : user.role === 'lawyer' && deal.userClose === true && deal.lawyerClose === false ? (
                                        <Button
                                            className="close-button"
                                            variant="contained"
                                            size="small"
                                            endIcon={<SendIcon />}
                                            onClick={() => handleCloseDeal(deal.id)}
                                        >
                                            {t('Aside.deals.closeDealResp')}
                                        </Button>
                                    ) : (
                                        <p></p>
                                    )}
                                </>
                            )}
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">
                    {t('Aside.deals.noOrderHistory')} <img src={`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="empty-box" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
                size={isMobile ? 'small' : 'large'}
                count={Math.ceil(dealsCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
