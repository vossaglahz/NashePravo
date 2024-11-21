import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, CircularProgress, Typography, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
import { useRegistrationUserMutation } from '../../../store/api/user.api';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Switcher from './RegistrationUI/switcher';
import { AlertComponent } from '../../UI/Alert/Alert';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import '../Auth.scss';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setLoading } from '../../../store/slice/auth.slice';
import { Loader } from '../../UI/Loader/Loader';
import '../../Adaptive/_mobile.scss';

const RegistrationForm: FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('user');
    const {isLoading} = useAppSelector((state) => state.users)
    const [registrationUser, { isError: userError, isSuccess: userSuccess, isLoading: loadUser }] = useRegistrationUserMutation();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [siteRules, setSiteRules] = useState<boolean>(false);
    const [politicRules, setPoliticRules] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<string>('none');
    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (siteRules === true && politicRules === true) {
                setIsAlert('none');
                dispatch(setLoading(true))
                await registrationUser({ name, surname, email, password, role }).unwrap();
                setTimeout(() => {
                    dispatch(setLoading(false))
                    navigate('/');
                }, 1500);
            } else {
                setIsAlert('flex');
            }
        } catch (e) {
            const error = e as { data?: { errors?: Array<{ messages?: string[] }> } };
            console.error('Ошибка при регистрации:', error);
            setErrorMessage(error.data?.errors?.[0].messages?.[0] || 'Неизвестная ошибка');
            
            dispatch(setLoading(false));
            setErrorStatus(true);
        }
    };

    const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.checked ? 'lawyer' : 'user');
    };

    const checkboxChangeHandler = (ruletype: string) => {
        if (ruletype == 'site') {
            setSiteRules(!siteRules);
        } else {
            setPoliticRules(!politicRules);
        }
    };

    return (
        <>
         {
            !isLoading?<form className="authForm" onSubmit={handleRegistration}>
            <Alert className="checkboxAlert" severity="error" style={{ display: `${isAlert}` }}>
                вы не можете заригестрироваться без принятия политики конфиденциальности и правил сайта
            </Alert>
            <AlertComponent isError={userSuccess} text={'Регистрация пользователя прошла успешно'} status={'success'} />
            <AlertComponent isError={userError} text={'Заполните все поля корректно'} status={'error'} />
            <AlertComponent isError={errorStatus}  text={`${errorMessage}`} status={'error'} />  
            <Typography className="regName" variant="h4" align="center">
                Регистрация
            </Typography>
            <FormControlLabel
                sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '0 auto' }}
                control={<Switcher checked={role === 'lawyer'} onChange={handleRoleChange} />}
                label={role === 'user' ? <span style={{ color: '#4C75A3' }}>Человек</span> : <span style={{ color: '#65C466' }}>Юрист</span>}
            />
            <TextField required={true} label="Имя" type="text" value={name} onChange={e => setName(e.target.value)} fullWidth />
            <TextField required={true} label="Фамилия" type="text" value={surname} onChange={e => setSurname(e.target.value)} fullWidth />
            <TextField required={true} label="Почта" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField
                label="Пароль"
                variant="outlined"
                required={true}
                type={showPassword ? 'text' : 'password'}
                onChange={e => setPassword(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <div className="rules">
                <b style={{ color: 'red', fontSize: '26px' }}>*</b> <Checkbox onClick={() => checkboxChangeHandler('site')} />
                Я прочитал(а) и соглашаюсь с правилами
                <br />
                <Link to={'/site-rules'} style={{ textDecoration: 'none', color: '#38a0dc', fontSize: '16px', textAlign: 'center' }}>
                    *правила и условия*
                </Link>
            </div>
            <div className="rules">
                <b style={{ color: 'red', fontSize: '26px' }}>*</b> <Checkbox onClick={() => checkboxChangeHandler('politics')} />
                принимаю
                <Link to={'/politic-rules'} style={{ textDecoration: 'none', color: '#38a0dc', fontSize: '16px', textAlign: 'center' }}>
                    *Политику конфиденциальности*
                </Link>
            </div>
            <Button className="regButton" type="submit" variant="contained" color="primary" disabled={loadUser} fullWidth>
                {loadUser ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
            </Button>
            <Link to={'/login'} style={{ textDecoration: 'none', color: '#4C75A3', fontSize: '16px', textAlign: 'center' }}>
                Авторизоваться
            </Link>
            <Link to={'/'} style={{ textDecoration: 'none', color: '#4C75A3', fontSize: '16px', textAlign: 'center' }}>
                На главную страницу
            </Link>
        </form>:<Loader/>
         }
        </>
    );
};

export default RegistrationForm;
