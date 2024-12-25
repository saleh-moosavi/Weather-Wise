const form = document.getElementById("weather-form");
const formInput = document.getElementById("weather-input");
const weatherDetail = document.getElementById("weather-detail");

const apiKey = "35260a6010a72194c616b209e339db17";

// Fetch weather data by location
async function getWeatherByLocation(location) {
    showLoader();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
        const data = await response.json();
        if (response.ok) {
            displayWeatherInfo(data);
        } else {
            displayError("City not found");
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

// Display weather information on the page
function displayWeatherInfo(data) {
    const temperature = convertKelvinToCelsius(data.main.temp);
    const maxTemp = convertKelvinToCelsius(data.main.temp_max);
    const minTemp = convertKelvinToCelsius(data.main.temp_min);

    weatherDetail.innerHTML = `
        <div>
            <h2 class="weather-detail-bolds">${data.sys.country} - ${data.name}</h2>
            <p class="weather-detail-normals">sunday 22 Nov 2020</p>
        </div>
        <div>
            <h1 class="weather-detail-bolds">${temperature}°C</h1>
            <p class="weather-detail-normals">Sky: ${data.weather[0].description}</p>
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