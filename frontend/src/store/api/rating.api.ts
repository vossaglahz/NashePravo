import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const RatingApi = createApi({
    reducerPath: 'ratingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/rating`,
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Rating'],
    endpoints: build => ({
        getRating: build.query({
            query: () => ({
                url: '/',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        postRating: build.mutation({
            query: ({ data }) => ({
                url: `/${data.id}`,
                method: 'POST',
                body: {description: data.description, assessment: data.assessment},
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetRatingQuery, usePostRatingMutation } = RatingApi;
