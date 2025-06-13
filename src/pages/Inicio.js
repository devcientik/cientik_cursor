import React, { useEffect, useState, Component } from 'react';
import './Inicio.css';
import '../components/Navbar.css';
import Tmdb from '../tmdb';
import MovieRow from '../components/MovieRow';
import FeaturedMovie from '../components/FeaturedMovie';
import Header from '../components/Header';
import Footer from '../components/Footer';



export default () => {
  //cria lista de filmes
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeatureData] = useState(null); 
  const [blackHeader, setBlackHeader] = useState(false);

  //quando a página carrega, busca a lista de filmes
  useEffect(() => {
    const loadAll = async () => {

      //Pegando a lista completa de filmes e categorias
      let list = await Tmdb.getHomeList();
      console.log(list);
      //manda para o setMovieList
      setMovieList(list);  

      //Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen  = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];

      
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id,'tv');
      setFeatureData(chosenInfo);
    }
    loadAll();
  },[]);

  // quando o usuário dá scroll na página
  useEffect(()=>{
    const scrollListener = () => {
      console.log("Scroll detectado! window.scrollY:", window.scrollY);
      if(window.scrollY>10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
      console.log("blackHeader atualizado para:", blackHeader);
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  }, []);


  return (

    <div className="page">
                    
              {/*
              <React.Fragment>
                <Navbar/>
              </React.Fragment>
              */}
              <Header black={blackHeader} />
              
              {featuredData &&
                <FeaturedMovie item={featuredData}/>
              }
              
              <section className='lists'>
                  {movieList.map((item,key)=>(
                    <MovieRow key={key} title={item.title} items={item.items} />
                  ))}
              </section>

              <Footer />
              {movieList.length <= 0 &&
                <div className='loading'>
                  <img src="https://i.gifer.com/8Etj.gif" alt="Carregando"/>
                </div>    
              }
     
    </div>
  );
}

 