import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Pagination, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useApproveDocMutation, useGetAllRequestsQuery, useRejectDocMutation } from '../../../store/api/admin.api';
import './DataEdit.scss';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';

type TEdit = {
    approvedAt: null | Date;
    createdAt: string;
    data: {
        caseCategories: string[];
        lawyerType: string;
        name: string;
        patronymicName: string;
        photo: string;
        surname: string;
    };
    id: number;
    isApproved: boolean;
    type: string;
};

export const DataEdit = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;

    const [approveDoc] = useApproveDocMutation();
    const [rejectDoc] = useRejectDocMutation();
    const { data, isLoading, refetch } = useGetAllRequestsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [requests, setRequests] = useState<TEdit[]>([]);

    useEffect(() => {
        if (data ) {
            setRequests(data);
            console.log(1);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [refetch]);


    if(isLoading) { 
        return (<Loader/>)
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const onApproveHandler = async (id: number) => {
        await approveDoc({ id });
        refetch()
    };

    const onRejectHandler = async (id: number) => {
        await rejectDoc({ id });
        refetch()
    };

    return (
        <div className="deal-history">
            {Array.isArray(requests) && requests.length > 0 ? (
                <>
                    {requests.map(user => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.name')}: {user.data.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.surname')}: {user.data.surname}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.patrName')}: {user.data.patronymicName ? user.data.patronymicName : 'Не заполнено'}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {t('Panel.data.section')}:
                                    {user.data.lawyerType.length > 0 && Array.isArray(user.data.lawyerType)
                                        ? user.data.lawyerType.map(item => <p>{item}</p>)
                                        : t('Panel.data.noData')}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {t('Panel.data.lawyerType')}:{' '}
                                    {user.data.caseCategories.length > 0 && Array.isArray(user.data.caseCategories)
                                        ? user.data.caseCategories.map(item => <p>{item}</p>)
                                        : t('Panel.data.noData')}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.photo')}:
                                    <CardMedia
                                        component="img"
                                        width="100"
                                        height="100"
                                        image={user.data.photo ? `${BASE_URL}${user.data.photo}` : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`}
                                        sx={{ borderRadius: '6px', width: { xs: '100%', sm: 100 } }}
                                        alt={user.data.photo}
                                    />
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => onApproveHandler(user.id)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.data.approve')}
                                </Button>
                                <Button
                                    onClick={() => onRejectHandler(user.id)}
                                    className="reject-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.data.reject')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                    <Pagination
                        className="paginationDealHistory"
                        size="large"
                        count={Math.ceil((data?.length ?? 0) / 5)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </>
            ) : (
                <div className="empty-show">
                    {t('Panel.data.noUsers')}
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="empty-box" />
                </div>
            )}
        </div>
    );
};
