// Single source of truth for "where Tafadzwa currently is." Movement.js, Sundial.js,
// Moon.js, Weather.js, and LocalTimeCompare.js all read from this instead of hardcoding
// a city -- update this one file when he travels or relocates, nothing else needs to change.
const LOCATION = {
  city: "Cape Town",
  country: "South Africa",
  lat: -33.9249,
  lon: 18.4241,
  utcOffsetHours: 2, // SAST, no DST
  ianaTimeZone: "Africa/Johannesburg", // for Weather.js's Open-Meteo `timezone` param
};

// Fills in any element whose data-location-label uses {city}/{country} placeholders,
// e.g. <span data-location-label="Currently in {city}, {country}">.
document.querySelectorAll("[data-location-label]").forEach((el) => {
  el.textContent = el
    .getAttribute("data-location-label")
    .replace("{city}", LOCATION.city)
    .replace("{country}", LOCATION.country);
});
