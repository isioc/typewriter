const SUPABASE_URL = "https://bglpoqqrgotnvgfpwgjf.supabase.co";
const SUPABASE_KEY = "sb_publishable_dDtZO10XQfz8A-I-STNlTw_-emIGpB6";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const channel = supabaseClient.channel("typewriter-room");

// ===== Звуки (то же, что в script.js) =====
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
  } else if (kind === "backspace") {
    playSound(sounds.backspace);
  } else if (kind === "key") {
    const i = Math.floor(Math.random() * sounds.keys.length);
    playSound(sounds.keys[i]);
  }
}

// ===== Кнопка звука =====
const view = document.getElementById("text");
const startButton = document.getElementById("start");
let soundOn = false;

startButton.addEventListener("click", () => {
  soundOn = true;
  startButton.remove();
});

// ===== Слушаем эфир =====
channel.on("broadcast", { event: "text" }, (message) => {
  view.textContent = message.payload.text;
});

channel.on("broadcast", { event: "sound" }, (message) => {
  if (soundOn) playKind(message.payload.kind);
});

channel.subscribe((status) => {
  console.log("Supabase:", status);
});

// ===== Отправка комментариев =====
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment-input");
const sendButton = document.getElementById("send");

sendButton.addEventListener("click", () => {
  const name = nameInput.value.trim() || "Аноним";
  const text = commentInput.value.trim();

  if (text === "") return;

  channel.send({
    type: "broadcast",
    event: "comment",
    payload: { name: name, text: text },
  });

  commentInput.value = "";
});