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

const form = document.querySelector("form[name=contact]");
const note = document.getElementById("form-note");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  note.hidden = false;
  note.textContent = "Sending…";
  try {
    const body = new URLSearchParams(new FormData(form)).toString();
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) throw new Error("send failed");
    form.reset();
    note.textContent = "Received. Liz will be in touch. If it is time-sensitive, call +1 770 361 7264.";
  } catch (error) {
    note.textContent = "The note did not send. Please call +1 770 361 7264.";
  } finally {
    button.disabled = false;
  }
});
