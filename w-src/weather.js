// Weather icons changer

let iconCodePathConverter = {
  "01d": "imgs/clearskyday.png",
  "01n": "imgs/clearnightsky.png",
  "02d": "imgs/cloudysun.png",
  "02n": "imgs/cloudynight.png",
  "03d": "imgs/scatteredclouds.png",
  "03n": "imgs/fewclouds.png",
  "04d": "imgs/clouds.png" ,
  "04n": "imgs/overcast.png",
  "09d": "imgs/sun-shower.png",
  "10d": "imgs/light-rain.png",
  "10n": "imgs/heavy-rain.png",
  "11d": "imgs/thunderstorm.png",
  "11n": "imgs/thunderstormnight.png",
  "13d": "imgs/snowday.png",
  "13n": "imgs/snow.png",
  "50d": "imgs/mistysun.png",
  "50n": "imgs/mistynight.png",
  "50d": "imgs/hazeday.png",
  "50d": "imgs/wind.png",
}

//////////////////////////////////////////////////date
let now = new Date();
let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let monthsList = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours()%12;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}


let month = monthsList[now.getMonth()];
let day = now.getDate();
let today = days[now.getDay()];
let hour = now.getHours()%12;
let minutes = ("0" + now.getMinutes()).slice(-2);
let year=now.getFullYear();

let time = document.querySelector("#time-display")

let li = document.querySelector("#day-display");
li.innerHTML = `${today}, ${month} ${day} ${year}`;
time.innerHTML =`${hour}:${minutes}`;

/////more temp

function changeFahrenheit(event) {

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fTemperature);
}

function changeCelsius(event) {
  event.preventDefault();

  let cTemperature = ((fTemperature - 32) * 5) / 9;
  document.querySelector("#temperature").innerHTML = Math.round(cTemperature);
}

let celsiusChange = document.querySelector("#celsius-link");
celsiusChange.addEventListener("click", changeCelsius);

let fahrenheitChange = document.querySelector("#fahrenheit-link");
fahrenheitChange.addEventListener("click", changeFahrenheit);

let fTemperature = null;
///////

function displayWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  //let descriptionPic = document.querySelector("#icon-description-pic");
  let wind = document.querySelector("#current-wind");
  let feelsLike = document.querySelector("#feels-like");
  let humidity = document.querySelector("#current-humidity");
  let city = document.querySelector("#city");
  let iconElement = document.querySelector("#icon");

  fTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(fTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  //descriptionPic.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png"/>`;
  feelsLike.innerHTML = `${Math.round(response.data.main.feels_like)}`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} MPH`;
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  city.innerHTML = response.data.name;
}
  //iconElement.setAttribute("src", iconCodePathConverter[response.data.list[0].weather[0].icon]);
  //iconElement.setAttribute("alt", response.data.list[0].weather[0].description);



//////////////Forecast

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for(let index = 0; index < 6; index++){
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
      <div>
        <h5><span>
        ${formatHours(forecast.dt * 1000)}
      </span>
      </h5> <span> <img id="icon" src="${iconCodePathConverter[forecast.weather[0].icon]}" alt="icon" />
    <div class ="weather-forecast temp">
    <span class="maxTemp"><strong> ${Math.round(forecast.main.temp_max)}° | </strong>
     ${Math.round(forecast.main.temp_min)}° </span>
    </div>
    </div>
    `;
     /*for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="firstDay">
                        <h5> <span id="dayOne">
                            ${formatHours(forecast.dt * 1000)}
                            </span>
                        </h5> <span id="weatherType"> <img src="http://openweathermap.org/img/wn/${
                      forecast.weather[0].icon }@2x.png"/>          
                    </span>
                       <span class="temp" id="maxTempToday">
                                ${Math.round(forecast.main.temp_max)}°
                                </strong>
                             ${Math.round(forecast.main.temp_min)}°
                            </span>
                </div>`;*/    
  }
}



//////////////////////////////////////////////////////////////////////////location

function showPosition(position) {

  console.log(position);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let units = `imperial`
  let apiKey = `2a42ede14ccfd66d99f2a3df5a6d3999`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayForecast);
}


function getLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#location-icon");
locationButton.addEventListener("click", getLocation);

///////////////////////////////////////////////////////////////////////API

function displayCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let currentCity = cityInput.value.toUpperCase();
  document.querySelector("#city").innerHTML = currentCity;

  let apiKey = `2a42ede14ccfd66d99f2a3df5a6d3999`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayWeather);

  url = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${apiKey}&units=imperial`;
  axios.get(url).then(displayForecast);
}

let searchResult = document.querySelector("#search-form");
searchResult.addEventListener("click", displayCity);

function searchEngine(city) {
  let apiKey = `2a42ede14ccfd66d99f2a3df5a6d3999`;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(url).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
 
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  searchEngine(cityInputElement.value);
}

let searchButton = document.querySelector("#search-form");
searchButton.addEventListener("submit", handleSubmit);

searchEngine("Washington D.C.");

