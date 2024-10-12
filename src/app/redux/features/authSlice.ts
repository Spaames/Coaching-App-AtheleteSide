import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from "@/app/redux/store";

interface User {
    username: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: {
        username: 'N/A',
        firstName: 'N/A',
        lastName: 'N/A',
    },
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<User>) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        login(state, action: PayloadAction<User>) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                username: 'N/A',
                firstName: 'N/A',
                lastName: 'N/A',
            };
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, login, logout } = authSlice.actions;

export const loginAPI = (username: string, password: string): AppThunk => async (dispatch) => {
    try {
        dispatch(loginStart());
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password}),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(loginSuccess(data.user));
            localStorage.setItem('user', JSON.stringify(data.user.username + "-" + data.user.firstName + "-" + data.user.lastName));
        } else {
            dispatch(loginFailure(data.message));
        }
    } catch (e) {
        console.log(e);
        dispatch(loginFailure("Error while logging in"));
    }
};

export default authSlice.reducer;