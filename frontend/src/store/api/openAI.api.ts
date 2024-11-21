import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const OpenAiApi = createApi({
    reducerPath: 'openAiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/openAi`,
    }),
    endpoints: build => ({
        messageOpenAi: build.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useMessageOpenAiMutation } = OpenAiApi;