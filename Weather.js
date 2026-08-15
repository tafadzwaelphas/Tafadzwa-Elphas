// Accra's real coordinates (Ghana is UTC+0 year-round -- see Movement.js).
const WEATHER_LAT = 5.6037;
const WEATHER_LON = -0.187;
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=" +
  WEATHER_LAT +
  "&longitude=" +
  WEATHER_LON +
  "&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=UTC";

const weatherWidget = document.querySelector(".tool-weather");
const weatherLabel = document.getElementById("weather-label");

// Open-Meteo reports WMO weather codes (https://open-meteo.com/en/docs) --
// this collapses them down to the handful of icon states drawn in
// Contact.html, plus a short human label for each exact code.
const WEATHER_CODES = {
  0: { icon: "clear", label: "Clear sky" },
  1: { icon: "partly-cloudy", label: "Mostly clear" },
  2: { icon: "partly-cloudy", label: "Partly cloudy" },
  3: { icon: "cloudy", label: "Overcast" },
  45: { icon: "fog", label: "Fog" },
  48: { icon: "fog", label: "Fog" },
  51: { icon: "rain", label: "Light drizzle" },
  53: { icon: "rain", label: "Drizzle" },
  55: { icon: "rain", label: "Dense drizzle" },
  56: { icon: "rain", label: "Freezing drizzle" },
  57: { icon: "rain", label: "Freezing drizzle" },
  61: { icon: "rain", label: "Light rain" },
  63: { icon: "rain", label: "Rain" },
  65: { icon: "rain", label: "Heavy rain" },
  66: { icon: "rain", label: "Freezing rain" },
  67: { icon: "rain", label: "Freezing rain" },
  71: { icon: "snow", label: "Light snow" },
  73: { icon: "snow", label: "Snow" },
  75: { icon: "snow", label: "Heavy snow" },
  77: { icon: "snow", label: "Snow grains" },
  80: { icon: "rain", label: "Rain showers" },
  81: { icon: "rain", label: "Rain showers" },
  82: { icon: "rain", label: "Violent rain showers" },
  85: { icon: "snow", label: "Snow showers" },
  86: { icon: "snow", label: "Snow showers" },
  95: { icon: "storm", label: "Thunderstorm" },
  96: { icon: "storm", label: "Thunderstorm with hail" },
  99: { icon: "storm", label: "Thunderstorm with hail" },
};

const WEATHER_ICON_STATES = ["clear", "partly-cloudy", "cloudy", "fog", "rain", "snow", "storm"];

async function updateWeather() {
  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) throw new Error("Weather request failed: " + response.status);
    const data = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const condition = WEATHER_CODES[code] || { icon: "cloudy", label: "Unsettled" };
    const high = Math.round(data.daily.temperature_2m_max[0]);
    const low = Math.round(data.daily.temperature_2m_min[0]);

    WEATHER_ICON_STATES.forEach((state) => weatherWidget.classList.toggle("is-" + state, state === condition.icon));

    weatherLabel.textContent = "Accra · " + temp + "°C, " + condition.label + " · H" + high + "° L" + low + "°";
  } catch (err) {
    weatherLabel.textContent = "Weather unavailable";
  }
}

if (weatherWidget) {
  updateWeather();
  setInterval(updateWeather, 15 * 60000);
}
