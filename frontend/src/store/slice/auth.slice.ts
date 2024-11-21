import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/User.interface';
import { ILawyer } from '../../interfaces/Lawyer.interface';

interface AuthState {
    isAuth: boolean;
    user: IUser;
    lawyer: ILawyer;
    isLoading: boolean
}

const initialState: AuthState = {
    isAuth: false,
    user: {},
    lawyer: {},
    isLoading: false

};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setLawyer(state, action: PayloadAction<ILawyer>) {
            state.lawyer = action.payload;
        },
        setLoading(state, action:PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    },
});

export const { setAuth, setUser, setLawyer, setLoading } = authSlice.actions;
export default authSlice.reducer;
