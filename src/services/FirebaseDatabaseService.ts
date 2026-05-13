import { ref, get, set, update, push } from 'firebase/database';
import { db } from './FirebaseStorage';
import { Playlist, AppUser, Song } from '../entites/entities';
import { youtubeService } from './YouTubeService';

export class FirebaseDatabaseService {
    // === USUARIOS ===
    async getUserData(uid: string): Promise<AppUser | null> {
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() as AppUser : null;
    }

    async saveUser(user: AppUser): Promise<void> {
        await set(ref(db, `users/${user.uid}`), user);
    }

    async getAllUsers(): Promise<AppUser[]> {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (!snapshot.exists()) return [];
        const data = snapshot.val();
        return Object.keys(data).map(uid => ({ ...data[uid], uid }));
    }

    async assignPlaylistsToUser(uid: string, playlistIds: string[]): Promise<void> {
        await update(ref(db, `users/${uid}`), { accessiblePlaylists: playlistIds });
    }

    // === LISTAS (PLAYLISTS) ===
    async createPlaylist(playlist: Omit<Playlist, 'id'>): Promise<string> {
        const playlistsRef = ref(db, 'playlists');
        const newPlaylistRef = push(playlistsRef);
        const id = newPlaylistRef.key!;
        await set(newPlaylistRef, { ...playlist, id });
        return id;
    }

    async getPlaylist(id: string): Promise<Playlist | null> {
        const playlistRef = ref(db, `playlists/${id}`);
        const snapshot = await get(playlistRef);
        return snapshot.exists() ? snapshot.val() as Playlist : null;
    }

    async getAllPlaylists(): Promise<Playlist[]> {
        const playlistsRef = ref(db, 'playlists');
        const snapshot = await get(playlistsRef);
        if (!snapshot.exists()) return [];
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ ...data[key], id: key }));
    }

    async updatePlaylist(id: string, data: Partial<Playlist>): Promise<void> {
        await update(ref(db, `playlists/${id}`), data);
    }

    async deletePlaylist(id: string): Promise<void> {
        await set(ref(db, `playlists/${id}`), null);
    }

    /**
     * Lógica central: Revisa si pasaron 20 minutos y actualiza stats de YouTube.
     */
    async checkAndRefreshPlaylist(playlist: Playlist, force: boolean = false): Promise<Playlist> {
        const now = new Date();
        const lastUpdate = new Date(playlist.lastUpdate || 0);
        const diffInMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

        // Si pasaron más de 20 minutos O si es forzado, actualizamos
        if (force || diffInMinutes >= 20) {
            console.log(`Actualizando stats para la lista: ${playlist.name}`);
            
            const songsToUpdate = playlist.songs || [];
            
            const updatedSongs: Song[] = await Promise.all(
                songsToUpdate.map(async (song) => {
                    const newStats = await youtubeService.getVideoStats(song.youtubeId);
                    return {
                        ...song,
                        currentViews: newStats.viewCount,
                        currentLikes: newStats.likeCount
                    };
                })
            );

            const updatedPlaylist: Playlist = {
                ...playlist,
                songs: updatedSongs,
                lastUpdate: now.toISOString()
            };

            // Solo guardamos currentViews y currentLikes en DB
            await this.updatePlaylist(playlist.id, {
                songs: updatedSongs,
                lastUpdate: updatedPlaylist.lastUpdate
            });
            return updatedPlaylist;
        }

        return playlist;
    }
}

export const firebaseDbService = new FirebaseDatabaseService();
