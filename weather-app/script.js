const apiKey = "3265874a2c77ae4a04bb96236a642d2f";
const url = (location) => `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getWeatherByLocation("Delhi");

async function getWeatherByLocation(location) {
    const resp = await fetch(url(location), { origin: "cors" });
    const respData = await resp.json();

    if (respData.cod == "404") {
        alert("No results found!");
        return;
    }

    console.log(respData, KtoC(respData));
    addWeatherToPage(respData);
}

function addWeatherToPage(data) {
    const temp = KtoC(data.main.temp);

    const weather = document.createElement('div');
    weather.classList.add('weather');

    weather.innerHTML = `
        <h1 class="placename">${data.name}</h1>
        <div class="temp-details">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"/>
            <h2>${temp}°C</h2>
        </div>
        <small>(${data.weather[0].main})</small>
    `;

    // clean up
    main.innerHTML = "";

    main.appendChild(weather);
}

function KtoC(K) {
    return (K - 273.15).toFixed(2);
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const location = search.value;

    if (location) {
        getWeatherByLocation(location);
    }
});
