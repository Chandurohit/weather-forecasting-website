// Handle sign-out button click

document.getElementById('sign-out').addEventListener('click', function(event) {
    event.preventDefault();
    alert('You have been signed out.');
    window.location.href = './login.html';
});

// Handle the Get Weather button click
document.getElementById('get-weather-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        console.log(`Fetching weather for: ${city}`);
        fetchWeatherData(city); // Call the function to get weather data
    } else {
        alert('Please enter a city name.');
    }
});

// Fetch and display weather for "Guntur" by default when the page loads
window.onload = function() {
    fetchWeatherData('Guntur');
};

// Function to fetch weather data from an API (Optimized for Parallel API Calls)
async function fetchWeatherData(city) {
    const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your actual API key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Parallel API calls for current weather and 5-day forecast using Promise.all
        console.log('Sending parallel requests for current weather and forecast.');
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok) throw new Error('City not found');
        if (!forecastResponse.ok) throw new Error('Error fetching forecast');

        // Parse the JSON responses
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        console.log('Current weather data:', currentData);
        console.log('Forecast data:', forecastData);

        // Update UI with the fetched data
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message);
    }
}

// Function to update the current weather UI
function updateCurrentWeather(data) {
    const weatherIconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Batch UI updates to avoid multiple reflows/repaints
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('date').innerText = moment().format('MMMM Do YYYY');
    document.getElementById('weather-icon').src = weatherIconUrl;
}

// Function to update the 5-day forecast section
function updateForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecasts

    // Filter forecasts to get one per day at 12:00 PM
    const dailyForecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));

    // Batch create the forecast DOM elements before appending them
    const forecastElements = dailyForecasts.slice(0, 5).map(forecast => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';

        const day = document.createElement('p');
        day.innerText = moment(forecast.dt_txt).format('dddd'); // Format as day of the week
        forecastDay.appendChild(day);

        const icon = document.createElement('img');
        icon.className = 'forecast-icon';
        icon.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        forecastDay.appendChild(icon);

        const temp = document.createElement('p');
        temp.innerText = `Temp: ${forecast.main.temp}°C`;
        forecastDay.appendChild(temp);

        const desc = document.createElement('p');
        desc.innerText = forecast.weather[0].description;
        forecastDay.appendChild(desc);

        return forecastDay;
    });

    // Append all the forecast elements at once
    forecastElements.forEach(element => forecastContainer.appendChild(element));
}
