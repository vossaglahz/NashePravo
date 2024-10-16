import { useTranslation } from 'react-i18next';
import './PromoBlock.scss';

export const PromoBlock = () => {
    const { t } = useTranslation();
    return (
        <div className="promo-block-wrapper container">
            <div className="promo-block-img">
                <img
                    src="https://png.pngtree.com/png-clipart/20211219/original/pngtree-hand-drawing-eagle-vector-png-image_6964820.png"
                    alt="promo-logo"
                />
            </div>
            <div className="promo-block-description">
                <h2>{t('MainPromoTitle.title')}</h2>
            </div>
        </div>
    );
};
