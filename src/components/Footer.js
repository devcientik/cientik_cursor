import React, { useEffect, useState, Component } from 'react';
import './Footer.css';
import '../components/Navbar.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaTiktok } from "react-icons/fa";


export default () => {
  return (
    <div className="page">
              <footer>
                <div className="footer--row">
                  <div className="footeer--row-column-left">
                      <div className="footer--texto-sobre-logo">
                          O conhecimento
                          é uma viagem.
                      </div>
                      <div className="footer--logo">
                              <a href="/">
                                <img src="https://static.cientikdemo.com/images/cientiklogo3.png" alt="Cientik"/>
                              </a>
                      </div>
                  </div>
                  <div className="footer--row-column-right"> 
                    <div className="footer--textos-direita">
                      <ul>
                          <div className='footer--menu01'>
                            <li><a href="#">Início</a></li>
                            <li><a href="/Sobre">Sobre o Cientík</a></li>
                            <li><a href="#">Categorias</a></li>
                          </div>
                          <div className='footer--menu02'>
                            <li><a href="#">Termos de uso</a></li>
                            <li><a href="#">Minha lista</a></li>
                          </div>
                          <div className='footer--menu03'>
                            <li><a href="#">Fale conosco</a></li>
                            <li><a href="#">Privacidade</a></li>
                          </div>
                        
                      </ul>
                      <ul className="social-icons">
                        <li><a href="https://www.youtube.com/channel/UCxwB0dosCONBkmXmUtIe2Hg" target='blank'><YouTubeIcon style={{fontSize: 20}}/></a></li>
                        
                        <li><a href="https://twitter.com/cientik" target='blank'><XIcon style={{fontSize: 20}}/></a></li>
                        <li><a href="https://www.instagram.com/cientik/" target='blank'><InstagramIcon style={{fontSize: 20}}/></a></li>
                        <li><a href="https://www.tiktok.com/@cientik.edu"  target='blank'><FaTiktok style={{fontSize: 20}}/></a></li>
                      </ul>
                      <p className='footer--direitos'>© 2024 Cientík. Todos os direitos reservados.</p>
                    </div>
                  </div>   
                </div>
              </footer>
    </div>
  );
}

 