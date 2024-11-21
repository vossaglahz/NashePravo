import { NavLink } from 'react-router-dom';
import { useRef } from 'react';
import './PanelAside.scss';
import { useTranslation } from 'react-i18next';

export const PanelAside = () => {
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
        <aside className="panelAside">
            <div className="container">
                <nav>
                    <ul className="adminControllers">
                        <li>
                            <NavLink
                                ref={el => (navRefs.current[0] = el)}
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                to={'/adminPanel/profiles'}
                                onClick={() => handleClick(0)}
                            >
                                {t('Panel.profiles.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[1] = el)} to={'/adminPanel/data'} onClick={() => handleClick(1)}>
                                {t('Panel.data.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[2] = el)} to={'/adminPanel/docs'} onClick={() => handleClick(2)}>
                                {t('Panel.docs.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[3] = el)} to={'/adminPanel/notifications'} onClick={() => handleClick(3)}>
                                {t('Panel.notifications.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[4] = el)} to={'/adminPanel/questions'} onClick={() => handleClick(4)}>
                                {t('Panel.questions.title')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink ref={el => (navRefs.current[5] = el)} to={'/adminPanel/blocks'} onClick={() => handleClick(5)}>
                                {t('Panel.blocks.title')}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
