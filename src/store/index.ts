import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import i18nReducer from './slices/i18nSlice';
import playlistReducer from './slices/playlistSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        i18n: i18nReducer,
        playlists: playlistReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
