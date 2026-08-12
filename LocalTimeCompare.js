const localTimeReadout = document.getElementById("local-time-readout");
const localTimeOffsetLabel = document.getElementById("local-time-offset-label");

function updateLocalTimeCompare() {
  const now = new Date();
  localTimeReadout.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  // Accra is UTC+0, so the visitor's own UTC offset is their offset from Accra.
  const offsetHours = -now.getTimezoneOffset() / 60;

  let diffText;
  if (offsetHours === 0) {
    diffText = "Same time as Accra";
  } else {
    const abs = Math.abs(offsetHours);
    const hoursLabel = Number.isInteger(abs) ? abs : abs.toFixed(1);
    diffText = hoursLabel + "h " + (offsetHours > 0 ? "ahead of" : "behind") + " Accra";
  }

  localTimeOffsetLabel.textContent = "Your time · " + diffText;
}

if (localTimeReadout) {
  updateLocalTimeCompare();
  setInterval(updateLocalTimeCompare, 1000);
}
