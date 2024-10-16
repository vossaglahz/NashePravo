import { NavLink } from 'react-router-dom';
import './PanelAside.scss';

export const PanelAside = () => {
    return (
        <aside className="panelAside">
            <div className="container">
                <nav>
                    <ul className='adminControllers'>
                        <li className='oneControl'>
                            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={'/adminPanel/profiles'}>
                                Список пользователей
                            </NavLink>
                        </li>
                        <li className='oneControl'>
                            <NavLink to={'/adminPanel/data'}>
                                Редактирование данных
                            </NavLink>
                        </li>
                        <li className='oneControl'>
                            <NavLink to={'/adminPanel/docs'}>
                                Подтверждение документов
                            </NavLink>
                        </li>
                        <li className='oneControl'>
                            <NavLink to={'/adminPanel/notifications'}>
                                Глобальное уведомление
                            </NavLink>
                        </li>
                        <li className='oneControl'>
                            <NavLink to={'/adminPanel/questions'}>
                                Обработка вопросов
                            </NavLink>
                        </li>
                        <li className='oneControl'>
                            <NavLink to={'/adminPanel/blocks'}>
                                Блокировка/разблокировка
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
