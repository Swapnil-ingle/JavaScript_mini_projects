const APIURL = 'https://www.metaweather.com/api';

getWeatherByLocation('London');

async function getWeatherByLocation(location) {
    const resp = await fetch(APIURL + '/location/search?query=' + location);
    const respData = await resp.json;
    console.log(respData);
}