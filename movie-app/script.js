var currPageNum = 1;

const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';

const moviesContainerEl = document.getElementById('movies-container');
const form = document.getElementById('form');
const search = document.getElementById('search');
const pageNumberEl = document.getElementById('page-number');

const nextPageBtn = document.getElementById('next-page-btn');
const prevPageBtn = document.getElementById('prev-page-btn');

const PAGES_TO_SHOW = 5; // Works only for odd number of pages

getMovies(API_URL + currPageNum);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showMovies(respData.results);
    renderPageNumbers();
}

function renderPageNumbers() {
    // Clear the stale page numbers
    pageNumberEl.innerHTML = '';

    let firstPageToShow = 1;
    let lastPastToShow = PAGES_TO_SHOW;
    
    if (currPageNum != 1) {
        firstPageToShow = Math.ceil((currPageNum - (PAGES_TO_SHOW / 2)) > 1 ? 
            (currPageNum - (PAGES_TO_SHOW / 2)) : 1);
        lastPastToShow = Math.floor(currPageNum + (PAGES_TO_SHOW / 2)) < PAGES_TO_SHOW ?
            PAGES_TO_SHOW : Math.floor(currPageNum + (PAGES_TO_SHOW / 2));
    }

    for (let i=firstPageToShow;i<=lastPastToShow;i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.remove('current-page');
        pageBtn.classList.add('page-number-btn');

        if (i == currPageNum) {
            pageBtn.classList.add('current-page');
        }

        pageBtn.innerText = i;

        pageBtn.addEventListener('click', e => {
            const newPageNum = parseInt(pageBtn.innerText);
            currPageNum = newPageNum;
            getMovies(API_URL + currPageNum);
        });

        pageNumberEl.appendChild(pageBtn);
    }
    
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

nextPageBtn.addEventListener('click', e => {
    _paginate('next');
});

prevPageBtn.addEventListener('click', e => {
    _paginate('prev');
});

function _paginate(goTo) {
    pageNumberEl.childNodes.forEach(child => {
        if (child.classList.contains('current-page')) {
            const currPage = parseInt(child.innerText);
            currPageNum = goTo == 'next' ? currPage + 1 : 
                (currPage == 1 ? 1 : currPage - 1);
            getMovies(API_URL + currPageNum);
        }
    });
}