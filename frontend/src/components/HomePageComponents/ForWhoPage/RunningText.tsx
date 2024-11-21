import { useTranslation } from 'react-i18next';
import '../HomePageComponents.scss';

export const RunningText = () => {
    const { t } = useTranslation();


    return (
        <>
            <div className="scrolling-text">
                <p>
                    {t('RunningText.description')}
                </p>
            </div>
        </>
    );
};
