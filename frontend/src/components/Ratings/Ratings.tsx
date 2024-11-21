import { Pagination, Rating } from '@mui/material';
import { useGetLawyersRatingQuery } from '../../store/api/user.api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ratings.scss';
import { useTranslation } from 'react-i18next';

type Lawyer = {
    id: number;
    name: string;
    surname: string;
    averRating: number;
    email: string;
    lawyerType: string;
};

export const Ratings = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(1);
    const { data } = useGetLawyersRatingQuery({ page, limit: 5 });
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

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

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    return (
        <div className="ratings">
            <h1>{t('Aside.ratings.ratings')}</h1>
            <div className="ratings_table">
                <div className="ratings_table-header">
                    <p className="ratings_table-cell">№</p>
                    <p className="ratings_table-cell">{t('Aside.ratings.name')}</p>
                    <p className="ratings_table-cell">{t('Aside.ratings.surname')}</p>
                    <p className="ratings_table-cell">{t('Aside.ratings.rating')}</p>
                </div>
                {lawyers.map((lawyer, index) => (
                    <div className="ratings_table-row" key={lawyer.id}>
                        <p className="ratings_table-cell">{(page - 1) * 5 + index + 1}</p>
                        <p className="ratings_table-cell">{lawyer.name}</p>
                        <p className="ratings_table-cell">{lawyer.surname}</p>
                        <div className="ratings_table-cell">
                            <Rating name="half-rating-read" size="large" value={lawyer.averRating} precision={0.5} readOnly />
                        </div>
                        <Link className="ratings_table-cell" to={`/lawyer_detail/${lawyer.id}`}>
                            {t('Aside.ratings.details')}
                        </Link>
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
