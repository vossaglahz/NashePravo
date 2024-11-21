import { useEffect, useRef, useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { useChangeRecoverPasswordMutation, useRecoverUserMutation } from '../../../store/api/user.api';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../store/store';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import './RecoverPassword.scss';
import { useTranslation } from 'react-i18next';

export const RecoverPassword = () => {
    const { t } = useTranslation();
    const { user } = useAppSelector(state => state.users);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [recoverPass, { isError: recoverPassError, isSuccess: recoverPassSuccess }] = useRecoverUserMutation();
    const [changeRecoverPassword, { isError: changeRecoverPasswordError, isSuccess: changeRecoverPasswordSuccess }] =
        useChangeRecoverPasswordMutation();
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [codeFromEmail, setCodeFromEmail] = useState<number>();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [password, setPassword] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });
    const [active, setActive] = useState<boolean>(false);
    const [resendCodeTrigger, setResendCodeTrigger] = useState<number>(0);
    const [showResendAlert, setShowResendAlert] = useState<boolean>(false);
    const navigate = useNavigate();
    const [codeError, setCodeError] = useState(false);

    console.log('user: ', user);

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await changeRecoverPassword(password).unwrap();
            console.log('response: ', response);
            setCode(Array(6).fill(''));

            setTimeout(() => navigate('/cabinet/security'), 2000);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (value.match(/^[0-9]$/)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (index < 5 && value) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                inputsRef.current[index - 1]?.focus();
            } else if (code[index]) {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const sendPostRequest = async (code: string[]) => {
        try {
            const userCode = parseInt(code.join(''), 10);

            if (codeFromEmail === userCode) {
                setActive(true);
                setCodeError(false);
                setCode(Array(6).fill(''));
                setPassword({ newPassword: '', confirmNewPassword: '' });
                setIsDisabled(false);
            } else {
                setActive(false);
                setCodeError(true);
                setIsDisabled(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchRecoverPass = async () => {
        if (user.email) {
            try {
                const res = await recoverPass({ email: user.email }).unwrap();
                setCodeFromEmail(res.code);
            } catch (error) {
                console.error('Ошибка при вызове recoverPass:', error);
            }
        }
    };

    useEffect(() => {
        fetchRecoverPass();
    }, [user.email, recoverPass, resendCodeTrigger]);

    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            sendPostRequest(code);
        }
    }, [code]);

    const handleResendCode = () => {
        setResendCodeTrigger(prev => prev + 1);
        setShowResendAlert(true);
        setTimeout(() => setShowResendAlert(false), 3000);
    };

    return (
        <div className="changePassword">
            <AlertComponent isError={active} text={t('Aside.security.alertSuccess')} status={'success'} />
            <AlertComponent isError={changeRecoverPasswordSuccess} text={t('Aside.security.changeRecoverPasswordSuccess')}  status={'success'} />
            <AlertComponent isError={changeRecoverPasswordError} text={t('Aside.security.changeRecoverPasswordError')}  status={'error'} />
            <AlertComponent isError={recoverPassSuccess} text={t('Aside.security.recoverPassSuccess')} status={'success'} />
            <AlertComponent isError={recoverPassError} text={t('Aside.security.recoverPassError')}  status={'error'} />
            <AlertComponent isError={codeError} text={t('Aside.security.codeError')} status={'error'} />
            <AlertComponent isError={showResendAlert} text={t('Aside.security.showResendAlert')}status={'info'} />
            <h2>{t('Aside.security.passReset')}</h2>
            <div>
                <MdOutlineEmail className="svg__img" />
            </div>
            {!active && (
                <Box>
                    <Typography className="typography" id="transition-modal-description">
                        {t('Aside.security.passCode')}
                    </Typography>
                    <div className="numbers">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={e => handleChange(e, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                ref={el => (inputsRef.current[index] = el)}
                                style={{ width: '40px', height: '40px', textAlign: 'center', fontSize: '24px' }}
                            />
                        ))}
                    </div>
                    <button onClick={handleResendCode}>{t('Aside.security.passAgain')}</button>
                </Box>
            )}
            {active && (
                <Box>
                    <form onSubmit={onSubmitHandler}>
                        <div>
                            <input
                                value={password.newPassword}
                                name="newPassword"
                                onChange={e => setPassword({ ...password, newPassword: e.target.value })}
                                placeholder={t('Aside.security.passNewEnter')}
                                type="password"
                            />
                        </div>
                        <div>
                            <input
                                value={password.confirmNewPassword}
                                name="confirmNewPassword"
                                onChange={e => setPassword({ ...password, confirmNewPassword: e.target.value })}
                                placeholder={t('Aside.security.passNewEnterA')}
                                type="password"
                            />
                        </div>
                        <button disabled={isDisabled}>{t('Aside.security.passChange')}</button>
                    </form>
                </Box>
            )}
        </div>
    );
};
