import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IDealHistory } from '../../interfaces/DealHistory.interface';
import { IDealList } from '../../interfaces/DealList.interface';

export const DealHistoryApi = createApi({
    reducerPath: 'dealHistoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/deal`,
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
        createDeal: build.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        getDealList: build.query<{
            deals: IDealList[];
            totalCount: number;
        }, {
            currentPage: number;
            type: string;
            price: string;
        }>({
            query: ({ currentPage, type, price}) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    type,
                    price
                });
                return {
                    url: `/new-deals?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
        responseLawyer: build.mutation({
            query: (data) => ({
                url: `/lawyer-response/${data.id}`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        approveDeal: build.mutation({
            query: ({dealId, lawyerId}) => ({
                url: `/approve-deal/${dealId}?lawyerId=${lawyerId.toString()}`,
                method: 'POST',
                body: dealId,
                credentials: 'include',
            }),
        }),
        closeDeal: build.mutation({
            query: (data) => ({
                url: `/close/${data}`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const { 
    useGetDealHistoryQuery, useCreateDealMutation, useGetDealListQuery, useResponseLawyerMutation, 
    useApproveDealMutation, useCloseDealMutation } = DealHistoryApi;