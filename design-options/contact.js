document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#']");
  if (!link) return;
  const target = document.getElementById(link.getAttribute("href").slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
});

if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
  history.replaceState(null, "", location.pathname + location.search);
}

document.querySelectorAll("[data-reel]").forEach((reel) => {
  const track = reel.querySelector(".reel-track");
  const slides = [...track.children];
  const dots = reel.querySelector(".reel-dots");
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show image ${i + 1}`);
    dot.addEventListener("click", () => show(i));
    dots.appendChild(dot);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;

  function arm() {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => show(index + 1), 3000);
  }

  function show(next) {
    slides.forEach((slide) => slide.querySelectorAll("video").forEach((video) => video.pause()));
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dots.children].forEach((dot, i) => dot.classList.toggle("is-on", i === index));
    arm();
  }

  reel.querySelectorAll("video").forEach((video) => {
    video.addEventListener("play", () => clearInterval(timer));
    video.addEventListener("pause", arm);
    video.addEventListener("ended", arm);
  });

  reel.addEventListener("mouseenter", () => clearInterval(timer));
  reel.addEventListener("mouseleave", arm);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer);
    else arm();
  });

  reel.querySelector(".reel-prev").addEventListener("click", () => show(index - 1));
  reel.querySelector(".reel-next").addEventListener("click", () => show(index + 1));

  const viewport = reel.querySelector(".reel-viewport");
  let startX = 0;
  viewport.addEventListener("pointerdown", (event) => { startX = event.clientX; });
  viewport.addEventListener("pointerup", (event) => {
    const move = event.clientX - startX;
    if (Math.abs(move) > 40) show(index + (move < 0 ? 1 : -1));
  });

  show(0);
});

const form = document.querySelector("form[name=contact]");
const note = document.getElementById("form-note");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const lines = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone") || "—"}`,
    `I need: ${data.get("reason")}`,
    "",
    data.get("message")
  ];
  const subject = `New note for Passion Fruit — ${data.get("name")}`;
  window.location.href = `mailto:liz@passionfruitvo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  note.hidden = false;
  note.textContent = "Your email app is opening with this note addressed to Liz. Press send there. If nothing opens, call +1 770 361 7264.";
});
