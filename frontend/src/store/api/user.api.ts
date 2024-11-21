import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAuth, setLawyer, setUser } from '../slice/auth.slice';
import { IUser } from '../../interfaces/User.interface';
import { ILawyer } from '../../interfaces/Lawyer.interface';
import { IBlock } from '../../interfaces/IBlock.interface';

export const UserApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/users`,
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
        registrationUser: build.mutation<IUser | ILawyer, { name: string; surname: string; email: string; password: string; role: string }>({
            query: data => ({
                url: '/registration',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('token', data.accessToken!);
                    dispatch(setAuth(true));
                    dispatch(setUser(data));
                    dispatch(setLawyer(data));
                } catch (error) {
                    console.error('Registration error:', error);
                }
            },
        }),

        loginUser: build.mutation<IUser | ILawyer, { email: string; password: string }>({
            query: data => ({
                url: '/login',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('token', data.accessToken!);
                    dispatch(setAuth(true));
                    dispatch(setUser(data));
                    dispatch(setLawyer(data));
                } catch (error) {
                    console.error('Login error:', error);
                }
            },
        }),

        logoutUser: build.mutation<IUser | ILawyer, { refreshToken: string }>({
            query: ({ refreshToken }) => ({
                url: '/logout',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('token');
                    dispatch(setAuth(false));
                    dispatch(setUser({}));
                    dispatch(setLawyer({}));
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },
        }),

        checkAuthUser: build.query<IUser | ILawyer, void>({
            query: () => ({
                url: '/refresh',
                method: 'POST',
                credentials: 'include',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('token', data.accessToken!);
                    dispatch(setAuth(true));
                    dispatch(setUser(data));
                    dispatch(setLawyer(data));
                } catch (error) {
                    console.error('Auth check error:', error);
                    dispatch(setAuth(false));
                    dispatch(setUser({}));
                    dispatch(setLawyer({}));
                }
            },
        }),

        editLawyer: build.mutation({
            query: data => ({
                url: `/edit-request`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),

        deletePhoto: build.mutation({
            query: () => ({
                url: `/delete-request`,
                method: 'POST',
                credentials: 'include',
            }),
        }),

        changePassword: build.mutation({
            query: ({ data }) => ({
                url: `/change-password`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),
        blockUser: build.mutation<
            IBlock,
            { id: number | undefined; role: string | undefined; dateBlocked?: string | null; permanentBlocked: boolean }
        >({
            query: data => ({
                url: '/admin/block',
                method: 'POST',
                body: data,
            }),
        }),
        unblockUser: build.mutation<IBlock, { id: number | undefined; role: string | undefined }>({
            query: data => ({
                url: '/admin/unblock',
                method: 'POST',
                body: data,
            }),
        }),
        changeRecoverPassword: build.mutation({
            query: data => ({
                url: `/change-recover-password`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),
        recoverUser: build.mutation({
            query: data => ({
                url: '/recover-password',
                method: 'PUT',
                body: data,
            }),
        }),
        getLawyersRating: build.query({
            query: ({ page, limit, lawyerId }) => {
                const params = new URLSearchParams({
                    page: page?.toString(),
                    limit: limit?.toString(),
                });
                if (lawyerId) params.append('lawyerId', lawyerId.toString());

                return {
                    url: `/getLawyersList?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
    }),
});

export const {
    useRegistrationUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useCheckAuthUserQuery,
    useEditLawyerMutation,
    useChangePasswordMutation,
    useBlockUserMutation,
    useUnblockUserMutation,
    useDeletePhotoMutation,
    useRecoverUserMutation,
    useChangeRecoverPasswordMutation,
    useGetLawyersRatingQuery,
} = UserApi;
