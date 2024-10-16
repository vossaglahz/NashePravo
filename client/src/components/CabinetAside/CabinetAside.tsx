import { NavLink } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { AiOutlineSafety } from 'react-icons/ai';
import { CgFileDocument } from 'react-icons/cg';
import './CabinetAside.scss';
import { Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export const CabinetAside = () => {
    return (
        <aside className="cabinetAside">
            <div className="container">
                <nav>
                    <ul>
                        <li>
                            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={'/cabinet/profile'}>
                                <GoHome />
                                Личный кабинет
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/cabinet/security'}>
                                <AiOutlineSafety />
                                Безопасность и вход
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/cabinet/dealHistory'}>
                                <CgFileDocument />
                                Сделки
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/cabinet/notifications'}>
                                <Badge badgeContent={3} color="error">
                                    <NotificationsNoneIcon />
                                </Badge>
                                уведомления
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
