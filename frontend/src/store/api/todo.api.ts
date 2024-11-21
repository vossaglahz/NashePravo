import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ToDoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/todo`,
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Todo'],
    endpoints: build => ({
        getTodo: build.query({
            query: () => ({
                url: '/',
                method: 'GET',
            }),
        }),
        createTodo: build.mutation({
            query: (payload) => ({
                url: '/',
                method: 'POST',
                credentials: 'include',
                body: payload
            }),
        }),
        deleteTodo: build.mutation({
            query: (id:string) => ({
                url: `/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),
        editStatus: build.mutation({
            query: (payload) => ({
                url: `/${payload.id}`,
                method: 'PATCH',
                credentials: 'include',
                body:{status:payload.status}
            }),
        }),
    }),
});

export const { useGetTodoQuery, useCreateTodoMutation, useEditStatusMutation, useDeleteTodoMutation} = ToDoApi;
