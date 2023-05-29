//////////////////////////////////////////////////date
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
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
let hour = now.getHours();
let minutes = now.getMinutes();

let time = document.querySelector("#time-display")

let li = document.querySelector("#day-display");
li.innerHTML = `${today}, ${month} ${day}`;
time.innerHTML =`${hour}:${minutes}`;

///////


function displayWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  fTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(fTemperature);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let descriptionPic = document.querySelector("#icon-description-pic");
  descriptionPic.innerHTML = `<img
    src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png"/>`;

  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `${Math.round(
    response.data.main.feels_like
  )}`;

  let wind = document.querySelector("#current-wind");
  wind.innerHTML = `${Math.round(response.data.wind.speed)} MPH`;

  let humidity = document.querySelector("#current-humidity");
  humidity.innerHTML = `s${Math.round(response.data.main.humidity)}%`;

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
}



//////////////////////////////////////////////////////////////////////////location

function showPosition(position) {
  console.log(position);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiKey = `2a42ede14ccfd66d99f2a3df5a6d3999`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayWeather);

  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(url).then(displayForecast);
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#location-icon");
locationButton.addEventListener("click", getLocation);

//////////////Forecast

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="firstDay">
                        <h5>
                            <strong id="dayOne">
                            ${formatHours(forecast.dt * 1000)}
                            </strong>
                        </h5>
                        <span id="weatherType">
                        <img
                    src="http://openweathermap.org/img/wn/${
                      forecast.weather[0].icon
                    }@2x.png"/>          
                    </span>!
                        <strong>
                            <span class="temp" id="maxTempToday">
                                ${Math.round(forecast.main.temp_max)}°
                                </strong>
                             ${Math.round(forecast.main.temp_min)}°
                            </span>
                        </strong>
                </div>`;
  }
}

/////more temp

function changeFahrenheit(event) {
  event.preventDefault();

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

searchEngine("Atlanta");