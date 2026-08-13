// SomaFM "Groove Salad" -- ambient/downtempo, streamed live via Icecast.
// Public direct stream URL, permissive CORS (Access-Control-Allow-Origin: *).
//
// Two possible controls share this one script: the full-size widget on the
// Contact page (#radio-widget) and a small docked mini-player every other
// page carries (#radio-dock), kept hidden until the visitor has actually
// pressed play once. This is a plain multi-page site (real navigations, not
// client-side routing), so the stream can't literally stay connected across
// a page load -- play state is remembered in localStorage and playback is
// re-started fresh on each new page instead, which means a short reconnect
// gap on every navigation. The very first reconnect attempt on a given page
// may also be blocked by the browser's autoplay policy until the visitor has
// interacted with that page; when that happens the dock is left visible in
// its paused state as a "tap to resume" control rather than failing silently.
const RADIO_STREAM_URL = "https://ice1.somafm.com/groovesalad-128-mp3";
const RADIO_LABEL_IDLE = "Live ambient radio · SomaFM";
const RADIO_LABEL_PLAYING = "Groove Salad · Ambient · SomaFM";
const RADIO_LABEL_CONNECTING = "Connecting…";
const RADIO_LABEL_RESUME = "Tap to resume · Groove Salad";
const RADIO_LABEL_ERROR = "Stream unavailable";
const RADIO_STORAGE_KEY = "radioPlaying";

const radioDockWrap = document.getElementById("radio-dock-wrap");

const radioControls = [
  { trigger: document.getElementById("radio-widget"), label: document.getElementById("radio-label") },
  { trigger: document.getElementById("radio-dock"), label: document.getElementById("radio-dock-label") },
].filter((control) => control.trigger);

let radioAudio = null;

function setRadioLabel(text) {
  radioControls.forEach((control) => {
    if (control.label) control.label.textContent = text;
  });
}

function setRadioPlayingState(isPlaying) {
  radioControls.forEach((control) => {
    control.trigger.classList.toggle("is-playing", isPlaying);
  });
}

function showRadioDock() {
  if (!radioDockWrap) return;
  radioDockWrap.hidden = false;
  requestAnimationFrame(() => radioDockWrap.classList.add("is-visible"));
}

function hideRadioDock() {
  if (!radioDockWrap) return;
  radioDockWrap.classList.remove("is-visible");
  radioDockWrap.addEventListener("transitionend", () => { radioDockWrap.hidden = true; }, { once: true });
}

function getRadioAudio() {
  if (!radioAudio) {
    radioAudio = new Audio(RADIO_STREAM_URL);
    radioAudio.preload = "none";
    radioAudio.addEventListener("waiting", () => setRadioLabel(RADIO_LABEL_CONNECTING));
    radioAudio.addEventListener("playing", () => setRadioLabel(RADIO_LABEL_PLAYING));
    radioAudio.addEventListener("error", () => {
      setRadioPlayingState(false);
      setRadioLabel(RADIO_LABEL_ERROR);
      localStorage.removeItem(RADIO_STORAGE_KEY);
    });
  }
  return radioAudio;
}

function playRadio({ isResume } = {}) {
  const audio = getRadioAudio();
  showRadioDock();
  setRadioLabel(RADIO_LABEL_CONNECTING);
  audio
    .play()
    .then(() => {
      setRadioPlayingState(true);
      localStorage.setItem(RADIO_STORAGE_KEY, "true");
    })
    .catch(() => {
      setRadioPlayingState(false);
      setRadioLabel(isResume ? RADIO_LABEL_RESUME : RADIO_LABEL_ERROR);
      if (!isResume) localStorage.removeItem(RADIO_STORAGE_KEY);
    });
}

function pauseRadio() {
  if (radioAudio) radioAudio.pause();
  setRadioPlayingState(false);
  setRadioLabel(RADIO_LABEL_IDLE);
  localStorage.removeItem(RADIO_STORAGE_KEY);
  hideRadioDock();
}

function toggleRadio() {
  const isPlaying = radioControls.some((control) => control.trigger.classList.contains("is-playing"));
  if (isPlaying) {
    pauseRadio();
  } else {
    playRadio();
  }
}

radioControls.forEach((control) => {
  control.trigger.addEventListener("click", toggleRadio);
  control.trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRadio();
    }
  });
});

if (radioControls.length && localStorage.getItem(RADIO_STORAGE_KEY) === "true") {
  playRadio({ isResume: true });
}
