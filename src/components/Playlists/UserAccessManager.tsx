import React, { useState, useEffect } from 'react';
import { AppUser, Playlist } from '../../entites/entities';
import { firebaseDbService } from '../../services/FirebaseDatabaseService';
import { FaUserShield, FaUser, FaCheckSquare, FaSquare } from 'react-icons/fa';
import './UserAccessManager.css';

const UserAccessManager: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, playlistsData] = await Promise.all([
                firebaseDbService.getAllUsers(),
                firebaseDbService.getAllPlaylists()
            ]);
            setUsers(usersData);
            setPlaylists(playlistsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const togglePlaylistAccess = async (playlistId: string) => {
        if (!selectedUser) return;
        
        const currentAccess = selectedUser.accessiblePlaylists || [];
        const newAccess = currentAccess.includes(playlistId)
            ? currentAccess.filter(id => id !== playlistId)
            : [...currentAccess, playlistId];

        try {
            await firebaseDbService.assignPlaylistsToUser(selectedUser.uid, newAccess);
            // Actualizar estado local
            setSelectedUser({ ...selectedUser, accessiblePlaylists: newAccess });
            setUsers(users.map(u => u.uid === selectedUser.uid ? { ...u, accessiblePlaylists: newAccess } : u));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div className="access-manager-container">
            <h1>Gestión de Acceso de Usuarios</h1>
            
            <div className="manager-layout">
                <div className="user-list">
                    {users.map(user => (
                        <div 
                            key={user.uid} 
                            className={`user-item ${selectedUser?.uid === user.uid ? 'active' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                            <div className="user-info">
                                <strong>{user.name || user.email}</strong>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="access-panel">
                    {selectedUser ? (
                        <>
                            <h2>Acceso para: {selectedUser.name || selectedUser.email}</h2>
                            <p>Selecciona las listas a las que este usuario puede acceder:</p>
                            <div className="playlist-selection-list">
                                {playlists.map(list => {
                                    const hasAccess = selectedUser.accessiblePlaylists?.includes(list.id);
                                    return (
                                        <div 
                                            key={list.id} 
                                            className="access-toggle-item"
                                            onClick={() => togglePlaylistAccess(list.id)}
                                        >
                                            {hasAccess ? <FaCheckSquare className="checked" /> : <FaSquare />}
                                            <span>{list.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="no-user-selected">
                            Selecciona un usuario para gestionar su acceso.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAccessManager;
