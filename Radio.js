// SomaFM channels -- ambient/downtempo etc, streamed live via Icecast.
// Public direct stream URLs, permissive CORS (Access-Control-Allow-Origin: *).
// Same four channels somafm.com's own site groups together; "Shuffle channel"
// on the Contact page picks a random one of the other three.
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
const RADIO_CHANNELS = [
  { id: "groovesalad", name: "Groove Salad", genre: "Ambient/downtempo" },
  { id: "dronezone", name: "Drone Zone", genre: "Ambient" },
  { id: "secretagent", name: "Secret Agent", genre: "Lounge/jazz" },
  { id: "indiepop", name: "Indie Pop Rocks!", genre: "Indie pop/rock" },
];
const RADIO_LABEL_CONNECTING = "Connecting…";
const RADIO_LABEL_ERROR = "Stream unavailable";
const RADIO_STORAGE_KEY = "radioPlaying";
const RADIO_CHANNEL_STORAGE_KEY = "radioChannel";

const radioDockWrap = document.getElementById("radio-dock-wrap");
const radioShuffleBtn = document.getElementById("radio-shuffle");

const radioControls = [
  { trigger: document.getElementById("radio-widget"), label: document.getElementById("radio-label") },
  { trigger: document.getElementById("radio-dock"), label: document.getElementById("radio-dock-label") },
].filter((control) => control.trigger);

let radioAudio = null;
let currentChannel =
  RADIO_CHANNELS.find((c) => c.id === localStorage.getItem(RADIO_CHANNEL_STORAGE_KEY)) || RADIO_CHANNELS[0];

function streamUrlFor(channel) {
  return `https://ice1.somafm.com/${channel.id}-128-mp3`;
}

function idleLabel() {
  return `${currentChannel.name} · SomaFM`;
}

function playingLabel() {
  return `${currentChannel.name} · ${currentChannel.genre} · SomaFM`;
}

function resumeLabel() {
  return `Tap to resume · ${currentChannel.name}`;
}

function setRadioLabel(text) {
  radioControls.forEach((control) => {
    if (control.label) control.label.textContent = text;
  });
}

function updateRadioAria() {
  radioControls.forEach((control) => {
    control.trigger.setAttribute("aria-label", `Play live radio, ${currentChannel.name} from SomaFM`);
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
    radioAudio = new Audio(streamUrlFor(currentChannel));
    radioAudio.preload = "none";
    radioAudio.addEventListener("waiting", () => setRadioLabel(RADIO_LABEL_CONNECTING));
    radioAudio.addEventListener("playing", () => setRadioLabel(playingLabel()));
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
      setRadioLabel(isResume ? resumeLabel() : RADIO_LABEL_ERROR);
      if (!isResume) localStorage.removeItem(RADIO_STORAGE_KEY);
    });
}

function pauseRadio() {
  if (radioAudio) radioAudio.pause();
  setRadioPlayingState(false);
  setRadioLabel(idleLabel());
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

// Switches the live stream to a different SomaFM channel. If nothing is
// currently playing this just remembers the choice (label/aria update,
// nothing connects until the visitor presses play); if it's mid-playback the
// old stream is torn down and the new one starts immediately in its place.
function switchToChannel(channel, { keepPlaying } = {}) {
  currentChannel = channel;
  localStorage.setItem(RADIO_CHANNEL_STORAGE_KEY, channel.id);
  updateRadioAria();
  if (radioAudio) {
    radioAudio.pause();
    radioAudio.src = streamUrlFor(channel);
  }
  if (keepPlaying) {
    playRadio();
  } else {
    setRadioLabel(idleLabel());
  }
}

function shuffleRadio() {
  const isPlaying = radioControls.some((control) => control.trigger.classList.contains("is-playing"));
  const alternatives = RADIO_CHANNELS.filter((channel) => channel.id !== currentChannel.id);
  const next = alternatives[Math.floor(Math.random() * alternatives.length)];
  switchToChannel(next, { keepPlaying: isPlaying });
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

radioShuffleBtn?.addEventListener("click", shuffleRadio);

if (radioControls.length) {
  updateRadioAria();
  if (localStorage.getItem(RADIO_STORAGE_KEY) === "true") {
    playRadio({ isResume: true });
  } else {
    setRadioLabel(idleLabel());
  }
}
