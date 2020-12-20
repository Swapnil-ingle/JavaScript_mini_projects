const GIT_API_URL = 'https://api.github.com/users/';

getUserByName('swapnil-ingle');

async function getUserByName(username) {
    const resp = await fetch(GIT_API_URL + username);
    const respData = await resp.json();
    createUserCard(respData);
}

function createUserCard(userData) {
    
}