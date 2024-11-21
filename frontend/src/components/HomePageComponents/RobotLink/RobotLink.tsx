import { Link } from 'react-router-dom';
import './RobotLink.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const RobotLink = () => {
    const { t } = useTranslation();
    const [isClicked, setIsClocked] = useState(false);

    const handleClick = () => {
        setIsClocked(!isClicked);
    };

    return (
        <div>
            {isClicked && (
                <div className="links-component">
                    <Link to={'/intellectual-robot'}>
                        <p className="chat-robot-link">{t('Robot.toRobot')}</p>
                    </Link>
                    <Link to={'/lawyer_list'}>
                        <p className="lawyer-page-link">{t('Robot.toLawyer')}</p>
                    </Link>
                </div>
            )}
            <div className="chat-logo" onClick={handleClick}>
                <img className={`logo-robot ${!isClicked ? 'animated' : ''}`} src={`${import.meta.env.VITE_API_BASE_URL}/static/robot-mini.svg`} alt="logo" />
            </div>
        </div>
    );
};
