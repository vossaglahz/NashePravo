import { useState, useEffect } from 'react';
import { Pagination } from '@mui/material';
import { useGetLawyersRatingQuery } from '../../store/api/user.api';
import { Lawyer } from '../Ratings/LawyerDetail/LawyerDetail';
import { Link } from 'react-router-dom';
import './LawyerList.scss';
import { useTranslation } from 'react-i18next';

export const LawyerList = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

    const { data } = useGetLawyersRatingQuery({ page, limit: 5 });
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (data?.data) {
            setLawyers(data.data);
        }
    }, [data]);

    console.log('lawyers', lawyers);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    return (
        <div>
            <div className="lawyer__list">
                {lawyers.map(item => (
                    <div className="lawyer__card">
                        <div className="lawyer__card-header">
                            <div>
                                <img src={item.photo ? BASE_URL + item.photo : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`} alt="lawyer-photo" />
                            </div>
                            <div>
                                <p>{t('Footer.lawyersList.city')}</p>
                                <p>{item.city ? item.city : t('Footer.lawyersList.notShown')}</p>
                            </div>
                            <div>
                                <p>{t('Footer.lawyersList.rating')}</p>
                                <p>{item.averRating ? item.averRating : t('Footer.lawyersList.absent')}</p>
                            </div>
                            <div>
                                <p>{t('Footer.lawyersList.reviews')}</p>
                                <p>{item.rating.length ? item.rating.length : t('Footer.lawyersList.absent')}</p>
                            </div>
                        </div>
                        <div className="lawyer__card-main">
                            <p>
                                <b>{item.name + ' ' + item.surname}</b>
                            </p>
                            <Link to={`/lawyer_detail/${item.id}`}>{t('Footer.lawyersList.details')}</Link>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                className="paginationDealHistory"
                size={isMobile ? 'small' : 'large'}
                count={data ? Math.ceil(data.count / 5) : 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
