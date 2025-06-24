let form = document.getElementById('weatherForm');
let input = document.getElementById('cityInput');
let resultDiv = document.getElementById('weatherResult');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Using your hardcoded coordinates
    let url = `https://api.weather.gov/points/30.4054,-88.9029`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let forecastUrl = data.properties.forecast;

        let forecastResponse = await fetch(forecastUrl);
        let forecastData = await forecastResponse.json();

        // Display the first period's forecast as an example
        let period = forecastData.properties.periods[0];
        resultDiv.innerHTML = `
            <h3>${period.name}</h3>
            <p>${period.detailedForecast}</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-danger">Error fetching weather data.</p>`;
    }
});
