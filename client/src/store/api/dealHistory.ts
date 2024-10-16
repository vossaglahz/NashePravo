import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IDealHistory } from '../../interfaces/DealHistory.interface';

export const DealHistoryApi = createApi({
    reducerPath: 'dealHistoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/deal',
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: build => ({
        getAllDealHistory: build.query({
            query: () => ({
                url: '/all',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getDealHistory: build.query<{
            deals: IDealHistory[];
            totalCount: number;
        }, {
            currentPage: number;
            startPeriod: string;
            endPeriod: string;
            type: string;
            price: string;
            status: string;
            dealDate: string;
        }>({
            query: ({ currentPage, startPeriod, endPeriod, type, price, status, dealDate}) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    startPeriod,
                    endPeriod,
                    type,
                    price,
                    status,
                    dealDate
                });
                return {
                    url: `?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
        createOrder: build.mutation({
            query: ({ data }) => ({
                url: `/`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetAllDealHistoryQuery, useGetDealHistoryQuery, useCreateOrderMutation } = DealHistoryApi;