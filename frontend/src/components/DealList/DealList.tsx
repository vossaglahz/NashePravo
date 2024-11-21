import { useEffect, useState } from 'react';
import { useGetDealListQuery } from '../../store/api/dealHistory';
import { FormControl, InputLabel, MenuItem, Pagination, Select } from '@mui/material';
import { AlertComponent } from '../UI/Alert/Alert';
import { DealOne } from './DealOne';
import { IDealListOne } from '../../interfaces/DealList.interface';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import './DealList.scss';
import { useTranslation } from 'react-i18next';

dayjs.locale('ru');

export const DealList = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [type, setType] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const { data, error, isLoading, refetch } = useGetDealListQuery({
        currentPage,
        type,
        price,
    });

    const deals = data?.deals || [];
    const dealsCount: number = data?.totalCount || 0;

    useEffect(() => {
        if (data) {
            console.log(t('List.dealList.history'), data.deals);
        }
    }, [data]);

    if (isLoading) {
        return <div>{t('List.dealList.loading')}</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
        console.log(currentPage);
    };

    const onResponseSuccess = () => {
        refetch();
    };

    return (
        <div className="deal-list container">
            <AlertComponent isError={error !== undefined} text={t('List.dealList.createDealError')} status={'error'} />
            <div className="formSelect">
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('List.dealList.type')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={e => {
                            setType(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('List.dealList.typeAll')}</MenuItem>
                        <MenuItem value={'Criminal'}>{t('List.dealList.criminal')}</MenuItem>
                        <MenuItem value={'Corporate'}>{t('List.dealList.corporate')}</MenuItem>
                        <MenuItem value={'Civil'}>{t('List.dealList.civil')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="formSelectMenu">
                    <InputLabel id="demo-simple-select-label">{t('List.dealList.price')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={price}
                        label="Price"
                        onChange={e => {
                            setPrice(e.target.value);
                            setCurrentPage(0);
                        }}
                    >
                        <MenuItem value={''}>{t('List.dealList.priceAll')}</MenuItem>
                        <MenuItem value={'HIGHEST'}>{t('List.dealList.highest')}</MenuItem>
                        <MenuItem value={'LOWEST'}>{t('List.dealList.lowest')}</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {deals.length > 0 ? (
                deals.map((deal: IDealListOne) => (
                    <DealOne
                        id={deal.id}
                        title={deal.title}
                        type={deal.type}
                        description={deal.description}
                        username={deal.user.name}
                        usersurname={deal.user.surname}
                        city={deal.city}
                        price={deal.price}
                        clicked={deal.clicked}
                        onResponseSuccess={onResponseSuccess}
                    />
                ))
            ) : (
                <div className="empty-show">
                    {t('List.dealList.noOrderHistory')}<img src={`${import.meta.env.VITE_API_BASE_URL}/static/empty-box.png`} alt="empty-box" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
                size="large"
                count={Math.ceil(dealsCount / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};
