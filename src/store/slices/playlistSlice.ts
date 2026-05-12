import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseDbService } from '../../services/FirebaseDatabaseService';
import { Playlist } from '../../entites/entities';

interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: Playlist | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PlaylistState = {
    playlists: [],
    selectedPlaylist: null,
    isLoading: false,
    error: null,
};

export const fetchAllPlaylists = createAsyncThunk(
    'playlists/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await firebaseDbService.getAllPlaylists();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPlaylistById = createAsyncThunk(
    'playlists/fetchById',
    async ({ id, force }: { id: string; force?: boolean }, { rejectWithValue }) => {
        try {
            const playlist = await firebaseDbService.getPlaylist(id);
            if (!playlist) return rejectWithValue('Playlist not found');
            const refreshed = await firebaseDbService.checkAndRefreshPlaylist(playlist, force);
            return refreshed;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const playlistSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        setSelectedPlaylist: (state, action: PayloadAction<Playlist | null>) => {
            state.selectedPlaylist = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPlaylists.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
                state.playlists = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAllPlaylists.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPlaylistById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action: PayloadAction<Playlist>) => {
                state.selectedPlaylist = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedPlaylist, clearError } = playlistSlice.actions;
export default playlistSlice.reducer;
