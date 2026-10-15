import { fetchJoke } from "../fetch";

const newJokeElement = document.querySelector(".joke__text");
const getNewJokeButton = document.querySelector(".joke__new");
const saveJokeButton = document.querySelector(".joke__save");
const savedJokesList = document.querySelector(".savedJokes__list");

let savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];

async function getNewJoke() {
  const joke = await fetchJoke();
  newJokeElement.innerText = joke;

  saveJokeButton.classList.remove("joke__save--unvisible");
}

function updateLocalStorage() {
  localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
}

function updateEmptyMessage() {
  const emptyMessage = savedJokesList.querySelector("em");

  if (savedJokes.length === 0) {
    if (!emptyMessage) {
      savedJokesList.innerHTML = "<em>Noch keine Witze gespeichert</em>";
    }
  } else if (emptyMessage) {
    emptyMessage.remove();
  }
}

function createSavedJoke(joke, index) {
  const savedJoke = document.createElement("div");

  savedJoke.classList.add("savedJoke");

  const savedJokeText = document.createElement("div");

  savedJokeText.classList.add("savedJoke__text");

  savedJokeText.innerText = joke;

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";

  deleteButton.classList.add("savedJoke__delete");

  deleteButton.setAttribute("aria-label", "Witz löschen");

  deleteButton.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="savedJoke__deleteIcon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
      />
    </svg>
  `;

  deleteButton.addEventListener("click", function () {
    savedJokes.splice(index, 1);

    updateLocalStorage();

    renderSavedJokes();
  });

  savedJoke.appendChild(savedJokeText);

  savedJoke.appendChild(deleteButton);

  savedJokesList.appendChild(savedJoke);
}

function renderSavedJokes() {
  savedJokesList.innerHTML = "";

  savedJokes.forEach(function (joke, index) {
    createSavedJoke(joke, index);
  });

  updateEmptyMessage();
}

function saveJoke() {
  const joke = newJokeElement.innerText;

  savedJokes.push(joke);

  updateLocalStorage();

  renderSavedJokes();
}

getNewJokeButton.addEventListener("click", getNewJoke);

saveJokeButton.addEventListener("click", saveJoke);

renderSavedJokes();

const themeToggleButton = document.querySelector(".theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle__icon");

let currentTheme;
try {
  currentTheme = localStorage.getItem("theme") === "light" ? "light" : "dark";
} catch (error) {
  currentTheme = "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const isDarkMode = theme === "dark";

  themeToggleIcon.innerText = isDarkMode ? "☀️" : "🌙";

  themeToggleButton.title = isDarkMode ? "Light Mode" : "Dark Mode";

  themeToggleButton.setAttribute("aria-pressed", String(isDarkMode));
  themeToggleButton.setAttribute("aria-label", isDarkMode ? "Zum Light Mode wechseln" : "Zum Dark Mode wechseln");
}

themeToggleButton.addEventListener("click", function () {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(currentTheme);

  try {
    localStorage.setItem("theme", currentTheme);
  } catch (error) {
    console.warn("Die Theme-Einstellung konnte nicht gespeichert werden.", error);
  }
});

applyTheme(currentTheme);
