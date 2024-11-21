import { FaInstagram, FaTelegramPlane, FaVk } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './Footer.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className="footer">
            <div className="brandName">
                <h1>Наше право</h1>
            </div>
            <div className="peopleInfo">
                <div className="ours">
                    <NavLink to={'/lawyer_list'}>{t('Footer.lawyersList.title')}</NavLink>
                </div>
                <div className='ours'>
                    <h3><Link to="/faq">{t('Footer.questions')}</Link></h3>
                </div>
            </div>
            <div className="socialInfo">
                <div className="telegramIcon">
                    <FaTelegramPlane />
                </div>
                <div className="instagramIcon">
                    <FaInstagram />
                </div>
                <div className="vkIcon">
                    <FaVk />
                </div>
            </div>
        </div>
    );
};
