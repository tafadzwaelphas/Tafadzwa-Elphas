const MOON_LAT = LOCATION.lat;
const MOON_LON = LOCATION.lon;

const moonWidget = document.querySelector(".tool-moondial");
const moonDisc = document.getElementById("moondial-moon");
const moonLabel = document.getElementById("moondial-label");

function moonToRad(deg) {
  return (deg * Math.PI) / 180;
}
function moonToDeg(rad) {
  return (rad * 180) / Math.PI;
}
function norm360(deg) {
  return ((deg % 360) + 360) % 360;
}

// Low-precision lunar position (Montenbruck & Pfleger's popular approximation,
// good to roughly a degree -- plenty for a small dashboard widget, not meant
// as a precision ephemeris, same spirit as Sundial.js's solar formulas).
function moonEclipticPosition(d) {
  const L = norm360(218.316 + 13.176396 * d); // mean longitude
  const M = norm360(134.963 + 13.064993 * d); // mean anomaly
  const F = norm360(93.272 + 13.229350 * d); // distance from ascending node

  const longitude = L + 6.289 * Math.sin(moonToRad(M));
  const latitude = 5.128 * Math.sin(moonToRad(F));

  return { longitude: norm360(longitude), latitude };
}

// Same low-precision approximation for the sun's ecliptic longitude, used
// only to work out the sun-moon angle for the phase name below.
function sunEclipticLongitude(d) {
  const L = norm360(280.460 + 0.9856474 * d);
  const M = norm360(357.528 + 0.9856003 * d);
  return norm360(L + 1.915 * Math.sin(moonToRad(M)) + 0.02 * Math.sin(moonToRad(2 * M)));
}

const OBLIQUITY = moonToRad(23.4397);

function eclipticToEquatorial(lonDeg, latDeg) {
  const lon = moonToRad(lonDeg);
  const lat = moonToRad(latDeg);
  const ra = Math.atan2(
    Math.sin(lon) * Math.cos(OBLIQUITY) - Math.tan(lat) * Math.sin(OBLIQUITY),
    Math.cos(lon)
  );
  const dec = Math.asin(
    Math.sin(lat) * Math.cos(OBLIQUITY) + Math.cos(lat) * Math.sin(OBLIQUITY) * Math.sin(lon)
  );
  return { ra: moonToDeg(ra), dec: moonToDeg(dec) };
}

function daysSinceJ2000(date) {
  return (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
}

function greenwichSiderealTime(d) {
  return norm360(280.46061837 + 360.98564736629 * d);
}

// Altitude of the moon above the horizon at LOCATION, in degrees, at a given date.
function moonAltitude(date) {
  const d = daysSinceJ2000(date);
  const { longitude, latitude } = moonEclipticPosition(d);
  const { ra, dec } = eclipticToEquatorial(longitude, latitude);

  const lst = norm360(greenwichSiderealTime(d) + MOON_LON);
  const hourAngle = moonToRad(norm360(lst - ra));
  const latRad = moonToRad(MOON_LAT);
  const decRad = moonToRad(dec);

  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngle);
  return moonToDeg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));
}

// Scans a 48-hour window around "now" in 10-minute steps looking for
// horizon crossings, since (unlike the sun) the moon can rise or set at any
// point in the day and drifts about 50 minutes later each day. Each
// crossing is refined with a linear interpolation between the two samples
// that bracket it.
function findMoonEvents(centerDate) {
  const stepMinutes = 10;
  const stepMs = stepMinutes * 60000;
  const start = new Date(centerDate.getTime() - 24 * 3600000);
  const totalSteps = Math.ceil((48 * 3600000) / stepMs);

  const events = [];
  let prevTime = start;
  let prevAlt = moonAltitude(prevTime);

  for (let i = 1; i <= totalSteps; i++) {
    const time = new Date(start.getTime() + i * stepMs);
    const alt = moonAltitude(time);

    if ((prevAlt < 0 && alt >= 0) || (prevAlt >= 0 && alt < 0)) {
      const fraction = prevAlt / (prevAlt - alt);
      const crossingTime = new Date(prevTime.getTime() + fraction * (time.getTime() - prevTime.getTime()));
      events.push({ time: crossingTime, type: prevAlt < 0 ? "rise" : "set" });
    }

    prevTime = time;
    prevAlt = alt;
  }

  return events;
}

function moonPhaseName(date) {
  const d = daysSinceJ2000(date);
  const moonLon = moonEclipticPosition(d).longitude;
  const sunLon = sunEclipticLongitude(d);
  const elongation = norm360(moonLon - sunLon);

  if (elongation < 6 || elongation > 354) return "New Moon";
  if (elongation < 84) return "Waxing Crescent";
  if (elongation < 96) return "First Quarter";
  if (elongation < 174) return "Waxing Gibbous";
  if (elongation < 186) return "Full Moon";
  if (elongation < 264) return "Waning Gibbous";
  if (elongation < 276) return "Last Quarter";
  return "Waning Crescent";
}

function formatMoonHour(date) {
  let hour = (date.getUTCHours() + LOCATION.utcOffsetHours + 24) % 24;
  const minute = date.getUTCMinutes();
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return hour + ":" + String(minute).padStart(2, "0") + " " + suffix;
}

function updateMoondial() {
  const now = new Date();
  const events = findMoonEvents(now);
  const isUp = moonAltitude(now) >= 0;
  const phase = moonPhaseName(now);

  moonWidget.classList.toggle("is-below-horizon", !isUp);

  if (isUp) {
    const priorRise = events.filter((e) => e.type === "rise" && e.time <= now).pop();
    const nextSet = events.find((e) => e.type === "set" && e.time > now);

    if (priorRise && nextSet) {
      const t = (now.getTime() - priorRise.time.getTime()) / (nextSet.time.getTime() - priorRise.time.getTime());
      const phi = Math.PI - t * Math.PI; // pi (rise) -> 0 (set)
      const cx = 300 + 260 * Math.cos(phi);
      const cy = 300 - 240 * Math.sin(phi);
      moonDisc.setAttribute("cx", cx.toFixed(1));
      moonDisc.setAttribute("cy", cy.toFixed(1));
    }

    moonLabel.textContent = nextSet
      ? "Moonset in " + LOCATION.city + " · " + formatMoonHour(nextSet.time) + " · " + phase
      : "Moon up over " + LOCATION.city + " · " + phase;
  } else {
    const nextRise = events.find((e) => e.type === "rise" && e.time > now);
    moonLabel.textContent = nextRise
      ? "Moonrise in " + LOCATION.city + " · " + formatMoonHour(nextRise.time) + " · " + phase
      : "Moon below the horizon · " + phase;
  }
}

if (moonWidget) {
  updateMoondial();
  setInterval(updateMoondial, 60000);
}
