const localTimeReadout = document.getElementById("local-time-readout");
const localTimeOffsetLabel = document.getElementById("local-time-offset-label");

function updateLocalTimeCompare() {
  const now = new Date();
  localTimeReadout.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const visitorOffsetHours = -now.getTimezoneOffset() / 60;
  const diffFromLocation = visitorOffsetHours - LOCATION.utcOffsetHours;

  let diffText;
  if (diffFromLocation === 0) {
    diffText = "Same time as " + LOCATION.city;
  } else {
    const abs = Math.abs(diffFromLocation);
    const hoursLabel = Number.isInteger(abs) ? abs : abs.toFixed(1);
    diffText = hoursLabel + "h " + (diffFromLocation > 0 ? "ahead of" : "behind") + " " + LOCATION.city;
  }

  localTimeOffsetLabel.textContent = "Your time · " + diffText;
}

if (localTimeReadout) {
  updateLocalTimeCompare();
  setInterval(updateLocalTimeCompare, 1000);
}
