/*
 * TSS GAMESPACE — game registry and player controller
 * Add your HTML games to GAME_LIST below.
 *
 * Important:
 * - Keep each game HTML file and its assets together in the project.
 * - Paths are relative to index.html.
 * - Keep each game's CSS, JS, images, and audio paths working.
 * - Use VS Code Live Server (or another local web server) for best results.
 */

const GAME_LIST = [
  {
    id: "battle-royale-3d",
    name: "Battle Royale 3D",
    letter: "B",
    category: "Action & Survival",
    file: "games/Battle_Royale_3D_mobile.html",
    accent: "#ff5577",
    description: "3D battle royale action"
  },
  {
    id: "chess",
    name: "Chess",
    letter: "C",
    category: "Strategy & Board",
    file: "games/chess_mobile.html",
    accent: "#ff626c",
    description: "Classic strategic board game"
  },
  {
    id: "cyber-runner-3d",
    name: "Cyber Runner 3D",
    letter: "C",
    category: "Action & Endless Runner",
    file: "games/cyber_runner_3d_mobile.html",
    accent: "#00dfff",
    description: "Futuristic 3D running action"
  },
  {
    id: "dungeon-hopper",
    name: "Dungeon Hopper",
    letter: "D",
    category: "Adventure & Arcade",
    file: "games/Dungeon_Hopper_mobile.html",
    accent: "#b58aff",
    description: "Dungeon-hopping arcade adventure"
  },
  {
    id: "katana-type",
    name: "Katana Type",
    letter: "K",
    category: "Action & Typing",
    file: "games/Katana_Type_mobile.html",
    accent: "#ff79a5",
    description: "Fast-paced typing and katana action"
  },
  {
    id: "memory",
    name: "Memory Match",
    letter: "M",
    category: "Brain & Puzzle",
    file: "games/memory.html",
    accent: "#6ce5d1",
    description: "Test your memory by matching pairs"
  },
  {
    id: "neon-drift",
    name: "Neon Drift",
    letter: "N",
    category: "Racing & Driving",
    file: "games/Neon_Drift_mobile.html",
    accent: "#00f5d4",
    description: "Neon-lit arcade drifting action"
  },
  {
    id: "puzzle",
    name: "Number Puzzle",
    letter: "P",
    category: "Brain & Puzzle",
    file: "games/puzzle.html",
    accent: "#a49bff",
    description: "Solve number-based logic puzzles"
  },
  {
    id: "runner",
    name: "Neon Runner",
    letter: "R",
    category: "Action",
    file: "games/runner.html",
    accent: "#ff986b",
    description: "Fast-paced arcade running challenge"
  },
  {
    id: "snake",
    name: "Snake",
    letter: "S",
    category: "Classic Arcade",
    file: "games/snake.html",
    accent: "#c9ff47",
    description: "Classic snake-growing arcade game"
  },
  {
    id: "sudoku",
    name: "Sudoku",
    letter: "S",
    category: "Logic & Puzzle",
    file: "games/sudoku_mobile.html",
    accent: "#ffd166",
    description: "Solve number-placement logic puzzles"
  }
];

// The categories below group related game labels without changing the registry.
const FILTERS = [
  { id: "all", label: "ALL GAMES" },
  { id: "action", label: "ACTION" },
  { id: "strategy", label: "STRATEGY" },
  { id: "adventure", label: "ADVENTURE" },
  { id: "puzzle", label: "PUZZLE" },
  { id: "racing", label: "RACING" },
  { id: "classic", label: "CLASSICS" }
];

const FILTER_MATCHERS = {
  action: ["action", "survival", "runner", "typing"],
  strategy: ["strategy", "board"],
  adventure: ["adventure"],
  puzzle: ["puzzle", "logic", "brain"],
  racing: ["racing", "driving"],
  classic: ["classic"]
};

const lobbyView = document.getElementById("lobbyView");
const playerView = document.getElementById("playerView");
const gameGrid = document.getElementById("gameGrid");
const gameCount = document.getElementById("gameCount");
const libraryCount = document.getElementById("libraryCount");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const gameFrame = document.getElementById("gameFrame");
const exitHandle = document.getElementById("exitHandle");
const homeButton = document.getElementById("homeButton");
const playerLoading = document.getElementById("playerLoading");
const playerError = document.getElementById("playerError");
const errorBackButton = document.getElementById("errorBackButton");
const homeBrand = document.getElementById("homeBrand");
const filterBar = document.getElementById("filterBar");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const randomGameButton = document.getElementById("randomGameButton");
const browseButton = document.getElementById("browseButton");
const totalStat = document.getElementById("totalStat");
const genreStat = document.getElementById("genreStat");
const currentYear = document.getElementById("currentYear");

let activeGame = null;
let activeFilter = "all";
let loadingTimer = null;
let frameLoadTimeout = null;
let homeButtonTimer = null;
let lastRandomGameId = null;
let loadingStartedAt = 0;

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function getFilterForGame(game) {
  const category = (game.category || "").toLowerCase();
  for (const [filterId, keywords] of Object.entries(FILTER_MATCHERS)) {
    if (keywords.some((keyword) => category.includes(keyword))) return filterId;
  }
  return "all";
}

function getFilteredGames(query = searchInput.value) {
  const normalizedQuery = query.trim().toLowerCase();

  return GAME_LIST.filter((game) => {
    const searchableText = `${game.name} ${game.category} ${game.description} ${game.letter}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesFilter = activeFilter === "all" || getFilterForGame(game) === activeFilter;
    return matchesSearch && matchesFilter;
  });
}

function buildFilters() {
  if (!filterBar) return;

  filterBar.replaceChildren();
  FILTERS.forEach((filter) => {
    const count = filter.id === "all"
      ? GAME_LIST.length
      : GAME_LIST.filter((game) => getFilterForGame(game) === filter.id).length;

    // Do not show a category chip when there are no games in that category.
    if (filter.id !== "all" && count === 0) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${filter.id === activeFilter ? " active" : ""}`;
    button.dataset.filter = filter.id;
    button.setAttribute("aria-pressed", String(filter.id === activeFilter));

    const label = document.createElement("span");
    label.className = "filter-label";
    label.textContent = filter.label;
    const countLabel = document.createElement("span");
    countLabel.textContent = padNumber(count);

    button.append(label, countLabel);
    button.addEventListener("click", () => {
      activeFilter = filter.id;
      buildFilters();
      renderGames();
    });
    filterBar.appendChild(button);
  });
}

function createGameCard(game, index, total) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "game-card";
  card.style.setProperty("--game-accent", game.accent || "#c9ff47");
  card.setAttribute("aria-label", `Play ${game.name}`);
  card.dataset.gameId = game.id;

  const art = document.createElement("span");
  art.className = "card-art";

  const gridLines = document.createElement("span");
  gridLines.className = "card-grid-lines";
  gridLines.setAttribute("aria-hidden", "true");

  const indexLabel = document.createElement("span");
  indexLabel.className = "card-index";
  indexLabel.textContent = `${padNumber(index + 1)} / ${padNumber(total)}`;

  const corner = document.createElement("span");
  corner.className = "card-corner";
  corner.setAttribute("aria-hidden", "true");
  corner.textContent = "↗";

  const letter = document.createElement("span");
  letter.className = "card-letter";
  letter.setAttribute("aria-hidden", "true");
  letter.textContent = game.letter || game.name.charAt(0).toUpperCase();

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = game.category || "ARCADE GAME";

  art.append(gridLines, indexLabel, corner, letter, category);

  const info = document.createElement("span");
  info.className = "card-info";

  const infoMain = document.createElement("span");
  infoMain.className = "card-info-main";

  const title = document.createElement("span");
  title.className = "card-title-text";
  // The stylesheet targets the heading element for a semantic card title.
  const heading = document.createElement("h3");
  heading.textContent = game.name;

  const description = document.createElement("p");
  description.textContent = game.description || game.category || "Arcade game";

  infoMain.append(heading, description);

  const playArrow = document.createElement("span");
  playArrow.className = "play-arrow";
  playArrow.setAttribute("aria-hidden", "true");
  playArrow.textContent = "↗";

  info.append(infoMain, playArrow);
  card.append(art, info);
  card.addEventListener("click", () => launchGame(game));
  return card;
}

function renderGames(query = searchInput.value) {
  const filteredGames = getFilteredGames(query);
  const fragment = document.createDocumentFragment();

  filteredGames.forEach((game, index) => {
    fragment.appendChild(createGameCard(game, index, filteredGames.length));
  });

  gameGrid.replaceChildren(fragment);
  gameGrid.setAttribute("aria-busy", "false");
  gameCount.textContent = `${padNumber(GAME_LIST.length)} GAMES`;
  libraryCount.textContent = `/ ${padNumber(filteredGames.length)}`;
  emptyState.hidden = filteredGames.length !== 0;

  if (totalStat) totalStat.textContent = padNumber(GAME_LIST.length);
  if (genreStat) genreStat.textContent = padNumber(FILTERS.length - 1);
}

function clearFilters() {
  activeFilter = "all";
  searchInput.value = "";
  buildFilters();
  renderGames("");
  searchInput.blur();
}

function launchRandomGame() {
  const candidates = getFilteredGames();
  if (candidates.length === 0) return;

  let options = candidates;
  if (candidates.length > 1 && lastRandomGameId) {
    options = candidates.filter((game) => game.id !== lastRandomGameId);
  }

  const selectedGame = options[Math.floor(Math.random() * options.length)];
  lastRandomGameId = selectedGame.id;
  launchGame(selectedGame);
}

function launchGame(game) {
  if (!game || !game.file) return;

  activeGame = game;
  hideHomeButton();
  playerError.hidden = true;
  playerLoading.hidden = false;
  lobbyView.hidden = true;
  playerView.hidden = false;
  document.body.classList.add("player-active");
  document.title = `${game.name} — TSS GAMES`;
  loadingStartedAt = Date.now();

  // Clear the previous document before loading the selected game.
  gameFrame.onload = () => {
    clearTimeout(frameLoadTimeout);
    const elapsed = Date.now() - loadingStartedAt;
    const remaining = Math.max(0, 350 - elapsed);
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      playerLoading.hidden = true;
      playerError.hidden = true;
    }, remaining);
  };

  gameFrame.onerror = showLoadError;
  gameFrame.src = game.file;

  // Some browsers do not fire iframe onerror for a missing local HTML file.
  // This timeout is a fallback for cases where the frame never finishes loading.
  clearTimeout(frameLoadTimeout);
  frameLoadTimeout = setTimeout(() => {
    if (!playerLoading.hidden) showLoadError();
  }, 15000);
}

function showLoadError() {
  clearTimeout(loadingTimer);
  clearTimeout(frameLoadTimeout);
  playerLoading.hidden = true;
  playerError.hidden = false;
}

function returnToLobby() {
  if (playerView.hidden) return;
  const previousGameId = activeGame?.id || "";

  hideHomeButton();
  clearTimeout(loadingTimer);
  clearTimeout(frameLoadTimeout);
  gameFrame.onload = null;
  gameFrame.onerror = null;

  // Unloading the iframe stops the game's page, audio, and scripts.
  gameFrame.src = "about:blank";
  playerView.hidden = true;
  lobbyView.hidden = false;
  playerLoading.hidden = true;
  playerError.hidden = true;
  document.body.classList.remove("player-active");
  document.title = "TSS GAMES — Your Arcade, Your Rules";
  activeGame = null;

  // Preserve the active search/filter and return keyboard focus to the game tile.
  renderGames();
  const focusCard = [...gameGrid.querySelectorAll(".game-card")].find((card) => card.dataset.gameId === previousGameId);
  if (focusCard) focusCard.focus();
}

function showHomeButton() {
  homeButton.hidden = false;
  clearTimeout(homeButtonTimer);
  homeButtonTimer = setTimeout(hideHomeButton, 5000);
}

function hideHomeButton() {
  clearTimeout(homeButtonTimer);
  homeButton.hidden = true;
}

// Tap/click or use Enter/Space on the curved corner to reveal the return button.
exitHandle.addEventListener("click", (event) => {
  event.preventDefault();
  showHomeButton();
});

exitHandle.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  showHomeButton();
  homeButton.focus();
});

homeButton.addEventListener("click", () => {
  hideHomeButton();
  returnToLobby();
});

errorBackButton.addEventListener("click", returnToLobby);
homeBrand.addEventListener("click", (event) => {
  event.preventDefault();
  if (!playerView.hidden) {
    returnToLobby();
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

searchInput.addEventListener("input", () => renderGames(searchInput.value));
clearFiltersButton.addEventListener("click", clearFilters);
randomGameButton.addEventListener("click", launchRandomGame);
browseButton.addEventListener("click", () => {
  // The anchor performs the scroll; this keeps the library navigation state simple.
  document.querySelectorAll(".top-nav-link").forEach((link) => link.classList.remove("active"));
  document.querySelector('.top-nav-link[href="#library"]')?.classList.add("active");
});

document.querySelector('.top-nav-link[href="#library"]')?.addEventListener("click", () => {
  document.querySelectorAll(".top-nav-link").forEach((link) => link.classList.remove("active"));
  document.querySelector('.top-nav-link[href="#library"]')?.classList.add("active");
});

document.querySelector('.top-nav-link[href="#aboutArcade"]')?.addEventListener("click", () => {
  document.querySelectorAll(".top-nav-link").forEach((link) => link.classList.remove("active"));
  document.querySelector('.top-nav-link[href="#aboutArcade"]')?.classList.add("active");
});

document.addEventListener("keydown", (event) => {
  if (!playerView.hidden) {
    if (event.key === "Escape") {
      // Escape intentionally does not exit the game. Use the corner handle instead.
      event.preventDefault();
    }
    return;
  }

  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if (event.key === "/" && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape" && document.activeElement === searchInput) {
    if (searchInput.value) {
      searchInput.value = "";
      renderGames("");
    } else {
      searchInput.blur();
    }
  }
});

if (currentYear) currentYear.textContent = String(new Date().getFullYear());
buildFilters();
renderGames("");
