import React from 'react';
import './AdminCientik.css';
import { useAuth } from '../services/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const AdminCientik = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdministrador = currentUser && currentUser.tipo === 'Administrador';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <div className="admin-cientik-container">
            <div className="admin-sidebar">
                <img src="/cientiklogo.png" alt="Cientik Logo" className="sidebar-logo" />
                <h3 className="sidebar-title">Menu Administrativo</h3>
                <ul className="sidebar-menu">
                    <li 
                        className={`sidebar-item${location.pathname === '/area-usuario' ? ' active' : ''}`}
                        onClick={() => navigate('/area-usuario')}
                    >
                        Área do Usuário
                    </li>
                    {isAdministrador && (
                        <li 
                            className={`sidebar-item${location.pathname === '/admin/cientik/cadastro-usuarios' ? ' active' : ''}`}
                            onClick={() => navigate('/admin/cientik/cadastro-usuarios')}
                        >
                            Cadastro de Usuários
                        </li>
                    )}
                    <li 
                        className={`sidebar-item${location.pathname === '/admin/cientik/cursos' ? ' active' : ''}`}
                        onClick={() => navigate('/admin/cientik/cursos')}
                    >
                        Cursos
                    </li>
                    <li 
                        className="sidebar-item"
                        onClick={() => navigate('/inicio')}
                    >
                        Voltar para o Cientik
                    </li>
                    <li 
                        className="sidebar-item"
                        onClick={handleLogout}
                    >
                        Sair
                    </li>
                </ul>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminCientik; 