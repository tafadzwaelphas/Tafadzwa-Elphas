const compassWidget = document.getElementById("compass-widget");
const compassNeedle = document.getElementById("compass-needle");
const compassLabel = document.getElementById("compass-label");

function rotateNeedle(headingDeg) {
  // headingDeg is the compass direction the top of the device currently
  // faces (0 = north). Rotating the needle by the opposite angle keeps it
  // visually pointing at true north regardless of how the device is held --
  // the same way a physical compass needle stays fixed while its housing turns.
  compassNeedle.style.transform = "rotate(" + -headingDeg + "deg)";
}

function handleOrientation(event) {
  let heading;
  if (typeof event.webkitCompassHeading === "number") {
    heading = event.webkitCompassHeading; // iOS Safari: already true-north-referenced
  } else if (event.absolute && event.alpha !== null) {
    heading = 360 - event.alpha; // best-effort for browsers exposing absolute alpha
  } else {
    return;
  }
  rotateNeedle(heading);
}

function goLive() {
  const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
  window.addEventListener(eventName, handleOrientation);
  compassWidget.classList.add("is-live");
  compassLabel.textContent = "Following your device";
}

function enableCompass() {
  if (compassWidget.classList.contains("is-live")) return;

  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    // iOS Safari requires this to be called directly inside a user-gesture handler.
    DeviceOrientationEvent.requestPermission()
      .then((state) => {
        if (state === "granted") {
          goLive();
        }
      })
      .catch(() => {});
  } else if (typeof DeviceOrientationEvent !== "undefined") {
    // No explicit permission API (most non-iOS browsers) -- just listen.
    // If the device has no orientation sensor, the event simply never
    // fires and the needle stays at its static "points north" default.
    goLive();
  }
}

if (compassWidget) {
  compassWidget.addEventListener("click", enableCompass);
  compassWidget.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enableCompass();
    }
  });
}
