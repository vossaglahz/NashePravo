import { FormEvent, useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useLoginUserMutation } from '../../../store/api/user.api';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setLawyer, setLoading, setUser } from '../../../store/slice/auth.slice';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AlertComponent } from '../../UI/Alert/Alert';
import "../Auth.scss";
import { useTranslation } from 'react-i18next';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { Loader } from '../../UI/Loader/Loader';

const LoginForm = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const {isLoading} = useAppSelector((state) => state.users)
    const [password, setPassword] = useState('');
    const [loginUser, { isSuccess: userSuccess, isLoading: loadUser }] = useLoginUserMutation();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true))
            const userData = await loginUser({ email, password }).unwrap();
            dispatch(setUser(userData));
            dispatch(setLawyer(userData as ILawyer));
            localStorage.setItem('token', userData.accessToken!);
            setTimeout(() => {
                navigate('/');
                dispatch(setLoading(false))
            }, 1500);
        } catch (e) {
            const error = e as { data?: { message?: string } };
            console.error('Ошибка авторизации:', error);
            setErrorMessage(error.data?.message || 'Неизвестная ошибка');
            
            dispatch(setLoading(false));
            setErrorStatus(true);
        }
    };

    return (
        <>
        {
            !isLoading?
            <form className='authForm' onSubmit={handleLogin}>
                <AlertComponent isError={userSuccess} text={'Вы авторизовались как пользователь успешно'} status={'success'} />
                <AlertComponent isError={errorStatus}  text={`${errorMessage}`} status={'error'} />  
                <Typography className='logName' variant="h4" align="center">
                    Авторизация.
                </Typography>
                <TextField required={true} label={t('Authorization.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
                <TextField
                    label={t('Authorization.password')}
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
                <Button type="submit" variant="contained" color="primary" className='buttonLog' disabled={loadUser} fullWidth>
                {t('Authorization.button.login')}
                </Button>
                <Link to={'/registration'} style={{ textDecoration: 'none', color: '#4C75A3', fontSize: '16px', textAlign: "center"}}>
                {t('Authorization.button.registration')}
                </Link>
                <Link to={'/'} style={{ textDecoration: 'none', color: '#4C75A3', fontSize: '16px',  textAlign: "center" }}>
                {t('Authorization.button.mainPage')}
                </Link>
            </form>:<Loader/>
        }
        </>
    );
};

export default LoginForm;
