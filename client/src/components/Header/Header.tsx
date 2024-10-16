import { useState, useRef, useEffect } from 'react';
import { Badge, Button, Drawer, FormControl, IconButton, MenuItem, Paper, Popper, Select, SelectChangeEvent, Typography, Fade, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { useLogoutUserMutation } from '../../store/api/user.api';
import './Header.scss';

export const Header = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const { user, lawyer } = useAppSelector(state => state.users);
    const [language, setLanguage] = useState('ru');
    const arrowRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [logoutUser] = useLogoutUserMutation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
    };

    const handleLogout = async () => {
        try {
            if (user.refreshToken) {
                const refreshToken = user.refreshToken;
                await logoutUser({ refreshToken }).unwrap();
                localStorage.removeItem('token');
                navigate('/');
            } else if (lawyer.refreshToken) {
                const refreshToken = lawyer.refreshToken;
                await logoutUser({ refreshToken }).unwrap();
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    useEffect(() => {
        const lang = localStorage.getItem('i18nextLng');
        if (lang) setLanguage(lang);
        document.documentElement.lang = language;
    }, [language]);

    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };
    const getRole = (role: string) => {
        switch (role) {
            case 'lawyer':
                return { src: "../../public/id-card.png", alt: "Lawyer ID" };
            default:
                return null;
        }
    };
    
    const renderUserGreeting = (user: { name?: string, role?: string }, lawyer: { name?: string }) => {
        if (user.name || lawyer.name) {
            return (
                <>
                    <Typography className="welcome-text">Здравствуйте {user.name || lawyer.name}</Typography>
                    {user.role === 'lawyer' && (
                        <img className='img-lawyer' src={getRole(user.role)?.src} alt={getRole(user.role)?.alt} />
                    )}
                </>
            );
        } else {
            return (
                <Link to={'/login'}>
                    <Typography className="layoutButtonText" component="h1">
                        {t('Authorization.button.login')}
                    </Typography>
                </Link>
            );
        }
    };
    

    return (
        <div className="layoutWrapper">
            <div className="container">
                <div className="layoutNavBlock">
                    <div className="mainTitleBlock">
                        <Link to={'/'}>
                            <div className='logo-part'> 
                                <img className='logo-pic' src="../../public/logo.png" alt="logo" />
                                <h1 className='logo-name'>Наше право</h1>
                            </div>
                        </Link>
                    </div>

                    {!isMobile ? (
                        <div className="btnAuth">
                        <FormControl>
                            <Select
                                className="layoutSelectLanguage"
                                value={language}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={'ru'}>Русский</MenuItem>
                                <MenuItem value={'kz'}>Казахский</MenuItem>
                            </Select>
                        </FormControl>
                        {renderUserGreeting(user, lawyer)}
                        {(user.id || lawyer.id) && (
                            <>
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {popupState => (
                                    <div>
                                        <Button variant="text" {...bindToggle(popupState)}>
                                            <PersonIcon style={{ color: 'white' }} fontSize="large" />
                                        </Button>
                                        <Popper {...bindPopper(popupState)} transition placement="bottom-end">
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <Paper className="paper__content">
                                                        <div ref={arrowRef} className="popper-arrow" />
                                                        {user.role === "admin" || lawyer.role === "admin" ? 
                                                        <>
                                                        <Link className="link" to={'/adminPanel/profiles'} onClick={() => popupState.close()}>
                                                            Админ Панель
                                                        </Link>
                                                        <Link className="link" to={'/'} onClick={handleLogout}>
                                                            Выйти
                                                        </Link>
                                                        </>
                                                        :
                                                        <>
                                                        <Link className="link" to={'/cabinet/profile'} onClick={() => popupState.close()}>
                                                            Личный кабинет
                                                        </Link>
                                                        <Link className="link" to={'/chat'} onClick={() => popupState.close()}>
                                                            Чат
                                                        </Link>
                                                        <Link className="link" to={'/'} onClick={handleLogout}>
                                                            Выйти
                                                        </Link>
                                                        </>
                                                        }
                                                        
                                                    </Paper>
                                                </Fade>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                            </PopupState>
                            <Link to={'/cabinet/notifications'}>
                            <IconButton style={{ color: 'white', transform: 'scale(1.2)' }}>
                                <Badge badgeContent={3} color="error">
                                    <NotificationsNoneIcon />
                                </Badge>
                            </IconButton>
                        </Link>
                            </>
                        )}
                        {/* {(admin.id) && (
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {popupState => (
                                    <div>
                                        <Button variant="text" {...bindToggle(popupState)}>
                                            <PersonIcon style={{ color: 'white' }} fontSize="large" />
                                        </Button>
                                        <Popper {...bindPopper(popupState)} transition placement="bottom-end">
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <Paper className="paper__content">
                                                        <div ref={arrowRef} className="popper-arrow" />
                                                        <Link className="link" to={'/cabinet/profile'} onClick={() => popupState.close()}>
                                                            Личный кабинет
                                                        </Link>
                                                        <Link className="link" to={'/'} onClick={handleLogout}>
                                                            Выйти
                                                        </Link>
                                                    </Paper>
                                                </Fade>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                            </PopupState>
                        )} */}
                    </div>
                    ) : ( 
                        <>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
                            <MenuIcon  style={{fontSize: 50}} />
                        </IconButton>

                        <Drawer anchor="right" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                            <List>
                                <ListItem>
                                    {renderUserGreeting(user, lawyer)}
                                </ListItem>
                                <ListItem>
                                    <FormControl fullWidth>
                                        <Select
                                            value={language}
                                            onChange={handleChange}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={'ru'}>Русский</MenuItem>
                                            <MenuItem value={'kz'}>Казахский</MenuItem>
                                        </Select>
                                    </FormControl>
                                </ListItem>
                                
                                {user.id || lawyer.id ? (
                                    <>
                                        <ListItem>
                                            <Link to={'/cabinet/profile'}>Личный кабинет</Link>
                                        </ListItem>
                                        <ListItem component={Button} onClick={handleLogout}>
                                            Выйти
                                        </ListItem>
                                    </>
                                ) : null}
                            </List>
                        </Drawer>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};
