import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';
import './FaqPage.css';
import { useTranslation } from 'react-i18next';



export const FaqPage = () => {
    const { t } = useTranslation();

    const data = [
        {
            question: t('Footer.FAQ.question1.title'),
            answer: t('Footer.FAQ.question1.answer'),
        },
        {
            question: t('Footer.FAQ.question2.title'),
            answer: t('Footer.FAQ.question2.answer'),
        },
        {
            question: t('Footer.FAQ.question3.title'),
            answer: t('Footer.FAQ.question3.answer'),
        },
        {
            question: t('Footer.FAQ.question4.title'),
            answer: t('Footer.FAQ.question4.answer'),
        },
        {
            question: t('Footer.FAQ.question5.title'),
            answer: t('Footer.FAQ.question5.answer'),
        },
        {
            question: t('Footer.FAQ.question6.title'),
            answer: t('Footer.FAQ.question6.answer'),
        },
        {
            question: t('Footer.FAQ.question7.title'),
            answer: t('Footer.FAQ.question7.answer'),
        },
        {
            question: t('Footer.FAQ.question8.title'),
            answer: t('Footer.FAQ.question8.answer'),
        },
    ];


    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ color: '#494949', backgroundColor: '#fff', padding: '20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="faq_title">{t('Footer.questions')}</h1>
                {data.map((item, index) => (
                    <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                            <Typography className="faq_question"><h4>{item.question}</h4></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{item.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};
