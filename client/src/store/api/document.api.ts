import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const DocumentApi = createApi({
    reducerPath: 'documentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/docs',
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
        postDocs: build.mutation({
            query: ({ data }) => ({
                url: `/`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const { usePostDocsMutation, useGetPublishedDocsQuery } = DocumentApi;
