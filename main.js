const form = document.getElementById("weather-form")
const formInput = document.getElementById("weather-input")
const weatherDetail = document.getElementById("weather-detail")

//fetch data
const apiKey = "35260a6010a72194c616b209e339db17";
async function getWeatherByLocation(location) {
    weatherDetail.innerHTML = "*"
    weatherDetail.classList.remove("hidden")
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
    const response = await data.json()
    parseInt(response.cod) == 200 && addWeatherInfoToPage(response)
}

const hideDetailInfo = () => {
    weatherDetail.innerHTML = ""
    weatherDetail.classList.add("hidden")
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    Boolean(formInput.value) ? getWeatherByLocation(formInput.value) : hideDetailInfo()
})
formInput.addEventListener("input", (e) => {
    e.preventDefault()
    Boolean(formInput.value) ? getWeatherByLocation(formInput.value) : hideDetailInfo()
})


function addWeatherInfoToPage(data) {
    const temperature = Kelvin_To_Centigrade(data.main.temp)
    const maxTemp = Kelvin_To_Centigrade(data.main.temp_max)
    const minTemp = Kelvin_To_Centigrade(data.main.temp_min)
    console.log(data)

    weatherDetail.innerHTML = ""
    weatherDetail.innerHTML =
        `<div>
          <h2 class="weather-detail-bolds">${data.sys.country} - ${data.name}</h2>
          <p class="weather-detail-normals">sunday 22 Nov 2020</p>
        </div>
        <div>
            <h1 class="weather-detail-bolds">${temperature}°C</h1>
            <p class="weather-detail-normals">Sky : ${data.weather[0].description}</p>
        </div>
        <div class="weather-detail-normals">
          <p>Min Temp : ${minTemp}°C</p>
          <p>Max Temp : ${maxTemp}°C</p>
          <p>Wind Speed : ${data.wind.speed}</p>
        </div>`
    weatherDetail.classList.remove("hidden")
}

function Kelvin_To_Centigrade(temp) {
    return parseInt(temp - 273.15)
}
