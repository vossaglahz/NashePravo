import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useUnblockUserMutation } from '../../../store/api/user.api';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useGetSomeUserQuery } from '../../../store/api/admin.api';
import { IUser } from '../../../interfaces/User.interface';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import moment from 'moment';
import './Blocks.scss';
import { useLocation } from 'react-router-dom';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';

export const Blocks = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [role, setRole] = useState<string>('user');
    const permanentBlock = 'true';
    const isConfirmed = '';
    const isActivatedByEmail = '';
    const sorted = 'desc';

    const [alertInfo, setAlertInfo] = useState<{ text: string; isError: boolean }>();

    const [unblockUser] = useUnblockUserMutation();

    const { data, isLoading, error, refetch } = useGetSomeUserQuery({
        currentPage,
        isActivatedByEmail,
        isConfirmed,
        sorted,
        role,
        permanentBlock,
    });

    useEffect(() => {
        setCurrentPage(1);
        setRole('user');
        refetch();
    }, [location.pathname]);

    if (isLoading) {
        return <Loader />;
    }

    if (error || !data) {
        return <div>{t('Panel.blocks.serverError')}</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleUnblock = async (id: number | undefined, role: string | undefined) => {
        const response = await unblockUser({ id, role });
        if (response.data?.success) {
            setAlertInfo({
                text: t('Panel.blocks.userUnblock'),
                isError: false,
            });
            refetch();
        } else {
            setAlertInfo({
                text: t('Panel.blocks.userBlock'),
                isError: true,
            });
        }
    };

    return (
        <div className="deal-history">
            <AlertComponent isError={alertInfo?.isError === false} text={alertInfo?.text || ''} status={'success'} />
            <AlertComponent isError={alertInfo?.isError === true} text={alertInfo?.text || ''} status={'error'} />
            <div className="formSelect">
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('Panel.blocks.role')}</InputLabel>
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
                        <MenuItem value={'user'}>{t('Panel.blocks.peoples')}</MenuItem>
                        <MenuItem value={'lawyer'}>{t('Panel.blocks.lawyers')}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {data.data.length > 0 ? (
                role === 'user' ? (
                    data.data.map((user: IUser) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {user.surname} {user.name}
                                </Typography>
                                {user.permanentBlocked && user.dateBlocked == null ? (
                                    <Typography>{t('Panel.blocks.blockedAlways')}</Typography>
                                ) : (
                                    user.permanentBlocked &&
                                    user.dateBlocked !== null && (
                                        <Typography>
                                            {t('Panel.blocks.blockedUntil')} {moment(user.dateBlocked).utc().format('DD-MM-YYYY')}
                                        </Typography>
                                    )
                                )}
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{user.email}</Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleUnblock(user.id, user.role)}
                                    className="unblock-button adminPanelBtn"
                                    variant="contained"
                                    size="small"
                                    endIcon={<AddReactionIcon />}
                                >
                                    {t('Panel.blocks.unblock')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    data.data.map((lawyer: ILawyer) => (
                        <Card key={lawyer.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {lawyer.surname}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {lawyer.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{lawyer.email}</Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleUnblock(lawyer.id, lawyer.role)}
                                    className="unblock-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<AddReactionIcon />}
                                >
                                    {t('Panel.blocks.unblock')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )
            ) : (
                <div className="policeman">
                    {t('Panel.blocks.policeman')}
                    <img className="img-pro" src={`${import.meta.env.VITE_API_BASE_URL}/static/policeman.png`} alt="policeman" />
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
