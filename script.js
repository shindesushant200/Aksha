const screens = [...document.querySelectorAll(".screen")];

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top: 0, behavior: "smooth"});
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

document.getElementById("skipIntro").addEventListener("click", () => showScreen("balloons"));

/* Balloons */
let popped = 0;
document.querySelectorAll(".balloon").forEach(balloon => {
  balloon.addEventListener("click", () => {
    if (balloon.classList.contains("popped")) return;
    balloon.classList.add("popped");
    popped++;
    document.getElementById("popped").textContent = popped;
    if (popped === 4) {
      setTimeout(() => document.getElementById("balloonNext").classList.remove("hidden"), 350);
      confetti();
    }
  });
});
document.getElementById("balloonNext").addEventListener("click", () => showScreen("cake"));

/* Cake */
document.getElementById("cakeButton").addEventListener("click", () => {
  const cake = document.getElementById("cakeButton");
  if (cake.classList.contains("blown")) return;
  cake.classList.add("blown");
  document.getElementById("wish").textContent = "Wish made! May every little dream come true. ✨";
  document.getElementById("cakeNext").classList.remove("hidden");
  confetti();
});
document.getElementById("cakeNext").addEventListener("click", () => showScreen("bouquet"));

/* Memories — replace these images/captions with your own */
const memories = [
  ["assets/images/memory-1.svg", "Happy Birthday! 💗"],
  ["assets/images/memory-2.svg", "One of my favorite memories ✨"],
  ["assets/images/memory-3.svg", "More adventures together 🌸"],
  ["assets/images/memory-4.svg", "Always a little happier with you 🥰"]
];
let memoryIndex = 0;

const image = document.getElementById("memoryImage");
const caption = document.getElementById("memoryCaption");
const dots = document.getElementById("memoryDots");

memories.forEach((_, i) => {
  const d = document.createElement("span");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.addEventListener("click", () => setMemory(i));
  dots.appendChild(d);
});

function setMemory(i) {
  memoryIndex = (i + memories.length) % memories.length;
  image.src = memories[memoryIndex][0];
  caption.textContent = memories[memoryIndex][1];
  document.querySelectorAll(".dot").forEach((d, j) => d.classList.toggle("active", j === memoryIndex));
  document.getElementById("polaroid").animate(
    [{transform:"rotate(-2deg) scale(.96)", opacity:.4}, {transform:"rotate(-2deg) scale(1)", opacity:1}],
    {duration:300, easing:"ease-out"}
  );
}
document.getElementById("prevMemory").addEventListener("click", () => setMemory(memoryIndex - 1));
document.getElementById("nextMemory").addEventListener("click", () => setMemory(memoryIndex + 1));

let startX = null;
document.getElementById("polaroid").addEventListener("pointerdown", e => startX = e.clientX);
document.getElementById("polaroid").addEventListener("pointerup", e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 45) setMemory(memoryIndex + (dx < 0 ? 1 : -1));
  startX = null;
});

/* Letter */
document.getElementById("heartStamp").addEventListener("click", () => {
  document.getElementById("letterText").classList.add("reveal");
});

/* Restart */
document.getElementById("restart").addEventListener("click", () => {
  popped = 0;
  document.querySelectorAll(".balloon").forEach(b => b.classList.remove("popped"));
  document.getElementById("popped").textContent = "0";
  document.getElementById("balloonNext").classList.add("hidden");
  const cake = document.getElementById("cakeButton");
  cake.classList.remove("blown");
  document.getElementById("wish").textContent = "Make a beautiful wish...";
  document.getElementById("cakeNext").classList.add("hidden");
  document.getElementById("letterText").classList.remove("reveal");
  setMemory(0);
  showScreen("welcome");
});

/* Small background hearts */
const heartLayer = document.querySelector(".hearts");
setInterval(() => {
  const h = document.createElement("span");
  h.className = "floating-heart";
  h.textContent = Math.random() > .5 ? "♥" : "♡";
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (12 + Math.random() * 18) + "px";
  h.style.animationDuration = (6 + Math.random() * 5) + "s";
  heartLayer.appendChild(h);
  setTimeout(() => h.remove(), 11000);
}, 900);

function confetti() {
  for (let i = 0; i < 18; i++) {
    const c = document.createElement("span");
    c.textContent = ["💗","✨","🌸","💕"][Math.floor(Math.random()*4)];
    c.style.position = "fixed";
    c.style.left = "50%";
    c.style.top = "48%";
    c.style.zIndex = "99";
    c.style.fontSize = (14 + Math.random()*18) + "px";
    c.animate([
      {transform:"translate(-50%,-50%) scale(.5)", opacity:1},
      {transform:`translate(${(Math.random()-.5)*320}px, ${(Math.random()-.5)*380}px) rotate(${Math.random()*300-150}deg)`, opacity:0}
    ], {duration:900 + Math.random()*700, easing:"cubic-bezier(.2,.7,.2,1)"}).finished.then(() => c.remove());
    document.body.appendChild(c);
  }
}
