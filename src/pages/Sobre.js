import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useEffect, useState, Component } from 'react';
import img_bolas from './images/marcadores-laranja.png';
import img_mark_vid_sup from './images/marcadores-cima2.png';
import img_mark_vid_inf from './images/marcadores-baixo2.png';
import './Sobre.css';
import '../components/Navbar.css';
import { Container } from "@mui/material";


const Sobre = () => {
    // variável para mudar de transparente para preto o header
    const [blackHeader, setBlackHeader] = useState(false);

    // quando o usuário dá scroll na página
    useEffect(()=>{
        const scrollListener = () => {
            console.log("Scroll detectado em Sobre.js! window.scrollY:", window.scrollY);
            if(window.scrollY>10){
            setBlackHeader(true);
            }else{
            setBlackHeader(false);
            }
            console.log("blackHeader em Sobre.js atualizado para:", blackHeader);
        }
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);  

  return (
    <div className="sobre--pagina">
      <Header black={blackHeader} />  
      <div className="sobre--titulo">
        <h1 className="sobre--titulo-texto">Cientik</h1>
      </div>
      <div className="sobre--texto-e-video">
        <div className="sobre--bolas-e-texto">        
            <div className="sobre--img-bolas">
                 <img src={img_bolas}/>
            </div>
            <div className="sobre--texto">
                <p>
                <h2>Missão</h2><br/><br/>
        Fundado em 2022, em Brasília, no Distrito Federal, o Cientik oferece uma série de recursos para apoiar o sistema público de ensino no desenvolvimento das habilidades e competências do futuro.
        Através da metodologia STEAM (Science, Technology, Engineering, Arts and Mathematics), abordagem que une as ciências, as artes e as tecnologias, o Cientik promove uma formação cidadã dos estudantes, ao mesmo tempo que os capacita para o novo mundo do trabalho.
        <br/><br/>O Cientik parte do ambiente virtual para criar impactos reais na sociedade.<br/><br/>
        Nossa missão é colocar o Brasil na vanguarda do desenvolvimento da educação tecnológica acessível, reduzindo a evasão escolar e oferecendo um ensino moderno que capacite os jovens para o trabalho na indústria 4.0 ao mesmo tempo em que investe na formação de professores para lidar com as novas tecnologias.
        Conectando as salas de aulas às demandas educacionais do século 21, o Cientik transforma a aprendizagem em uma nova experiência para todos os envolvidos na comunidade escolar.<br/><br/>
        Cientik, o conhecimento é uma viagem!
                </p> 
            </div>
        </div>
        <div className="sobre--area-video">
            <div className="sobre--area-video-mrk-sup">
                <img src={img_mark_vid_sup}/>
            </div>
            <div className="sobre--area-video-video">
                    
                    <video
                        className="video_promo"
                        src="https://d29bkgyt5q5llf.cloudfront.net/Promo/cientik_5min.mp4" 
                        autoPlay 
                        loop 
                        muted // Opcional: silenciar o vídeo
                        playsInline 
                        controls
                
                    />
                    
            </div>
            <div className="sobre--area-video-mrk-inf">
                <img src={img_mark_vid_inf}/>
            </div>
        </div>
      </div>   
      <Footer/>
    </div>
  );
};

export default Sobre;