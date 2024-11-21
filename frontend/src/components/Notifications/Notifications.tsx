import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGetAllGeneralNotificationsQuery, useGetAllPersonalNotificationsQuery } from '../../store/api/notifications.api';
import { Pagination } from '@mui/material';
import { INotify } from '../../interfaces/Notifications.interface';
import { Notification } from './Notification/Notification';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import { Loader } from '../UI/Loader/Loader';
import { formatDate } from '../../helpers/formatDate';
import './Notifications.scss';
import { useTranslation } from 'react-i18next';

export const Notifications = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPrivate, setIsPrivate] = useState<string>('general');
    const [important, setImportant] = useState<string>('all');
    const [sorted, setSorted] = useState<string>('DESC');
    const [notifications, setNotidications] = useState<{ totalCount: number; notifications: INotify[] }>({totalCount: 0, notifications: []});
    const { data: generalNotifications, isLoading: isLoadingGeneral } = useGetAllGeneralNotificationsQuery({
        currentPage,
        important,
        sorted,
    });
    const { data: personalNotifications, isLoading: isLoadingPersonal } = useGetAllPersonalNotificationsQuery({
        currentPage,
        sorted,
    });
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isPrivate === 'general' && generalNotifications) {
            setNotidications(generalNotifications);
        } else if (isPrivate === 'personal' && personalNotifications) {
            setNotidications(personalNotifications);
        }
    }, [generalNotifications, personalNotifications, isPrivate]);

    console.log('notifications: ', notifications);

    const handleChange = (event: SelectChangeEvent) => {
        setIsPrivate(event.target.value as string);
        setCurrentPage(1);
    };
    if (isLoadingPersonal || isLoadingGeneral) {
        return <Loader />;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };
    return (
        <>
            <div className="filter">
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl style={{ marginTop: 8 }} className="typebox">
                        <InputLabel id="demo-simple-select-label">{t('Aside.notifics.type')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={isPrivate}
                            label={t('Aside.notifics.type')}
                            onChange={handleChange}
                        >
                            <MenuItem value="general">{t('Aside.notifics.general')}</MenuItem>
                            <MenuItem value="personal">{t('Aside.notifics.personal')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{ width: 110 }} className="formSelectMenu">
                        <InputLabel id="demo-simple-select-label">{t('Aside.notifics.date')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sorted}
                            label="sorted"
                            onChange={e => {
                                setSorted(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <MenuItem value={'DESC'}>{t('Aside.notifics.newest')}</MenuItem>
                            <MenuItem value={'ASC'}>{t('Aside.notifics.oldest')}</MenuItem>
                        </Select>
                    </FormControl>
                    {isPrivate === 'general' && (
                        <FormControl className="formSelectMenu">
                            <InputLabel id="demo-simple-select-label">{t('Aside.notifics.priority')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={important}
                                label="important"
                                onChange={e => {
                                    setImportant(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <MenuItem value={'all'}>{t('Aside.notifics.allPrior')}</MenuItem>
                                <MenuItem value={'important'}>{t('Aside.notifics.important')}</MenuItem>
                                <MenuItem value={'not important'}>{t('Aside.notifics.notImportant')}</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </div>
            <div className="notifications__wrapper">
                {notifications.notifications.length > 0 ? (
                    notifications.notifications.map(item => (
                        <Notification
                            id={item.id}
                            key={item.id}
                            topic={item.topic}
                            content={item.content}
                            _createdAt={formatDate(item._createdAt)}
                            important={item.important}
                            role={item.role}
                            user={item.user}
                            isPrivate={isPrivate} 
                            sourceLink={item.sourceLink} 
                        />
                    ))
                ) : (
                    <div className="noneNotify">
                        {<IoNotificationsOffOutline />}
                        <p>{t('Aside.notifics.noneNotify')}</p>
                    </div>
                )}
            </div>
            {notifications.notifications.length > 0 ? (
                <Pagination
                    className="paginationDealHistory"
                    size={isMobile ? 'small' : 'large'}
                    count={Math.ceil(notifications.totalCount / 5)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            ) : null}
        </>
    );
};
