const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");

function setClock() {
  const date = new Date();
  const hr = (date.getUTCHours() + LOCATION.utcOffsetHours + 24) % 24;
  const min = date.getUTCMinutes();
  const sec = date.getUTCSeconds();

  const hrDeg = (hr % 12) * 30 + min * 0.5;
  const minDeg = min * 6 + sec * 0.1;
  const secDeg = sec * 6;

  HOURHAND.style.transform = "rotate(" + hrDeg + "deg)";
  MINUTEHAND.style.transform = "rotate(" + minDeg + "deg)";
  SECONDHAND.style.transform = "rotate(" + secDeg + "deg)";
}

setClock();
setInterval(setClock, 1000);
