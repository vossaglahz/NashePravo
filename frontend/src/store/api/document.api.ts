import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const DocumentApi = createApi({
    reducerPath: 'documentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/docs`,
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
        getPublishedDocs: build.query({
            query: () => ({
                url: '/',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getNotPublishedDocs: build.query({
            query: () => ({
                url: '/all',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        postDocs: build.mutation({
            query: ({ data }) => ({
                url: `/`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        publishDoc: build.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        rejectDoc: build.mutation({
            query: ({ id }) => ({
                url: `/reject/${id}`,
                method: 'POST',
                credentials: 'include',
            }),
        }),
    }),
});

export const { usePostDocsMutation, useGetPublishedDocsQuery, useGetNotPublishedDocsQuery, usePublishDocMutation, useRejectDocMutation} = DocumentApi;
