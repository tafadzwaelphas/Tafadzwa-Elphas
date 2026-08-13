// SomaFM "Groove Salad" -- ambient/downtempo, streamed live via Icecast.
// Public direct stream URL, permissive CORS (Access-Control-Allow-Origin: *).
const RADIO_STREAM_URL = "https://ice1.somafm.com/groovesalad-128-mp3";
const RADIO_LABEL_IDLE = "Live ambient radio · SomaFM";
const RADIO_LABEL_PLAYING = "Groove Salad · Ambient · SomaFM";
const RADIO_LABEL_CONNECTING = "Connecting…";
const RADIO_LABEL_ERROR = "Stream unavailable";

const radioWidget = document.getElementById("radio-widget");
const radioLabel = document.getElementById("radio-label");

let radioAudio = null;

function getRadioAudio() {
  if (!radioAudio) {
    radioAudio = new Audio(RADIO_STREAM_URL);
    radioAudio.preload = "none";
    radioAudio.addEventListener("waiting", () => {
      radioLabel.textContent = RADIO_LABEL_CONNECTING;
    });
    radioAudio.addEventListener("playing", () => {
      radioLabel.textContent = RADIO_LABEL_PLAYING;
    });
    radioAudio.addEventListener("error", () => {
      radioWidget.classList.remove("is-playing");
      radioLabel.textContent = RADIO_LABEL_ERROR;
    });
  }
  return radioAudio;
}

function toggleRadio() {
  const audio = getRadioAudio();

  if (radioWidget.classList.contains("is-playing")) {
    audio.pause();
    radioWidget.classList.remove("is-playing");
    radioLabel.textContent = RADIO_LABEL_IDLE;
    return;
  }

  radioLabel.textContent = RADIO_LABEL_CONNECTING;
  audio
    .play()
    .then(() => {
      radioWidget.classList.add("is-playing");
    })
    .catch(() => {
      radioLabel.textContent = RADIO_LABEL_ERROR;
    });
}

if (radioWidget) {
  radioWidget.addEventListener("click", toggleRadio);
  radioWidget.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRadio();
    }
  });
}
