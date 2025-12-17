const form = document.getElementById("weather-form");
const formInput = document.getElementById("weather-input");
const bgImage = document.getElementById("background-image");
const weatherDetail = document.getElementById("weather-detail");

// Get all text elements
const dateText = document.getElementById("date-text");
const minTempText = document.getElementById("min-temp-text");
const maxTempText = document.getElementById("max-temp-text");
const locationText = document.getElementById("location-text");
const windSpeedText = document.getElementById("wind-speed-text");
const temperatureText = document.getElementById("temperature-text");
const descriptionText = document.getElementById("description-text");

let debounceRef = null;
let previousValue = "";
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

// Light Animation In Background
const animate = document.getElementById("animate");
const animation = () => {
  let windowWidth = window.innerWidth;
  let WindowHeight = window.innerHeight;
  setInterval(() => {
    animate.style.top = Math.random() * WindowHeight + "px";
    animate.style.left = Math.random() * windowWidth + "px";
    animate.style.transitionDuration = Math.random() * 5 + "s";
  }, 3000);
};

window.onload = function () {
  formInput.focus();
  ResetValues();
  animation();
};

// Fetch weather data by location
async function getWeatherByLocation(location) {
  if (debounceRef !== null) clearTimeout(debounceRef);
  showLoader();
  debounceRef = setTimeout(async () => {
    try {
      const response = await fetch(`${baseUrl}?q=${location}&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        updateWeatherInfo(data);
      } else {
        displayError("City not found");
      }
    } catch (error) {
      displayError("Error fetching data");
    }
  }, 500);
}

// Show loader while fetching data
function showLoader() {
  locationText.textContent = "Loading...";
}

// Change Background Image Based On Weather Description
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
      return images.other;
  }
}

// Update weather information by setting text values
function updateWeatherInfo(data) {
  const temperature = convertKelvinToCelsius(data.main.temp);
  const maxTemp = convertKelvinToCelsius(data.main.temp_max);
  const minTemp = convertKelvinToCelsius(data.main.temp_min);

  // const weatherDescription = data.weather[0]?.description || "unknown";
  // bgImage.src = getWeatherImage(weatherDescription);

  minTempText.textContent = minTemp;
  maxTempText.textContent = maxTemp;
  windSpeedText.textContent = data.wind.speed;
  temperatureText.textContent = `${temperature}`;
  locationText.textContent = `${data.sys.country} - ${data.name}`;
  descriptionText.textContent = `${data.weather[0].description}`;
}

// Display error message
function displayError(message) {
  ResetValues();
  locationText.textContent = message;
}

// Reset Values Of Weather Details
function ResetValues() {
  dateText.textContent = `${new Date().getUTCFullYear()}/${
    new Date().getMonth() + 1
  }/${new Date().getDate()}`;
  minTempText.textContent = ".....";
  maxTempText.textContent = ".....";
  locationText.textContent = ".....";
  windSpeedText.textContent = ".....";
  temperatureText.textContent = ".....";
  descriptionText.textContent = ".....";
}

// Convert Kelvin to Celsius
function convertKelvinToCelsius(temp) {
  return Math.round(temp - 273.15);
}

const formHandler = (e) => {
  e.preventDefault();
  const location = formInput.value.trim();
  if (location === previousValue) {
    return;
  } else {
    previousValue = location;
  }
  location && location.length > 2 && getWeatherByLocation(location);
};

// Event listeners for form submission and input
form.addEventListener("submit", formHandler);
formInput.addEventListener("input", formHandler);
