import './Header.css';
import {useRef} from "react";
import {FaBars, FaTimes} from "react-icons/fa";
function Navbar(){
    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle("nav");
    }

    return(
        <header>
            <nav ref={navRef}>
                
                <a href="/#">Início</a>
                <a href="/#">Minha Lista</a>
                <a href="/#">Categorias</a>
                <a href="/#">Capacitação de Professores</a>
                
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes/>
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                    <FaBars/>
            </button>
        </header>
    );
}

export default Navbar;
