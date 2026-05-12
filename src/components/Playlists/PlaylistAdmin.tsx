import React, { useState, useEffect } from 'react';
import { Playlist, Song } from '../../entites/entities';
import { firebaseDbService } from '../../services/FirebaseDatabaseService';
import { youtubeService } from '../../services/YouTubeService';
import { useIntl } from 'react-intl';
import { FaTrash, FaPlus, FaMusic, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './PlaylistAdmin.css';

const PlaylistAdmin: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modales
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isSongModalOpen, setIsSongModalOpen] = useState(false);
    
    // Estados para crear/editar lista
    const [listForm, setListForm] = useState({ id: '', name: '', author: '' });
    const [isEditingList, setIsEditingList] = useState(false);
    
    // Estados para gestión de canciones
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [songForm, setSongForm] = useState({ id: '', name: '', author: '', url: '' });
    const [isEditingSong, setIsEditingSong] = useState(false);

    const intl = useIntl();

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        setLoading(true);
        try {
            const data = await firebaseDbService.getAllPlaylists();
            setPlaylists(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePlaylist = async () => {
        if (!listForm.name) return;
        try {
            if (isEditingList) {
                await firebaseDbService.updatePlaylist(listForm.id, { 
                    name: listForm.name, 
                    author: listForm.author 
                });
            } else {
                await firebaseDbService.createPlaylist({
                    name: listForm.name,
                    author: listForm.author,
                    lastUpdate: new Date().toISOString(),
                    status: 'active',
                    songs: []
                });
            }
            setListForm({ id: '', name: '', author: '' });
            setIsListModalOpen(false);
            setIsEditingList(false);
            loadPlaylists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenEditList = (list: Playlist) => {
        setListForm({ id: list.id, name: list.name, author: list.author || '' });
        setIsEditingList(true);
        setIsListModalOpen(true);
    };

    const handleDeletePlaylist = async (id: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta lista por completo?")) {
            try {
                await firebaseDbService.deletePlaylist(id);
                loadPlaylists();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSaveSong = async () => {
        if (!selectedPlaylist || !songForm.name || !songForm.url) return;
        
        const youtubeId = youtubeService.extractVideoId(songForm.url);
        if (!youtubeId) {
            alert("URL o ID de YouTube no válido");
            return;
        }

        let updatedSongs = [...(selectedPlaylist.songs || [])];

        if (isEditingSong) {
            updatedSongs = updatedSongs.map(s => s.id === songForm.id ? { 
                ...s, 
                name: songForm.name, 
                author: songForm.author, 
                youtubeId: youtubeId 
            } : s);
        } else {
            if (updatedSongs.length >= 10) {
                alert(intl.formatMessage({ id: 'playlist.songLimitAlert' }));
                return;
            }
            updatedSongs.push({
                id: Date.now().toString(),
                name: songForm.name,
                author: songForm.author,
                youtubeId: youtubeId,
                currentViews: 0,
                currentLikes: 0,
                previousViews: 0,
                previousLikes: 0
            });
        }

        try {
            await firebaseDbService.updatePlaylist(selectedPlaylist.id, { songs: updatedSongs });
            setSelectedPlaylist({ ...selectedPlaylist, songs: updatedSongs });
            setSongForm({ id: '', name: '', author: '', url: '' });
            setIsEditingSong(false);
            loadPlaylists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSong = (song: Song) => {
        setSongForm({ 
            id: song.id, 
            name: song.name, 
            author: song.author || '', 
            url: song.youtubeId 
        });
        setIsEditingSong(true);
    };

    const handleDeleteSong = async (songId: string) => {
        if (!selectedPlaylist) return;
        const updatedSongs = selectedPlaylist.songs.filter(s => s.id !== songId);
        try {
            await firebaseDbService.updatePlaylist(selectedPlaylist.id, { songs: updatedSongs });
            setSelectedPlaylist({ ...selectedPlaylist, songs: updatedSongs });
            loadPlaylists();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-12 text-center text-bts-purple-light text-xl">Cargando gestión de listas...</div>;

    return (
        <div className="playlist-admin-container">
            <div className="header flex justify-between items-center mb-10">
                <h1>Panel de Control</h1>
                <button className="add-btn confirm-btn" onClick={() => { 
                    setListForm({ id: '', name: '', author: '' }); 
                    setIsEditingList(false); 
                    setIsListModalOpen(true); 
                }}>
                    <FaPlus /> Crear Lista
                </button>
            </div>

            <div className="playlist-grid">
                {playlists.map(list => (
                    <div key={list.id} className="playlist-card">
                        <div className="card-header">
                            <h3>{list.name}</h3>
                            <button className="edit-icon-btn" onClick={() => handleOpenEditList(list)}>
                                <FaEdit />
                            </button>
                        </div>
                        <p className="author-text">{list.author || 'Sin autor'}</p>
                        <div className="songs-count">
                            {list.songs?.length || 0} / 10 canciones
                        </div>
                        <div className="card-actions-row">
                            <button className="manage-songs-btn" onClick={() => { setSelectedPlaylist(list); setIsSongModalOpen(true); }}>
                                <FaMusic /> Gestionar Canciones
                            </button>
                            <button className="delete-btn" onClick={() => handleDeletePlaylist(list.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para Crear/Editar Lista */}
            {isListModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEditingList ? 'Editar Lista' : 'Nueva Lista'}</h2>
                        <div className="form-group">
                            <label>Nombre de la lista</label>
                            <input 
                                placeholder="Ej: Top 10 Billboard" 
                                value={listForm.name}
                                onChange={e => setListForm({...listForm, name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Autor / Descripción</label>
                            <input 
                                placeholder="Nombre del autor" 
                                value={listForm.author}
                                onChange={e => setListForm({...listForm, author: e.target.value})}
                            />
                        </div>
                        <div className="modal-footer flex gap-4 justify-end mt-4">
                            <button className="cancel-btn" onClick={() => setIsListModalOpen(false)}>Cancelar</button>
                            <button className="confirm-btn" onClick={handleSavePlaylist}>
                                {isEditingList ? 'Guardar Cambios' : 'Crear Lista'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Gestión de Canciones */}
            {isSongModalOpen && selectedPlaylist && (
                <div className="modal-overlay">
                    <div className="modal large">
                        <div className="modal-header flex justify-between items-center mb-6">
                            <h2>Canciones: {selectedPlaylist.name}</h2>
                            <button className="close-x" onClick={() => { setIsSongModalOpen(false); setIsEditingSong(false); }}>
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="add-song-box p-6 bg-bts-black/40 rounded-xl mb-8 border border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="form-group">
                                    <label>Nombre de la canción</label>
                                    <input 
                                        placeholder="Ej: Dynamite" 
                                        value={songForm.name}
                                        onChange={e => setSongForm({...songForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>YouTube URL o ID</label>
                                    <input 
                                        placeholder="URL del video o ID de 11 caracteres" 
                                        value={songForm.url}
                                        onChange={e => setSongForm({...songForm, url: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="save-song-btn confirm-btn" onClick={handleSaveSong}>
                                    {isEditingSong ? <><FaSave /> Guardar Cambios</> : <><FaPlus /> Añadir Canción</>}
                                </button>
                                {isEditingSong && (
                                    <button className="cancel-edit-btn" onClick={() => {
                                        setSongForm({ id: '', name: '', author: '', url: '' });
                                        setIsEditingSong(false);
                                    }}>
                                        Cancelar Edición
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="song-management-list max-h-[400px] overflow-y-auto pr-2">
                            {selectedPlaylist.songs?.map(song => (
                                <div key={song.id} className="song-admin-item flex justify-between items-center p-4 bg-white/5 rounded-lg mb-2 border border-white/5">
                                    <div className="song-meta">
                                        <div className="font-bold text-white text-lg">{song.name}</div>
                                        <div className="text-bts-text-secondary text-sm">ID: {song.youtubeId}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="edit-action-btn" onClick={() => handleEditSong(song)}>
                                            <FaEdit />
                                        </button>
                                        <button className="delete-action-btn text-red-400" onClick={() => handleDeleteSong(song.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!selectedPlaylist.songs || selectedPlaylist.songs.length === 0) && (
                                <div className="text-center py-8 text-bts-text-secondary italic">
                                    No hay canciones en esta lista. Añade la primera arriba.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistAdmin;
