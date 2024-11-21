import { PiKeyLight } from 'react-icons/pi';
import { useChangePasswordMutation } from '../../../store/api/user.api';
import { useState } from 'react';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.scss';
import { useTranslation } from 'react-i18next';

export const ChangePassword = () => {
    const { t } = useTranslation();
    const [changePassword, { isError: changePasswordError, isSuccess: changePasswordSuccess}] =
        useChangePasswordMutation();
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const navigate = useNavigate();

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
        setIsDisabled(false);
    };

    const savePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!Object.values(password).some(item => item.trim() === '')) {
            try {
                await changePassword({ data: password });
                setPassword({ newPassword: '', currentPassword: '', confirmNewPassword: '' });
                setIsDisabled(true);
                setTimeout(() => navigate('/cabinet/security'), 2000);
            } catch (error) {
                console.log('error: ', error);
            }
        }
    };
    return (
        <div className="changePassword">
            <AlertComponent isError={changePasswordError} status="error" text={t('Aside.security.error')} />
            <AlertComponent isError={changePasswordSuccess} status="success" text={t('Aside.security.success')} />
            <div>
                <PiKeyLight className="svg__img" />
            </div>
            <h3>{t('Aside.security.passChange')}</h3>
            <form onSubmit={savePassword}>
                <input
                    value={password.currentPassword}
                    name="currentPassword"
                    onChange={onChangeHandler}
                    placeholder={t('Aside.security.passOldEnter')}
                    type="password"
                />
                <input
                    value={password.newPassword}
                    name="newPassword"
                    onChange={onChangeHandler}
                    placeholder={t('Aside.security.passNewEnter')}
                    type="password"
                />
                <input
                    value={password.confirmNewPassword}
                    name="confirmNewPassword"
                    onChange={onChangeHandler}
                    placeholder={t('Aside.security.passNewEnterA')}
                    type="password"
                />
                <button disabled={isDisabled}>{t('Aside.security.save')}</button>
            </form>
        </div>
    );
};
