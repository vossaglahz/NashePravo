import { NavLink } from 'react-router-dom';
import { PiKeyLight } from 'react-icons/pi';
import { IoIosArrowForward } from 'react-icons/io';
import { MdOutlineLockReset } from 'react-icons/md';
import './Security.scss';
import { useTranslation } from 'react-i18next';

export const Security = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="security">
                <li>
                    <NavLink to={'/cabinet/change-password'} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <div>
                            <PiKeyLight />
                            {t('Aside.security.password')}
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </NavLink>
                </li>
            </div>
            <br />
            <div className="security">
                <li>
                    <NavLink to={'/cabinet/recover-password'} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <div>
                            <MdOutlineLockReset />
                            {t('Aside.security.passRecovery')}
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </NavLink>
                </li>
            </div>
        </>
    );
};
