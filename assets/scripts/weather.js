async function getTemperature(lat, lon, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.main && data.main.temp !== undefined) {
            return data.main.temp;
        } else {
            throw new Error("Temperature data not found");
        }
    } catch (error) {
        console.error("Error fetching temperature:", error);
        return null;
    }
}

const apiKey = "b2e27412b03b67f5a4c868cd9410e2c9";
const tempContainer = document.getElementById("temperature");

getTemperature(28.7041, 77.1025, apiKey)
    .then(temp => tempContainer.textContent = `${temp}°C`)
    .catch(err => console.error(err));
