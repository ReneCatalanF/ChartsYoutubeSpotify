import React, {
    createContext, useEffect, useState,
    ReactNode
} from 'react';
import { authService } from '../services/AuthServide';
import { Role } from '../services/IAuthService';


interface AuthContextProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any | null;
    roles: Role[] | null;
}
export const AuthContext =
    createContext<AuthContextProps>({
        user: null,
        roles: null
    });
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<unknown | null>(null);
    const [roles, setRoles] = useState<Role[] | null>(null);
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userRoles = await authService.getUserRoles(currentUser);
                    setRoles(userRoles);
                } catch (error) {
                    console.error('Error al obtener los roles:', error);
                    setRoles(null);
                }
            }
            else {
                setRoles(null);
            }
        });
        return unsubscribe;
    }, []);
    return (
        <AuthContext.Provider value={{ user, roles }}>
            {children}
        </AuthContext.Provider>
    );
};