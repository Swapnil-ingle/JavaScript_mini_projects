const GIT_API_URL = 'https://api.github.com/users/';
const cardEl = document.getElementById('card');
const searchFormInput = document.getElementById('search-input');
const searchForm = document.getElementById('search');
const DEF_USERNAME = 'swapnil-ingle';

loadDefaultCard();

async function loadDefaultCard() {
    _loadCardByUsername(DEF_USERNAME)
}

async function _loadCardByUsername(username) {
    const respData = await getUserByName(username);
    if (respData == null) {
        alert("No public Github profile found by the name: " + username);
        return;
    }
    createUserCard(respData);
}

async function getUserByName(username) {
    const resp = await fetch(GIT_API_URL + username);
    const respData = await resp.json();
    return respData;
}

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputUsername = searchFormInput.value;

    if (inputUsername && (inputUsername.trim()).length > 0) {
        username = inputUsername;
        _loadCardByUsername(inputUsername);
    }
});

function createUserCard(userData) {
    // Clear existing info
    _clearCard();

    // Set DP
    const dpEl = document.querySelector('.dp');
    dpEl.innerHTML = `<img src="${userData.avatar_url}" alt="profile-pic">`;

    // Set TextInfo
    const textInfoEl = document.querySelector('.text-info');
    textInfoEl.innerHTML = `
        <h3>${userData.name}</h3><br>
        <small>Software Developer</small>
        <p>${userData.bio}</p>
    `;

    // Set Button Links
    const upperBtnsEl = document.getElementById('user-info-btns-upper');
    const lowerBtnsEl = document.getElementById('user-info-btns-lower');

    upperBtnsEl.innerHTML = `
        <a href="${userData.followers_url}" target="_blank"><button><i class="fas fa-users"></i> : ${userData.followers}</button></a>
        <span><i class="fas fa-user-plus"></i> : ${userData.following}</span>
        <span><i class="fab fa-twitter"></i> : ${userData.twitter_username}</span>
        <a href="${userData.blog}" target="_blank"><button class="large-btn"><i class="fas fa-blog"></i></button></a>
    `;

    lowerBtnsEl.innerHTML = `
        <a href="${userData.html_url}" target="_blank"><button class="large-btn"><i class="fab fa-github"></i></button></a>
        <a href="${userData.html_url + '?tab=repositories'}" target="_blank"><button><i class="fas fa-book"></i> : ${userData.public_repos}</button></a>
        <span><i class="fas fa-link"></i> : ${userData.public_gists}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${userData.location}</span>
    `;
}

function _clearCard() {
    _clearElement(document.querySelector('.dp'));
    _clearElement(document.querySelector('.text-info'));
    _clearElement(document.getElementById('user-info-btns-upper'));
    _clearElement(document.getElementById('user-info-btns-lower'));
}

function _clearElement(element) {
    element.innerHTML = '';
}