const meals = document.getElementById('meals');
const favMealsList = document.getElementById('fav-meals');
const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    // Clear the existing meals if any.
    meals.innerHTML = "";
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
    let recipeFlagHeaderHTML = `<span class="random">${random ? "Random Recipe" : "Search Result"}</span>`;

    meal.innerHTML = `
        <div class="meal-header">
            ${recipeFlagHeaderHTML}
            <button class="meal-header reload" id="reloadRandomBtn">
                <i class="fas fa-redo-alt"></i>
            </button>
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

    const reloadrandomBtn = meal.querySelector("#reloadRandomBtn");
    reloadrandomBtn.addEventListener('click', () => {

        getRandomMeal();
    });

    meal.classList.add('meal');
    meals.appendChild(meal);
}

async function fetchFavMeals() {
    // Clean container and refresh fav meals list
    favMealsList.innerHTML = "";
    const mealIds = _getMealsFromLocalStorage();

    if (mealIds.length == 0) {
        const noFavMealsAddedSpan = document.createElement('h4');
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

    const resultMeals = await getMealsBySearch(searchKey);

    if (resultMeals === null || resultMeals.length <= 0) {
        alert("No meals found!");
        return;
    }

    // Clear the existing meals to make way for searched results
    meals.innerHTML = "";

    resultMeals.forEach((meal) => {
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