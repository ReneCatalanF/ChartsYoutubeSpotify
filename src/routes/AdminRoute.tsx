import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return <div className="p-8 text-center">Verificando permisos de administrador...</div>;
    }

    if (!user || user.role !== 'admin') {
        console.warn("Acceso denegado: Se requiere rol de administrador.");
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
