import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "@/app/redux/features/authSlice"
import blockReducer from "@/app/redux/features/blockSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        block: blockReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;