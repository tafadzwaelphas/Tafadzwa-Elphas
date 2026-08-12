// Accra's real coordinates (Ghana is UTC+0 year-round -- see Movement.js).
const SUNDIAL_LAT = 5.6037;
const SUNDIAL_LON = -0.187;

const sundialWidget = document.querySelector(".tool-sundial");
const sundialSun = document.getElementById("sundial-sun");
const sundialLabel = document.getElementById("sundial-label");

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

// Simplified solar-position formulas (accurate to roughly a degree of
// declination and a minute of equation-of-time -- plenty for a small
// dashboard widget, not meant as a precision ephemeris). Sun's horizontal
// position on the dial is driven by solar hour angle (time-of-day), not
// true compass azimuth, which keeps the small arc readable.
function solarNumbers(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000) + 1;

  const declination = -23.44 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)));

  const b = toRad((360 / 365) * (dayOfYear - 81));
  const eqOfTimeMin = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  const solarNoonUTC = 12 - SUNDIAL_LON / 15 - eqOfTimeMin / 60;

  const latRad = toRad(SUNDIAL_LAT);
  const decRad = toRad(declination);
  const cosH0 = -Math.tan(latRad) * Math.tan(decRad);
  const clamped = Math.max(-1, Math.min(1, cosH0));
  const h0Deg = toDeg(Math.acos(clamped));
  const halfDayHours = h0Deg / 15;

  const nowUTCHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const hourAngleDeg = 15 * (nowUTCHours - solarNoonUTC);

  const t = (hourAngleDeg + h0Deg) / (2 * h0Deg);

  return {
    sunriseUTC: solarNoonUTC - halfDayHours,
    sunsetUTC: solarNoonUTC + halfDayHours,
    t,
  };
}

function formatAccraHour(hoursDecimal) {
  let h = ((hoursDecimal % 24) + 24) % 24;
  const totalMinutes = Math.round(h * 60);
  let hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return hour + ":" + String(minute).padStart(2, "0") + " " + suffix;
}

function updateSundial() {
  const { sunriseUTC, sunsetUTC, t } = solarNumbers(new Date());
  const isDaytime = t >= 0 && t <= 1;

  sundialWidget.classList.toggle("is-night", !isDaytime);

  if (isDaytime) {
    const phi = Math.PI - t * Math.PI; // pi (sunrise) -> 0 (sunset)
    const cx = 300 + 260 * Math.cos(phi);
    const cy = 300 - 240 * Math.sin(phi);
    sundialSun.setAttribute("cx", cx.toFixed(1));
    sundialSun.setAttribute("cy", cy.toFixed(1));
    sundialLabel.textContent = "Sunset in Accra · " + formatAccraHour(sunsetUTC);
  } else {
    sundialLabel.textContent = "Sunrise in Accra · " + formatAccraHour(sunriseUTC);
  }
}

if (sundialWidget) {
  updateSundial();
  setInterval(updateSundial, 1000);
}
