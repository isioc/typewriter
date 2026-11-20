// ===== Подключение к Supabase =====
const SUPABASE_URL = "https://bglpoqqrgotnvgfpwgjf.supabase.co";
const SUPABASE_KEY = "sb_publishable_dDtZO10XQfz8A-I-STNlTw_-emIGpB6";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const channel = supabaseClient.channel("typewriter-room");

// ===== Приём комментариев =====
channel.on("broadcast", { event: "comment" }, (message) => {
  addComment(message.payload.name, message.payload.text);
});

function addComment(name, text) {
  const list = document.getElementById("comments-list");
  const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const card = document.createElement("div");
  card.className = "comment";

  const nameEl = document.createElement("div");
  nameEl.className = "comment-name";
  nameEl.textContent = name + " · " + time;

  const textEl = document.createElement("div");
  textEl.className = "comment-text";
  textEl.textContent = text;

  card.append(nameEl, textEl);
  list.prepend(card);
}

channel.subscribe((status) => {
  console.log("Supabase:", status);
});

function send(event, payload) {
  channel.send({ type: "broadcast", event: event, payload: payload });
}

// ===== Звуки =====
const sounds = {
  keys: ["sounds/key1.wav", "sounds/key2.wav", "sounds/key3.wav"],
  space: "sounds/space.wav",
  bell: "sounds/bell.wav",
  return: "sounds/return.wav",
//  backspace: "sounds/backspace.mp3",
};

function playSound(path) {
  const audio = new Audio(path);
  audio.play();
}

function playKind(kind) {
  if (kind === "enter") {
    playSound(sounds.bell);
    setTimeout(() => playSound(sounds.return), 300);
  } else if (kind === "space") {
    playSound(sounds.space);
  //} else if (kind === "backspace") {
  //  playSound(sounds.backspace);
  } else if (kind === "key") {
    const i = Math.floor(Math.random() * sounds.keys.length);
    playSound(sounds.keys[i]);
  }
}

// ===== Поле ввода =====
const textarea = document.getElementById("text");

textarea.value = localStorage.getItem("text") || "";

textarea.addEventListener("keydown", (event) => {
  let kind = null;

  if (event.key === "Enter") kind = "enter";
  else if (event.key === " ") kind = "space";
  else if (event.key === "Backspace") kind = "backspace";
  else if (event.key.length === 1 && !event.ctrlKey) kind = "key";

  if (kind) {
    playKind(kind);
    send("sound", { kind: kind });
  }
});

textarea.addEventListener("input", () => {
  localStorage.setItem("text", textarea.value);
  send("text", { text: textarea.value });
});