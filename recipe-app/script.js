const meals = document.getElementById('meals');
getRandomMeal();

async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    _addMeal(randomMeal, true)
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
            <button class="fav-btn"><i class="fas fa-heart"></i>
            </button>
        </div>
    `;

    meal.classList.add('meal');
    meals.appendChild(meal);
}

async function getMealById(id) {
    const meal = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
}

async function getMealsBySearch(term) {
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
}