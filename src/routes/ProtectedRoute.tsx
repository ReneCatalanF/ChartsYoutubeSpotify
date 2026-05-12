import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext'; // ¡ELIMINA ESTA LÍNEA!

// Importa tu hook tipado de Redux
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Usa useAppSelector para obtener el estado del usuario y el estado de carga desde Redux
    const { user, isLoading } = useAppSelector((state) => state.auth);

    // Si aún estamos cargando la información de autenticación, muestra un mensaje o un spinner
    // Esto previene redirecciones "flash" mientras Firebase comprueba el estado del usuario.
    if (isLoading) {
        return <div>Cargando autenticación...</div>; // Considera usar un componente de carga real aquí
    }

    // Si no hay usuario (y ya terminamos de cargar), redirige a la página de login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay usuario y no está cargando, permite el acceso a la ruta
    return children;
};