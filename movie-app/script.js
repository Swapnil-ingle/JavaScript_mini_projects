const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const moviesContainerEl = document.getElementById('movies-container');

getMovies();

async function getMovies() {
    const resp = await fetch(API_URL);
    const respData = await resp.json();

    console.log(respData);

    respData.results.forEach((movie) => {
        const imgPath = IMG_PATH + movie.poster_path;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${imgPath}" alt="${movie.title}">

            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span>${movie.vote_average}</span>
            </div>
        `;

        moviesContainerEl.appendChild(movieEl);
    });
    return respData;
}