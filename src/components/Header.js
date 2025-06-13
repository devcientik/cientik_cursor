import React,{useState, useEffect} from "react";
import './Header.css';
import './Navbar.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { FaUser, FaSearch } from "react-icons/fa";
import {FaBars, FaTimes} from "react-icons/fa";
import {useRef} from "react";
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';






export default({black}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    //trata do statu do botão de hanburguer
    const navRef = useRef();

    const showNavbar = () => {
        console.log("showNavbar chamado!");
        if (navRef.current) {
            navRef.current.classList.toggle("responsive_nav");
            console.log("navRef.current.className:", navRef.current.className);
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const handleUserMenuClick = (event) => {
        event.preventDefault();
        setShowUserMenu(prev => {
            console.log("Clicou no ícone do usuário. showUserMenu antes:", prev, "depois:", !prev);
            return !prev;
        });
    };

    const isProfessorGestorAdmin = currentUser && 
        (currentUser.tipo === 'Professor' || 
         currentUser.tipo === 'Gestor' || 
         currentUser.tipo === 'Administrador');

    useEffect(() => {
        console.log("currentUser no Header:", currentUser);
        console.log("Prop black no Header:", black);
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                console.log("Clicou fora do menu de usuário. Fechando menu.");
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef, currentUser]);


    return (
    <div>


        <header className={black ? 'black' : 'trans'}>
            <div className="header--logo">
                <a href="/inicio">
                  <img src="https://static.cientikdemo.com/images/cientiklogo3.png" alt="Cientik"/>
                </a>
            </div>
            
            <div className="header--menu"> {/* Links de navegação para desktop - Conforme nova imagem */}
                <a href="/inicio" className="header--menu--text">
                    <HomeOutlinedIcon style={{fontSize: 20}}/>
                    Início
                </a>
                <a href="/" className="header--menu--text">
                    <FormatListBulletedOutlinedIcon style={{fontSize: 20}}/>
                    Minha Lista
                </a>
                <a href="/" className="header--menu--text">
                    <CategoryOutlinedIcon style={{fontSize: 20}}/>
                    Categorias 
                </a>
                <a href="/" className="header--menu--text">
                    <SchoolOutlinedIcon style={{fontSize: 20}}/>
                    Capacitação de Professores 
                </a>
            </div>

            <div className="header--search-section"> {/* Seção de Busca - Conforme nova imagem */}
                <input 
                    type="text" 
                    placeholder="Procurar" 
                    className="search-input" 
                />
                <button className="search-button">
                    <FaSearch />
                </button>
            </div>

            <nav ref={navRef}> {/* Este é o menu lateral mobile, deve ser oculto em desktop via CSS */}
                
                <a href="/inicio">Início</a>
                <a href="/#">Minha Lista</a>
                <a href="/#">Categorias</a>
                <a href="/#">Capacitação de Professores</a>
                
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes/>
                </button>
            </nav>
            
            <div className="header--user"> {/* User icon and name - agora filho direto do header */} 
                <a href="#" onClick={handleUserMenuClick} className="user-icon-link">
                    <FaUser className="user-avatar-icon" />
                    {currentUser ? (
                        <span className="user-email-display">
                            {currentUser.nome} {currentUser.sobrenome}
                        </span>
                    ) : (
                        <span className="user-email-display">Carregando...</span>
                    )}
                </a>
                {showUserMenu && currentUser && (
                    <div className="user-menu-dropdown" ref={userMenuRef}>
                        <div className="user-menu-item" onClick={() => navigate('/area-usuario')}>
                            Área do Usuário
                        </div>
                        {currentUser && currentUser.tipo === 'Administrador' && (
                            <div className="user-menu-item" onClick={() => navigate('/admin/cientik')}>
                                Admin Cientik
                            </div>
                        )}
                        {isProfessorGestorAdmin && (
                            <div className="user-menu-item" onClick={() => navigate('/dados-analiticos')}>
                                Dados Analíticos
                            </div>
                        )}
                        <div className="user-menu-item" onClick={handleLogout}>
                            Sair
                        </div>
                    </div>
                )}
            </div>
            {/* O botão hambúrguer será controlado por CSS para aparecer apenas em mobile */}
            <button id="botao-han" className="nav-btn" onClick={showNavbar}> {/* Botão hambúrguer para mobile */} 
                <FaBars/>
            </button>
        </header>
    </div>
    )
}