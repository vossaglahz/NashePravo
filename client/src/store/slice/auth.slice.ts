import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/User.interface';
import { ILawyer } from '../../interfaces/Lawyer.interface';

interface AuthState {
    isAuth: boolean;
    user: IUser;
    lawyer: ILawyer;
}

const initialState: AuthState = {
    isAuth: false,
    user: {},
    lawyer: {},
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
    },
});

export const { setAuth, setUser, setLawyer } = authSlice.actions;
export default authSlice.reducer;
