import { Box, Stack } from '@mui/material';
import { CardComponent } from '../../UI/CardComponent/CardComponent';
import { useTranslation } from 'react-i18next';
import '../HomePageComponents.scss';

export const ForWhoPage = () => {
    const { t } = useTranslation();

    const cardData = [
        { title: t('ForWhoPage.cardTitle1'), description: t('ForWhoPage.cardDesc1') },
        { title: t('ForWhoPage.cardTitle2'), description: t('ForWhoPage.cardDesc2') },
    ];

    return (
        <>
            <Stack spacing={2} className="stack" margin="20px" marginBottom="50px">
                <Box className="block-box">
                    <h2 className="title">{t('ForWhoPage.title')}</h2>
                </Box>
                <Box className="block-cards for-who-page-cards">
                    {cardData.map((card, index) => (
                        <CardComponent
                            key={index}
                            title={card.title}
                            description={card.description}
                            className="for-who-page-card-component"
                            titleClassName="for-who-page-card-title"
                            descriptionClassName="for-who-page-card-description"
                        />
                    ))}
                </Box>
            </Stack>
        </>
    );
};
