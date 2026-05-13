export interface Song {
    id: string; // Internal unique ID
    name: string;
    author?: string;
    youtubeId: string; // The ID extracted from the URL
    currentViews: number;
    currentLikes: number;
    previousViews?: number;
    previousLikes?: number;
}

export interface Playlist {
    id: string;
    name: string;
    author?: string;
    lastUpdate: string; // ISO String (used for the 20-minute check)
    status: 'active' | 'inactive';
    songs: Song[]; // Limited to 10
}

export type UserRole = 'admin' | 'user';

export interface AppUser {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    accessiblePlaylists: string[]; // Array of playlist IDs
}
