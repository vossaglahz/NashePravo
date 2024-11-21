import { useParams } from 'react-router-dom';
import { Rating, Typography } from '@mui/material';
import { BsFiletypePdf } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useGetLawyersRatingQuery } from '../../../store/api/user.api';
import './LawyerDetail.scss';
import { useTranslation } from 'react-i18next';

export type Lawyer = {
    id: number;
    name: string;
    surname: string;
    patronymicName: null;
    photo: null;
    lawyerType: null;
    caseCategories: null;
    isActivatedByEmail: true;
    isConfirmed: false;
    dateBlocked: null;
    permanentBlocked: false;
    city: null;
    about: null;
    averRating: 3.25;
    rating: [
        {
            id: number;
            description: string;
            assessment: number;
            createdAt: string;
            user: {
                id: 1;
                name: 'Lawrence';
                surname: 'Lowe';
                photo: null;
            };
        },
    ];
    documents: { image: { name: string; src: string }[] }[];
};

interface User {
    name: string;
    surname: string;
    photo: string | null;
}

interface Rating {
    assessment: number;
    createdAt: string;
    description: string;
    id: number;
    user: User;
}

export const LawyerDetail = () => {
    const { t } = useTranslation();
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;
    const { id } = useParams();
    const { data } = useGetLawyersRatingQuery({ lawyerId: id });
    const [lawyer, setLawyer] = useState<Lawyer>();

    useEffect(() => {
        if (data) {
            setLawyer(data);
        }
    }, [id, data]);

    let categories: string[] = [];
    if (lawyer?.caseCategories) {
        try {
            categories = JSON.parse(lawyer.caseCategories);
            if (!Array.isArray(categories)) {
                categories = [];
            }
        } catch (error) {
            console.error('Error parsing caseCategories:', error);
        }
    }

    const ratings: Rating[] = lawyer?.rating || [];
    const ratingCounts = [0, 0, 0, 0, 0];
    ratings.forEach(({ assessment }) => {
        if (assessment >= 1 && assessment <= 5) {
            ratingCounts[assessment - 1] += 1;
        }
    });
    const totalRatings = ratings.length;

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'green';
        if (rating === 3) return 'yellow';
        return 'red';
    };

    return (
        <div className="lawyerDetail">
            <div className="container">
                {lawyer ? (
                    <div>
                        <div className="image__full-name">
                            <div>
                                <img
                                    src={lawyer.photo ? BASE_URL + lawyer.photo : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`}
                                    alt={lawyer.name}
                                    className="lawyer-photo"
                                />
                            </div>
                            <div className="lawyer__data">
                                <p>{t('Aside.ratings.nameDetails')}: {lawyer.name}</p>
                                <p>{t('Aside.ratings.surnameDetails')}: {lawyer.surname}</p>
                                {lawyer.patronymicName && <p>{t('Aside.ratings.patrNameDetails')}: {lawyer.patronymicName}</p>}
                                <p>{t('Aside.ratings.type')}: {lawyer.lawyerType || t('Aside.ratings.typeAbsent')}</p>
                                <p>{t('Aside.ratings.category')}: {categories.length > 0 ? categories.join(', ') : t('Aside.ratings.categoryAbsent')}</p>
                            </div>
                        </div>
                        <h2>{t('Aside.ratings.about')}</h2>
                        <p>{lawyer.about ? lawyer.about : t('Aside.ratings.aboutAbsent')}</p>
                        <h2>{t('Aside.ratings.docs')}</h2>
                        <Typography style={{ display: 'flex', flexWrap: 'wrap' }} gap={5}>
                            {lawyer?.documents?.[0]?.image && lawyer.documents[0].image.length > 0
                                ? lawyer.documents[0].image.map((imgSrc, index) => (
                                      <div className="previewImg" key={index} title={imgSrc.name}>
                                          <a target="_blank" href={`${BASE_URL}${imgSrc.src}`} rel="noopener noreferrer">
                                              <BsFiletypePdf />
                                          </a>
                                          <a className="previewImg__name" target="_blank" href={`${BASE_URL}${imgSrc.src}`} rel="noopener noreferrer">
                                              {imgSrc.name}
                                          </a>
                                      </div>
                                  ))
                                : t('Aside.ratings.absent')}
                        </Typography>
                        <h2>{t('Aside.ratings.reviews')}</h2>
                        <div className="reviews">
                            {lawyer.rating.length > 0 && (
                                <div className="ratings-each">
                                    <h1
                                        className="around"
                                        style={{
                                            color: getRatingColor(lawyer.averRating),
                                            border: `2px solid ${getRatingColor(lawyer.averRating)}`,
                                        }}
                                    >
                                        <b>{lawyer.averRating.toFixed(1)}</b>
                                    </h1>
                                    <div>
                                        {[5, 4, 3, 2, 1].map(stars => {
                                            const count = ratingCounts[stars - 1];
                                            const percentage = totalRatings ? ((count / totalRatings) * 100).toFixed(1) : '0.0';
                                            return (
                                                <div key={stars} className="rating-row">
                                                    <Rating name="half-rating-read" size="large" value={stars} precision={0.5} readOnly />
                                                    <p>{percentage}%</p>
                                                    <p>{count} {t('Aside.ratings.reviewes')}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="user__review">
                                {lawyer.rating.length > 0 ? (
                                    ratings.map(item => (
                                        <div className="user__review-wrap" key={item.id}>
                                            <div className="user__review-photo">
                                                <img
                                                    src={item.user.photo ? BASE_URL + item.user.photo : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`}
                                                    alt="lawyer-photo"
                                                />
                                                <p style={{ width: 150 }}>{`${item.user.name} ${item.user.surname}`}</p>
                                            </div>
                                            <div className="user__review-comment">
                                                <p>
                                                    <Rating name="half-rating-read" size="large" value={item.assessment} precision={0.5} readOnly />
                                                    {new Date(item.createdAt).toLocaleDateString()}{' '}
                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>{t('Aside.ratings.reviewsAbsent')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>{t('Aside.ratings.dataAbsent')}</p>
                )}
            </div>
        </div>
    );
};
