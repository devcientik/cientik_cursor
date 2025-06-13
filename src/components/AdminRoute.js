import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const AdminRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; // Ou um spinner de carregamento
    }

    if (!currentUser || currentUser.tipo !== 'Administrador') {
        return <Navigate to="/inicio" replace />; // Redireciona para a página inicial
    }

    return <Outlet />;
};

export default AdminRoute; 