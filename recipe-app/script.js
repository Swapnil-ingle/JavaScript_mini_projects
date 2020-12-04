const meals = document.getElementById('meals');
const favMealsList = document.getElementById('fav-meals');
const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const randomMeal = await _extractMealDataFromAPI("https://www.themealdb.com/api/json/v1/1/random.php")

    _addMeal(randomMeal, true)
    return randomMeal;
}

async function getMealById(id) {
    return await _extractMealDataFromAPI("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
}

async function getMealsBySearch(term) {
    const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term;
    return await _extractMealDataFromAPI(apiUrl, false);
}

async function _extractMealDataFromAPI(apiEndpointURL, limit = true) {
    const resp = await fetch(apiEndpointURL);
    const respData = await resp.json();
    return limit ? respData.meals[0] : respData.meals;
}

function _addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    let randomRecipeHeaderHTML = `<span class="random">Random Recipe</span>`;

    meal.innerHTML = `
        <div class="meal-header">
            ${random ? randomRecipeHeaderHTML : ""}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button value="${mealData.idMeal}" class="fav-btn" id="fav-btn"><i class="fas fa-heart"></i>
            </button>
        </div>
    `;

    const favBtn = meal.querySelector(".meal-body .fav-btn");
    favBtn.addEventListener('click', () => {
        if (favBtn.classList.contains("active")) {
            _removeMealFromLocalStorage(mealData.idMeal);
            favBtn.classList.remove("active");
        } else {
            _addMealToLocalStorage(mealData.idMeal);
            favBtn.classList.add("active");
        }
    
        fetchFavMeals();
    });

    meal.classList.add('meal');
    meals.appendChild(meal);
}

async function fetchFavMeals() {
    // Clean container and refresh fav meals list
    favMealsList.innerHTML = "";
    const mealIds = _getMealsFromLocalStorage();

    if (mealIds.length == 0) {
        const noFavMealsAddedSpan = document.createElement('span');
        noFavMealsAddedSpan.innerHTML = `Like a recipe to start tracking`;
        favMealsList.appendChild(noFavMealsAddedSpan);
    }

    for (let i=0; i<mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealToFav(meal);
    }
}

function addMealToFav(mealData) {
    const favMeal = document.createElement("div");

    favMeal.innerHTML = `
        <button value=${mealData.idMeal} onClick="removeMealFromFav(this.value)" class="clearFavMeal">
            <i class="fas fa-times-circle"></i>
        </button>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><br>
        <span>${mealData.strMeal}</span>
    `;

    favMealsList.appendChild(favMeal);
}

function removeMealFromFav(mealId) {
    _removeMealFromLocalStorage(mealId);
    fetchFavMeals();
}

searchBtn.addEventListener('click', async () => {
    const searchKey = searchTerm.value;
    
    if (searchKey.length <= 0) {
        return;
    }

    const meals = await getMealsBySearch(searchKey);
    meals.forEach((meal) => {
        _addMeal(meal);
    });
});

function _addMealToLocalStorage(mealId) {
    const mealIds = _getMealsFromLocalStorage();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function _getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

function _removeMealFromLocalStorage(mealId) {
    const mealIds = _getMealsFromLocalStorage();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}