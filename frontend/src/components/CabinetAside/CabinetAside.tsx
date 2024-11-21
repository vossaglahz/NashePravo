import { NavLink } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { AiOutlineSafety } from 'react-icons/ai';
import { CgFileDocument } from 'react-icons/cg';
import { Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useTranslation } from 'react-i18next';
import { FaRankingStar } from 'react-icons/fa6';
import { useRef } from 'react';
import './CabinetAside.scss';

export const CabinetAside = () => {
    const { t } = useTranslation();
    const navRefs = useRef<Array<HTMLAnchorElement | null>>([]);

    const handleClick = (index: number) => {
        navRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    };

    return (
        <aside className="cabinetAside">
            <div className="container">
                <nav>
                    <ul>
                        <li>
                            <NavLink
                                ref={el => (navRefs.current[0] = el)}
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                to={'/cabinet/profile'}
                                onClick={() => handleClick(0)}
                            >
                                <GoHome />
                                {t('Aside.personal')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[1] = el)} to={'/cabinet/security'} onClick={() => handleClick(1)}>
                                <AiOutlineSafety />
                                {t('Aside.security.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[2] = el)} to={'/cabinet/dealHistory'} onClick={() => handleClick(2)}>
                                <CgFileDocument />
                                {t('Aside.deals.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[3] = el)} to={'/cabinet/notifications'} onClick={() => handleClick(3)}>
                                <Badge badgeContent={0} color="error">
                                    <NotificationsNoneIcon />
                                </Badge>
                                {t('Aside.notifics.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[4] = el)} to={'/cabinet/ratings'} onClick={() => handleClick(4)}>
                                <FaRankingStar />
                                {t('Aside.ratings.title')}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
