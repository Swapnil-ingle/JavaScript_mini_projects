const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';

const moviesContainerEl = document.getElementById('movies-container');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showMovies(respData.results);
}

function getClassByRate(vote) {
    if (vote > 7.5) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        showMovies(getMovies(SEARCH_API + searchTerm));
        search.value = '';
    }
});

function showMovies(movies) {
    // Clear main
    moviesContainerEl.innerHTML = "";

    movies.forEach((movie) => {
        let imgPath = './media/img/404_Img_Not_Found.png';
        if (movie.poster_path != null) {
            imgPath = IMG_PATH + movie.poster_path;
        }
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${imgPath}" alt="${movie.title}">

            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class=${getClassByRate(movie.vote_average)}>${movie.vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview:</h3>
                ${movie.overview}
            </div>
        `;

        moviesContainerEl.appendChild(movieEl);
    });
}