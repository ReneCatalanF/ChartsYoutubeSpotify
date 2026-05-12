import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseDbService } from '../../services/FirebaseDatabaseService';
import { AppUser } from '../../entites/entities';

interface AuthState {
    user: AppUser | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

/**
 * Obtiene los datos completos del usuario desde la base de datos (incluyendo rol y listas accesibles).
 */
export const fetchUserData = createAsyncThunk<
    AppUser,
    string,
    { rejectValue: string }
>(
    'auth/fetchUserData',
    async (uid, { rejectWithValue }) => {
        try {
            const userData = await firebaseDbService.getUserData(uid);
            if (!userData) {
                return rejectWithValue('Usuario no encontrado en la base de datos.');
            }
            return userData;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al obtener datos del usuario');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AppUser | null>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<AppUser>) => {
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
