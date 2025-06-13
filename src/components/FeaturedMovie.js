import React from "react";
import './FeaturedMovie.css';

export default ({item}) => {
    //pega a data e joga em Data do Javascript
    let firstDate = new Date(item.first_air_date);
    //lega a lista de gêneros e trata ela para ser mostrada
    let genres= [];
    for(let i in item.genres){
        genres.push(item.genres[i].name);
    }

    let description = item.overview;
    if(description.length > 200){
        description = description.substring(0, 300)+'...';
    }

    // Buscar os vídeos do CloudFront
    //const videoUrl01 = 'https://d29bkgyt5q5llf.cloudfront.net/C%C3%B3digo%20X/Videos/Epis%C3%B3dio%201.mp4';

    //const videoUrl02 = 'https://d29bkgyt5q5llf.cloudfront.net/FOTOGRAFIA - COM VINI GOULART/VIDEO/CIENTIK_FOTOGRAFIA_COM_VINI_GOULART_21062022.mp4';

    //const videoUrl03 = 'https://d29bkgyt5q5llf.cloudfront.net/ROBOTICA_EM_ACAO/VIDEO/CIENTIK_ROBOTICA_EM_ACAO_EP01_220811.mp4'
    //const videoUrl04 = 'https://d29bkgyt5q5llf.cloudfront.net/Hero/CIENTIK_BANNER_PLATAFORMA_PROP_V2.mp4'

    return (
        <section className="featured" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            //backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
        }} >
            <div className="featured--vertical">
                <div className="featured--horizontal">
                    
                    <video
                        className="featured-video"
                        src="https://d29bkgyt5q5llf.cloudfront.net/Hero/CIENTIK_BANNER_PLATAFORMA_PROP_V2.mp4" 
                        autoPlay 
                        loop 
                        muted // Opcional: silenciar o vídeo
                        playsInline 
                    />
                    
                    <div className="featured--name">{item.original_name}</div>
                    <div className="featured--info">
                        <div className="featured--points">{item.vote_average} pontos</div>
                        <div className="featured--year">{firstDate.getFullYear()}</div>
                        <div className="featured--seasons">{item.number_of_seasons} temporada{item.number_of_seasons !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="featured--description">{description}</div>
                    <div className="featured--buttons">
                        <a href={`/watch/${item.id}`} className="featured--watchbutton">► Assitir</a>
                        <a href={`/list/add/${item.id}`} className="featured--mylistbutton">+ Minha Lista</a>
                    </div>
                    <div className="featured--genres"><strong>Gêneros: </strong>{genres.join(', ')}</div>
                </div>
            </div>
        </section>
    );
}