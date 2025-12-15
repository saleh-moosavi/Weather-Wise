const form = document.getElementById("weather-form");
const formInput = document.getElementById("weather-input");
const bgImage = document.getElementById("background-image");
const weatherDetail = document.getElementById("weather-detail");

const apiKey = "35260a6010a72194c616b209e339db17";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const images = {
  rain: "./assets/photos/rain.jpg",
  snow: "./assets/photos/snow.jpg",
  other: "./assets/photos/haze.jpg",
  clear: "./assets/photos/clear.jpg",
  cloud: "./assets/photos/cloud.jpg",
  drizzle: "./assets/photos/drizzle.jpg",
  thunderstorm: "./assets/photos/thunderstorm.jpg",
};

window.onload = function () {
  formInput.focus();
};

// Fetch weather data by location
async function getWeatherByLocation(location) {
  showLoader();
  try {
    if (formInput.value.length > 2) {
      const response = await fetch(`${baseUrl}?q=${location}&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        displayWeatherInfo(data);
      } else {
        displayError("City not found");
      }
    } else {
      displayError("City must have more than 2 letter");
    }
  } catch (error) {
    displayError("Error fetching data");
  }
}

// Show loader while fetching data
function showLoader() {
  weatherDetail.innerHTML = '<div class="custom-loader"></div>';
  weatherDetail.classList.remove("hidden");
}

// Hide weather details
function hideDetailInfo() {
  weatherDetail.innerHTML = "";
  weatherDetail.classList.add("hidden");
}

function getWeatherImage(weatherDescription) {
  const normalizedDescription = weatherDescription.toLowerCase();

  switch (true) {
    case normalizedDescription.includes("cloud"):
      return images.cloud;
    case normalizedDescription.includes("rain"):
      return images.rain;
    case normalizedDescription.includes("clear"):
      return images.clear;
    case normalizedDescription.includes("snow"):
      return images.snow;
    case normalizedDescription.includes("drizzle"):
      return images.drizzle;
    case normalizedDescription.includes("thunderstorm"):
      return images.thunderstorm;
    default:
      return images.other; // Default case
  }
}

// Display weather information on the page
function displayWeatherInfo(data) {
  const temperature = convertKelvinToCelsius(data.main.temp);
  const maxTemp = convertKelvinToCelsius(data.main.temp_max);
  const minTemp = convertKelvinToCelsius(data.main.temp_min);
  const weatherDescription = data.weather[0]?.description || "unknown";
  bgImage.src = getWeatherImage(weatherDescription);

  weatherDetail.innerHTML = `
        <div>
            <h2 class="weather-detail-bolds">${data.sys.country} - ${
    data.name
  }</h2>
            <p class="weather-detail-normals">${new Date().getUTCFullYear()}/${new Date().getMonth()}/${new Date().getDay()}</p>
        </div>
        <div>
            <h1 class="weather-detail-bolds">${temperature}°C</h1>
            <p class="weather-detail-normals">Sky: ${
              data.weather[0].description
            }</p>
        </div>
        <div class="weather-detail-normals">
            <p>Min Temp: ${minTemp}°C</p>
            <p>Max Temp: ${maxTemp}°C</p>
            <p>Wind Speed: ${data.wind.speed}</p>
        </div>`;
  weatherDetail.classList.remove("hidden");
}

// Display error message
function displayError(message) {
  weatherDetail.innerHTML = message;
}

// Convert Kelvin to Celsius
function convertKelvinToCelsius(temp) {
  return Math.round(temp - 273.15);
}

// Event listeners for form submission and input
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = formInput.value.trim();
  location ? getWeatherByLocation(location) : hideDetailInfo();
});

formInput.addEventListener("input", (e) => {
  e.preventDefault();
  const location = formInput.value.trim();
  location ? getWeatherByLocation(location) : hideDetailInfo();
});
