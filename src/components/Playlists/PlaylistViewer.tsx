import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlaylistById } from '../../store/slices/playlistSlice';
import { firebaseDbService } from '../../services/FirebaseDatabaseService';
import { Playlist } from '../../entites/entities';
import { FaArrowUp, FaArrowDown, FaMinus, FaSync, FaChevronLeft } from 'react-icons/fa';
import './PlaylistViewer.css';

const PlaylistViewer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { selectedPlaylist, isLoading } = useAppSelector(state => state.playlists);
    
    const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
    const [viewMode, setViewMode] = useState<'selection' | 'details'>('selection');
    
    // Almacenamos el snapshot "previo" localmente para esta sesión
    const [previousSnapshot, setPreviousSnapshot] = useState<Playlist | null>(null);

    useEffect(() => {
        if (user) {
            loadMyPlaylists();
        }
    }, [user]);

    // Cuando cambia la lista seleccionada o termina de cargar, 
    // si no teníamos snapshot previo, lo tomamos de la primera carga.
    useEffect(() => {
        if (selectedPlaylist && !previousSnapshot && !isLoading) {
            setPreviousSnapshot(selectedPlaylist);
        }
    }, [selectedPlaylist, isLoading, previousSnapshot]);

    const loadMyPlaylists = async () => {
        if (!user) return;
        try {
            let all = await firebaseDbService.getAllPlaylists();
            if (user.role !== 'admin') {
                all = all.filter(p => user.accessiblePlaylists?.includes(p.id));
            }
            setMyPlaylists(all);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectPlaylist = (id: string) => {
        setPreviousSnapshot(null); // Reset snapshot al cambiar de lista
        dispatch(fetchPlaylistById({ id }));
        setViewMode('details');
    };

    const handleManualRefresh = () => {
        if (selectedPlaylist) {
            // Antes de refrescar, el "actual" pasa a ser el "previo" local
            setPreviousSnapshot(selectedPlaylist);
            dispatch(fetchPlaylistById({ id: selectedPlaylist.id, force: true }));
        }
    };

    const renderDelta = (current: number, songId: string, type: 'views' | 'likes') => {
        if (!previousSnapshot) return <span className="delta neutral"><FaMinus /> 0</span>;
        
        const previousSong = previousSnapshot.songs?.find(s => s.id === songId);
        if (!previousSong) return <span className="delta neutral"><FaMinus /> 0</span>;

        const previousValue = type === 'views' ? (previousSong.currentViews || 0) : (previousSong.currentLikes || 0);
        const delta = current - previousValue;
        
        if (delta > 0) return <span className="delta positive"><FaArrowUp /> {delta.toLocaleString()}</span>;
        if (delta < 0) return <span className="delta negative"><FaArrowDown /> {Math.abs(delta).toLocaleString()}</span>;
        return <span className="delta neutral"><FaMinus /> 0</span>;
    };

    if (viewMode === 'details' && selectedPlaylist) {
        return (
            <div className="playlist-details-container">
                <div className="details-header">
                    <button className="back-btn" onClick={() => { setViewMode('selection'); setPreviousSnapshot(null); }}>
                        <FaChevronLeft /> Volver
                    </button>
                    <h2>{selectedPlaylist.name}</h2>
                    <div className="last-update">
                        <span>Última actualización: {new Date(selectedPlaylist.lastUpdate).toLocaleString()}</span>
                        <button 
                            className={`refresh-btn ${isLoading ? 'spinning' : ''}`} 
                            onClick={handleManualRefresh}
                            disabled={isLoading}
                            title="Refrescar estadísticas ahora"
                        >
                            <FaSync />
                        </button>
                    </div>
                </div>

                <div className="songs-table">
                    <div className="table-header">
                        <div className="col">Canción</div>
                        <div className="col">Vistas Actuales</div>
                        <div className="col">Diferencia Vistas</div>
                        <div className="col">Likes Actuales</div>
                        <div className="col">Diferencia Likes</div>
                    </div>
                    {selectedPlaylist.songs?.map(song => (
                        <div key={song.id} className="table-row">
                            <div className="col song-name">
                                <strong>{song.name}</strong>
                                <span>{song.author}</span>
                            </div>
                            <div className="col">{(song.currentViews || 0).toLocaleString()}</div>
                            <div className="col">{renderDelta(song.currentViews || 0, song.id, 'views')}</div>
                            <div className="col">{(song.currentLikes || 0).toLocaleString()}</div>
                            <div className="col">{renderDelta(song.currentLikes || 0, song.id, 'likes')}</div>
                        </div>
                    ))}
                    {(!selectedPlaylist.songs || selectedPlaylist.songs.length === 0) && (
                        <div className="no-songs">Esta lista no tiene canciones aún.</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-selection-container">
            <h1>Mis Listas de Seguimiento</h1>
            <div className="selection-grid">
                {myPlaylists.map(list => (
                    <div key={list.id} className="selection-card" onClick={() => handleSelectPlaylist(list.id)}>
                        <h3>{list.name}</h3>
                        <p>{list.author}</p>
                        <span>{list.songs?.length || 0} canciones</span>
                    </div>
                ))}
                {myPlaylists.length === 0 && (
                    <div className="no-access">No tienes listas asignadas todavía.</div>
                )}
            </div>
        </div>
    );
};

export default PlaylistViewer;
