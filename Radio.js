// Live music streams -- official 24/7 YouTube livestreams, played through
// YouTube's own embed player (each channel owner has embedding switched on,
// checked via YouTube's oEmbed endpoint). This replaced SomaFM's direct
// Icecast streams after SomaFM's terms banned website embedding and started
// answering this site's requests with 403s (see DESIGN.md).
//
// Contact page only: YouTube's terms require the player to stay visible, so
// there's no hidden audio-only playback and no docked mini-player following
// the visitor to other pages any more. "Shuffle channel" swaps the iframe to
// a random one of the others; the visitor presses play inside the player.
//
// Each id is a specific livestream's video id, not a channel. Channels
// occasionally end a stream and restart it under a new id -- if one starts
// showing "This live stream recording is not available", look up the
// channel's current live video and update its id here.
const RADIO_CHANNELS = [
  { id: "5yx6BWlEVcY", name: "Chillhop Radio", source: "Chillhop Music" },
  { id: "7NOSDKb0HlU", name: "Lofi Hip Hop Radio", source: "Chillhop Music" },
  { id: "S_MOd40zlYU", name: "Dark Ambient Radio", source: "Lofi Girl" },
  { id: "4xDzrJKXOOY", name: "Synthwave Radio", source: "Lofi Girl" },
];
const RADIO_CHANNEL_STORAGE_KEY = "radioChannel";

const radioPlayer = document.getElementById("radio-player");
const radioLabel = document.getElementById("radio-label");
const radioShuffleBtn = document.getElementById("radio-shuffle");

function readStoredChannelId() {
  try {
    return localStorage.getItem(RADIO_CHANNEL_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeChannelId(id) {
  try {
    localStorage.setItem(RADIO_CHANNEL_STORAGE_KEY, id);
  } catch {
    // Storage blocked (private mode etc.) -- the choice just won't persist.
  }
}

let currentChannel =
  RADIO_CHANNELS.find((c) => c.id === readStoredChannelId()) || RADIO_CHANNELS[0];

function embedUrlFor(channel) {
  // rel=0 keeps the end-screen suggestions to the same channel.
  return `https://www.youtube-nocookie.com/embed/${channel.id}?rel=0`;
}

function showChannel(channel) {
  currentChannel = channel;
  radioPlayer.src = embedUrlFor(channel);
  radioPlayer.title = `${channel.name} by ${channel.source}, live on YouTube`;
  if (radioLabel) radioLabel.textContent = `${channel.name} · ${channel.source} · YouTube`;
}

function shuffleRadio() {
  const alternatives = RADIO_CHANNELS.filter((channel) => channel.id !== currentChannel.id);
  const next = alternatives[Math.floor(Math.random() * alternatives.length)];
  storeChannelId(next.id);
  showChannel(next);
}

if (radioPlayer) {
  // The markup already points at the first channel, so only reload the
  // iframe when the visitor's remembered channel is a different one.
  if (currentChannel !== RADIO_CHANNELS[0]) showChannel(currentChannel);
  radioShuffleBtn?.addEventListener("click", shuffleRadio);
}
