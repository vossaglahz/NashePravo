import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BlockIcon from '@mui/icons-material/Block';
import { useBlockUserMutation } from '../../../store/api/user.api';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetSomeUserQuery } from '../../../store/api/admin.api';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { IUser } from '../../../interfaces/User.interface';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; 
import './Profiles.scss';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';

export const Profiles = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isActivatedByEmail, setIsActivatedByEmail] = useState<string>('');
    const [isConfirmed, setIsConfirmed] = useState<string>('');
    const [sorted, setSorted] = useState<string>('DESC');
    const [role, setRole] = useState<string>('user');
    const permanentBlock = 'false';
    const [banPeriod, setBanPeriod] = useState<string>("");
    const [alertInfo, setAlertInfo] = useState<{ text: string; isError: boolean }>();
    const navigate = useNavigate();

    const [blockUser] = useBlockUserMutation();
    const { data, isLoading, error,refetch  } = useGetSomeUserQuery({
        currentPage,
        isActivatedByEmail,
        isConfirmed,
        sorted,
        role,
        permanentBlock,
    });

    useEffect(() => {
        setCurrentPage(1);
        setRole("user");
        refetch();
    }, [location.pathname]);

    if (isLoading) {
        return (
            <Loader/>
        )
    }
    if (error || !data) {
        return <div>Ошибка сервера</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleBlock = async (id: number | undefined, role: string | undefined, permanentBlocked: boolean, dateBlocked: string | null) => {
        console.log(id, role);
        const response = await blockUser({ id, role, permanentBlocked, dateBlocked });
        if (response.data?.success) {
            setAlertInfo({
                text: t('Panel.profiles.blockSuccess'),
                isError: false,
            });
            refetch();
        } else {
            setAlertInfo({
                text: t('Panel.profiles.blockUnsuccess'),
                isError: true,
            });
        }
    };

    const handleSend = async (
        userId: number | null,
        lawyerId: number | null,
        role: string,
        name: string | undefined,
        surname: string | undefined,
    ) => {
        navigate('/adminPanel/privateNotifications', { state: { role, lawyerId, userId, name, surname } });
        console.log(lawyerId, userId);
    };

    return (
        <div className="deal-history">
        <AlertComponent isError={alertInfo?.isError === false} text={alertInfo?.text || ''} status={'success'} />
        <AlertComponent isError={alertInfo?.isError === true} text={alertInfo?.text || ''} status={'error'} />
        <div className='containerPicker'>
            <div className="formSelect">
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Panel.profiles.role')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={e => {
                            setRole(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={'user'}>{t('Panel.profiles.people')}</MenuItem>
                        <MenuItem value={'lawyer'}>{t('Panel.profiles.lawyer')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu" sx={{ marginRight: 0 }}>
                    <InputLabel id="demo-simple-select-label">{t('Panel.profiles.new')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sorted}
                        label="sorted"
                        onChange={e => {
                            setSorted(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={'DESC'}>{t('Panel.profiles.newest')}</MenuItem>
                        <MenuItem value={'ASC'}>{t('Panel.profiles.oldest')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Panel.profiles.postal')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isActivatedByEmail}
                        label="Status"
                        onChange={e => {
                            setIsActivatedByEmail(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('Panel.profiles.all')}</MenuItem>
                        <MenuItem value={'true'}>{t('Panel.profiles.active')}</MenuItem>
                        <MenuItem value={'false'}>{t('Panel.profiles.inactive')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu" disabled={role == 'user'}>
                    <InputLabel id="demo-simple-select-label">{t('Panel.profiles.status')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isConfirmed}
                        label="Status"
                        onChange={e => {
                            setIsConfirmed(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('Panel.profiles.allAppr')}</MenuItem>
                        <MenuItem value={'true'}>{t('Panel.profiles.approved')}</MenuItem>
                        <MenuItem value={'false'}>{t('Panel.profiles.inapproved')}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='datePicker'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{maxWidth: 200, marginTop: "8px", marginRight: "5px", paddingTop: 0}} components={['DatePicker']}>
                        <DatePicker
                            label={t('Panel.profiles.blockUntil')}
                            value={banPeriod ? dayjs(banPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={(e) => {
                                if (e) {
                                    const formattedDate = e.format("YYYY-MM-DD");
                                    setBanPeriod(formattedDate);
                                }
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </div>
        </div>
            {data.data.length > 0 ? (
                role === 'user' ? (
                    data.data.map((user: IUser) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {user.surname} {user.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{user.email}</Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleSend(user.id || null, null, 'user', user.name, user.surname)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.profiles.write')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(user.id, user.role, true, null)}
                                    className="block-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.toBlock')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(user.id, user.role, true, banPeriod)}
                                    className="block-date-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.onTime')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    data.data.map((lawyer: ILawyer) => (
                        <Card key={lawyer.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {lawyer.surname} {lawyer.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{lawyer.email}</Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleSend(null, lawyer.id || null, 'lawyer', lawyer.name, lawyer.surname)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.profiles.write')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(lawyer.id, lawyer.role, true, null)}
                                    className="block-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.toBlock')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(lawyer.id, lawyer.role, true, banPeriod)}
                                    className="block-date-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.onTime')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )
            ) : (
                <div className="ufo">
                    {t('Panel.profiles.ufo')}
                    <img className="img-pro" src={`${import.meta.env.VITE_API_BASE_URL}/static/ufo.png`} alt="ufo" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
                size="large"
                count={Math.ceil(data.count / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
