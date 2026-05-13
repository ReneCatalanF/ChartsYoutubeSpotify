import React, {
    createContext, useEffect, useState,
    ReactNode
} from 'react';
import { authService } from '../services/AuthServide';
import { firebaseDbService } from '../services/FirebaseDatabaseService';
import { Role } from '../services/IAuthService';


interface AuthContextProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any | null;
    role: Role | null;
}
export const AuthContext =
    createContext<AuthContextProps>({
        user: null,
        role: null
    });
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<unknown | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userData = await firebaseDbService.getUserData(currentUser.uid);
                    setRole(userData?.role || 'user');
                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                    setRole('user');
                }
            }
            else {
                setRole(null);
            }
        });
        return unsubscribe;
    }, []);
    return (
        <AuthContext.Provider value={{ user, role }}>
            {children}
        </AuthContext.Provider>
    );
};