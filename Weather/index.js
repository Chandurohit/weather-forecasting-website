const url = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    weatherFn('Pune'); // Default city

    // Add button event listener for user input
    $('#city-input-btn').on('click', function () {
        const city = $('#city-input').val();
        if (city) {
            weatherFn(city);
        } else {
            alert('Please enter a city name.');
        }
    });
});

async function weatherFn(cityName) {
    const apiUrl = `${url}?q=${cityName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.city.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#weather-info').fadeIn();

    // Display current weather
    const currentWeather = data.list[0]; // Get the first weather data point
    $('#temperature').html(`${currentWeather.main.temp}°C`);
    $('#description').text(currentWeather.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${currentWeather.wind.speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`);

    // Clear the forecast container
    $('#forecast-container').empty();

    // Display the 5-day forecast
    const forecastDays = {}; // To hold daily forecasts

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!forecastDays[date]) {
            forecastDays[date] = {
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                day: date,
            };
        }
    });

    for (const key in forecastDays) {
        const forecast = forecastDays[key];
        $('#forecast-container').append(`
            <div class="forecast-day">
                <p>${forecast.day}</p>
                <img src="http://openweathermap.org/img/w/${forecast.icon}.png" alt="Weather Icon">
                <p>Temp: ${forecast.temp.toFixed(1)}°C</p>
                <p>${forecast.description}</p>
            </div>
        `);
    }
}

