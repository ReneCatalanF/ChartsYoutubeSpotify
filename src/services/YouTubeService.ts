import { YOUTUBE_CONFIG } from "./YouTubeConfig";

export interface YouTubeStats {
    viewCount: number;
    likeCount: number;
}

class YouTubeService {
    /**
     * Extrae el ID del video de YouTube desde una URL o acepta un ID directo de 11 caracteres.
     */
    extractVideoId(input: string): string | null {
        // Si ya es un ID de 11 caracteres, lo devolvemos directamente
        if (input.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return input;
        }

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * Obtiene estadísticas (vistas y likes) de un video.
     */
    async getVideoStats(videoId: string): Promise<YouTubeStats> {
        if (YOUTUBE_CONFIG.apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
            console.warn("YouTube API Key no configurada.");
            return { viewCount: 0, likeCount: 0 };
        }

        try {
            const response = await fetch(
                `${YOUTUBE_CONFIG.baseUrl}/videos?part=statistics&id=${videoId}&key=${YOUTUBE_CONFIG.apiKey}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const stats = data.items[0].statistics;
                return {
                    viewCount: parseInt(stats.viewCount) || 0,
                    likeCount: parseInt(stats.likeCount) || 0
                };
            }
            throw new Error('Video no encontrado');
        } catch (error) {
            console.error('Error fetching YouTube stats:', error);
            return { viewCount: 0, likeCount: 0 };
        }
    }
}

export const youtubeService = new YouTubeService();
