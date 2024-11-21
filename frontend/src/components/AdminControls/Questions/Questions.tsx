import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllProcessingQuestionsQuery } from '../../../store/api/notifications.api';
import './Questions.scss';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';

interface PersonalNotification {
    id: number;
    topic: string;
    content: string;
    role: string;
    toAdmin: boolean;
    answered: boolean;
    userId: number;
    lawyerId: number;
    user: { id: number; name: string; surname: string };
    lawyer: { id: number; name: string; surname: string };
}

export const Questions = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [role, setRole] = useState<string>('user');
    const [status, setStatus] = useState<string>('false');
    const [sorted, setSorted] = useState<string>('ASC');

    const { data, isLoading, error, refetch } = useGetAllProcessingQuestionsQuery({
        currentPage,
        role,
        status,
        sorted,
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        setCurrentPage(1);
        setRole("user");
        refetch();
    }, [location.pathname]);

    const getRole = (status: string) => {
        switch (status) {
            case 'lawyer':
                return { color: '#008d42', text: t('Panel.questions.lawyer')};
            case 'user':
                return { color: '#38a0dc', text: t('Panel.questions.user')};
            default:
                return { color: 'black' };
        }
    };

    if (isLoading) {
        return <Loader/>
    }

    if (error || !data || !data.notifications) {
        return <div>{t('Panel.questions.serverError')}</div>;
    }

    const allPerNot: PersonalNotification[] = data.notifications;

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleSend = async (userId: number | null, lawyerId: number | null, 
        username: string | null, usersurname: string | null, lawyername: string | null, lawyersurname: string | null,
        role: string, questionId: number, questionText: string) => {
        navigate('/adminPanel/privateNotifications', { state: { role, lawyerId, userId, 
            username, usersurname,lawyername, lawyersurname,
            questionId, questionText } });
    };

    const filteredData = allPerNot.filter((item: PersonalNotification) => {
        const isRoleMatch = role === 'user' ? item.role === 'user' : item.role === 'lawyer';
        return isRoleMatch;
    });

    return (
        <div className="deal-history">
            <div className="formSelect">
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Panel.questions.role')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={e => {
                            setRole(e.target.value);
                        }}
                    >
                        <MenuItem value={'user'}>{t('Panel.questions.peoples')}</MenuItem>
                        <MenuItem value={'lawyer'}>{t('Panel.questions.lawyers')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu" sx={{ marginRight: 0 }}>
                    <InputLabel id="demo-simple-select-label">{t('Panel.questions.new')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sorted}
                        label="questionDate"
                        onChange={e => {
                            setSorted(e.target.value);
                        }}
                    >
                        <MenuItem value={'ASC'}>{t('Panel.questions.newest')}</MenuItem>
                        <MenuItem value={'DESC'}>{t('Panel.questions.oldest')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Panel.questions.status')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="AnswerStatus"
                        onChange={e => {
                            setStatus(e.target.value);
                        }}
                    >
                        <MenuItem value={'true'}>{t('Panel.questions.answered')}</MenuItem>
                        <MenuItem value={'false'}>{t('Panel.questions.usAnswered')}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {filteredData.length > 0 ? (
                filteredData.map(item => (
                    <Card key={item.id} className="deal-history-card">
                        <CardContent className="deal-card-content">
                            {(() => {
                                const { color, text } = getRole(item.role);
                                return (
                                    <Typography sx={{ color, fontSize: 16 }} key={item.id + item.role}>
                                        {text}: {item.user ? item.user.name + " " + item.user.surname : item.lawyer.name + " " + item.lawyer.surname}
                                    </Typography>
                                );
                            })()}
                            <Typography sx={{ fontSize: 25 }} className="deal-title">
                                {item.topic}
                            </Typography>
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {item.content}
                            </Typography>
                            <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                {item.answered ? t('Panel.questions.answeredMess') : t('Panel.questions.usAnsweredMess')}
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button
                                onClick={() =>
                                    handleSend(
                                        item.role === 'user' ? item.userId : null,
                                        item.role === 'lawyer' ? item.lawyerId : null,
                                        item.role === 'user' ? item.user.name : null,
                                        item.role === 'user' ? item.user.surname : null,
                                        item.role === 'lawyer' ? item.lawyer.name : null,
                                        item.role === 'lawyer' ? item.lawyer.surname : null,
                                        item.role,
                                        item.id,
                                        item.content
                                    )
                                }
                                className="deal-button"
                                variant="contained"
                                size="small"
                                endIcon={<SendIcon />}
                            >
                                {t('Panel.questions.response')}
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">
                    {t('Panel.questions.noNotif')}
                    <img className="img-pro" src={`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="empty-box" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
                size="large"
                count={Math.ceil(data.totalCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
