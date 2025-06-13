import React, { useState } from 'react';
import './AdminCientik.css';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import SignUp from '../components/SignUp';

const AdminCientik = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeContent, setActiveContent] = useState('welcome');

    const isAdministrador = currentUser && currentUser.tipo === 'Administrador';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'cadastro-usuarios':
                return <SignUp />;
            case 'welcome':
            default:
                return (
                    <div className="admin-content-welcome">
                        <h2>Bem-vindo à Área Administrativa Cientik!</h2>
                        <p>Use o menu lateral para navegar pelas opções de administração.</p>
                    </div>
                );
        }
    };

    return (
        <div className="admin-cientik-container">
            <div className="admin-sidebar">
                <h3 className="sidebar-title">Menu Administrativo</h3>
                <ul className="sidebar-menu">
                    <li 
                        className={`sidebar-item ${activeContent === 'area-usuario' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveContent('area-usuario');
                            navigate('/area-usuario');
                        }}
                    >
                        Área do Usuário
                    </li>

                    {isAdministrador && (
                        <li 
                            className={`sidebar-item ${activeContent === 'cadastro-usuarios' ? 'active' : ''}`}
                            onClick={() => setActiveContent('cadastro-usuarios')}
                        >
                            Cadastro de Usuários
                        </li>
                    )}
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
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminCientik; 