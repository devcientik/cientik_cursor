const API_KEY = '2ef32f6a9faad00eb49873b73185875b';
const API_BASE = 'https://api.themoviedb.org/3';

/*
Dados que vamos buscar na API do Tmdb
-originais da netflix
-recomendados (trending)
-em alta (top rated)
-ação
-comédia
-terror
-romance
_documentários
*/

const basicFetch = async (_endpoint) => {
    const req = await fetch(`${API_BASE}${_endpoint}`);
    const json = await req.json();
    //console.log(json);
    return json;
}

export default{
    getHomeList: async () => {
        return [
            {
                slug:'originals',
                title: 'Originais do Netflix',
                items: await basicFetch(`/discover/tv?with_network=213&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'trending',
                title:'Recomendados para Você',
                items: await basicFetch(`/trending/all/week?language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'top rated',
                title:'Em Alta',
                items: await basicFetch(`/movie/top_rated?language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'action',
                title:'Ação',
                items: await basicFetch(`/discover/movie?with_genres=28&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'comedy',
                title:'Comédia',
                items: await basicFetch(`/discover/movie?with_genres=35&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'horror',
                title:'Terror',
                items: await basicFetch(`/discover/movie?with_genres=27&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'romance',
                title:'Romance',
                items: await basicFetch(`/discover/movie?with_genres=10749&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug:'documentary',
                title:'Documentário',
                items: await basicFetch(`/discover/movie?with_genres=99&language=pt-BR&api_key=${API_KEY}`)
            },
        ];
    },
    getMovieInfo: async (movieId, type)=>{
        let info = {};
        if(movieId){
            switch(type){
                case 'movie':
                    info = await basicFetch(`/movie/${movieId}?language=pt-BR&api_key=${API_KEY}`)
                break;
                case 'tv':
                    info = await basicFetch(`/tv/${movieId}?language=pt-BR&api_key=${API_KEY}`)
                break;
                default:
                    info = null;
                    break;
            }
        }
        return info;
    }
}