let form = document.getElementById('weatherForm');
let input = document.getElementById('cityInput');
let resultDiv = document.getElementById('weatherResult');

const findMe = () => {
  

  const success = (position) => {
    console.log(position);
    status.textContent = "success";
    const { latitude, longitude } = position.coords;
    ;
  };
  const error = () => {
    
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let city = input.value.trim();
    if (!city) return;
    // https://api.weather.gov/gridpoints/AKQ/30350950,89184667/forecast/hourly?units=us

    // 1. Geocode city to get coordinates
    let geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
    try {
        let geoRes = await fetch(geoUrl);
        let geoData = await geoRes.json();
        if (!geoData[0]) {
            resultDiv.innerHTML = `<p class="text-danger">City not found.</p>`;
            return;
        }
        let lat = geoData[0].lat;
        let lon = geoData[0].lon;
        let displayName = geoData[0].display_name;

        // 2. Use coordinates in weather.gov API
        let url = `https://api.weather.gov/points/${lat},${lon}`;
        let response = await fetch(url);
        let data = await response.json();
        let forecastUrl = data.properties.forecast;

        let forecastResponse = await fetch(forecastUrl);
        let forecastData = await forecastResponse.json();
        let periods = forecastData.properties.periods;

        // Show city/town name and 7-day forecast
        let html = `<h2>7-Day Weather Forecast for ${displayName.split(',')[0]}</h2>`;
        html += `<div class="list-group">`;
        for (let i = 0; i < Math.min(7, periods.length); i++) {
            let period = periods[i];
            html += `
                <div class="list-group-item mb-2">
                    <h5>${period.name}</h5>
                    <p>${period.detailedForecast}</p>
                    <p>Temperature: ${period.temperature}°${period.temperatureUnit}</p>
                    <p>Wind: ${period.windSpeed} ${period.windDirection}</p>
                </div>
            `;
        }
        html += `</div>`;
        resultDiv.innerHTML = html;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        resultDiv.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    }
});
