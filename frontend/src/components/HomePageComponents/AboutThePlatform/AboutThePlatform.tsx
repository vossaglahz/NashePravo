import { Box, Stack } from '@mui/material';
import { CardComponent } from '../../UI/CardComponent/CardComponent';
import Slider from 'react-slick';
import { CSSProperties } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import '../HomePageComponents.scss';

export const AboutThePlatform = () => {
    const { t } = useTranslation();
    function SampleNextArrow(props: { className: undefined; style: CSSProperties | undefined; onClick: undefined }) {
        const { className, style, onClick } = props;
        return <div className={className} style={{ ...style, display: 'block', padding: '5px' }} onClick={onClick} />;
    }

    function SamplePrevArrow(props: { className: undefined; style: CSSProperties | undefined; onClick: undefined }) {
        const { className, style, onClick } = props;
        return <div className={className} style={{ ...style, display: 'block', padding: '5px', paddingLeft: '0' }} onClick={onClick} />;
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        nextArrow: <SampleNextArrow className={undefined} style={undefined} onClick={undefined} />,
        prevArrow: <SamplePrevArrow className={undefined} style={undefined} onClick={undefined} />,
    };

    const cardData = [
        { title: t('AboutThePlatform.card1.title'), description: t('AboutThePlatform.card1.description') },
        { title: t('AboutThePlatform.card2.title'), description: t('AboutThePlatform.card2.description') },
        { title: t('AboutThePlatform.card3.title'), description: t('AboutThePlatform.card3.description') },
        { title: t('AboutThePlatform.card4.title'), description: t('AboutThePlatform.card4.description') },
        { title: t('AboutThePlatform.card5.title'), description: t('AboutThePlatform.card5.description') },
        { title: t('AboutThePlatform.card6.title'), description: t('AboutThePlatform.card6.description') },
        { title: t('AboutThePlatform.card7.title'), description: t('AboutThePlatform.card7.description') },
        { title: t('AboutThePlatform.card8.title'), description: t('AboutThePlatform.card8.description') },
        { title: t('AboutThePlatform.card9.title'), description: t('AboutThePlatform.card9.description') },
        { title: t('AboutThePlatform.card10.title'), description: t('AboutThePlatform.card10.description') },
    ];

    return (
        <Stack spacing={2} className="stack container" margin="50px" marginBottom="50px">
            <Box className="block-box">
                <h2 className="title">{t('AboutThePlatform.title')}</h2>
            </Box>
            <Box className="block-cards">
                <Slider arrows={true} {...settings}>
                    {cardData.map((card, index) => (
                        <CardComponent
                            key={index}
                            title={card.title}
                            description={card.description}
                            className="card-component"
                            titleClassName="card-component-title"
                            descriptionClassName="card-component-description"
                        />
                    ))}
                </Slider>
            </Box>
        </Stack>
    );
};
