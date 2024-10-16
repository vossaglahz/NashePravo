import { FaInstagram, FaTelegramPlane, FaVk } from 'react-icons/fa';
import './Footer.scss';

export const Footer = () => {
    return (
        <div className="footer">
            <div className='brandName'>
                <h1>Наше право</h1>
            </div>
            <div className="peopleInfo">
                <div className='ours'>
                    <h3>Наши Юристы</h3>
                </div>
                <div className='ours'>
                    <h3>Наши адвокаты</h3>
                </div>
                <div className='ours'>
                    <h3>Таблица лидеров</h3>
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
