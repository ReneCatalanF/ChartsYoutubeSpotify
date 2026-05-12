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

    useEffect(() => {
        if (user) {
            loadMyPlaylists();
        }
    }, [user]);

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
        dispatch(fetchPlaylistById({ id }));
        setViewMode('details');
    };

    const handleManualRefresh = () => {
        if (selectedPlaylist) {
            dispatch(fetchPlaylistById({ id: selectedPlaylist.id, force: true }));
        }
    };

    const renderDelta = (current: number, previous: number) => {
        const delta = current - previous;
        if (delta > 0) return <span className="delta positive"><FaArrowUp /> {delta.toLocaleString()}</span>;
        if (delta < 0) return <span className="delta negative"><FaArrowDown /> {Math.abs(delta).toLocaleString()}</span>;
        return <span className="delta neutral"><FaMinus /> 0</span>;
    };

    if (viewMode === 'details' && selectedPlaylist) {
        return (
            <div className="playlist-details-container">
                <div className="details-header">
                    <button className="back-btn" onClick={() => setViewMode('selection')}>
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
                            <div className="col">{renderDelta(song.currentViews || 0, song.previousViews || 0)}</div>
                            <div className="col">{(song.currentLikes || 0).toLocaleString()}</div>
                            <div className="col">{renderDelta(song.currentLikes || 0, song.previousLikes || 0)}</div>
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
