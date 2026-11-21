# TSS GAMESPACE — Arcade Launcher

A responsive browser-based arcade that brings your HTML5 games together in one place. Browse the library, search or filter by genre, launch a game in a fullscreen-style player, and return to the lobby without opening a new tab.

> **Your arcade. Your rules.**

## Features

- **Unified game library:** Launch all registered games from one lobby.
- **Search:** Find games by name, category, description, or letter.
- **Genre filters:** Browse Action, Strategy, Adventure, Puzzle, Racing, and Classics.
- **Surprise Me:** Launch a random game from the currently visible results. When possible, it avoids choosing the same game twice in a row.
- **Fullscreen-style player:** Each game loads inside a viewport-sized iframe.
- **Quick return control:** Tap or click the curved top-left handle to reveal the **Back to Library** button. The button hides automatically after five seconds if it is not used.
- **Loading and error states:** The player displays a loading screen and a fallback message if a game does not load in time.
- **Responsive layout:** Designed for desktop, tablets, and mobile screens, including phone safe areas and landscape layouts.
- **Keyboard support:** Use `/` to focus search, `Escape` to clear a focused search field, and `Enter` or `Space` on the player handle to reveal the return button.

## Project structure

Keep this structure, or update the paths in `app.js` when you organize your own files:

```text
 tss-gamespace/
 ├── index.html
 ├── style.css
 ├── app.js
 ├── README.md
 └── games/
     ├── Battle_Royale_3D_mobile.html
     ├── chess_mobile.html
     ├── cyber_runner_3d_mobile.html
     ├── Dungeon_Hopper_mobile.html
     ├── Katana_Type_mobile.html
     ├── memory.html
     ├── Neon_Drift_mobile.html
     ├── puzzle.html
     ├── runner.html
     ├── snake.html
     └── sudoku_mobile.html
```

Each game can also have its own CSS, JavaScript, images, audio, fonts, and other assets. Keep those files in the locations expected by the game's own relative paths.

## Games included

The launcher currently registers these 11 games:

| Game | Genre |
|---|---|
| Battle Royale 3D | Action & Survival |
| Chess | Strategy & Board |
| Cyber Runner 3D | Action & Endless Runner |
| Dungeon Hopper | Adventure & Arcade |
| Katana Type | Action & Typing |
| Memory Match | Brain & Puzzle |
| Neon Drift | Racing & Driving |
| Number Puzzle | Brain & Puzzle |
| Neon Runner | Action |
| Snake | Classic Arcade |
| Sudoku | Logic & Puzzle |

The cards are generated from the `GAME_LIST` array in `app.js`. The game count and category counts update from that registry.

## Run locally

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Install the **Live Server** extension if you do not already have it.
4. Open `index.html` with **Go Live**.
5. Select a game card to launch it.

A local web server is recommended. Opening `index.html` directly using a `file://` URL may behave differently between browsers, especially when a game loads its own resources inside the iframe.

## Add your own games

1. Copy the game's HTML file into the `games/` folder (or another folder inside the project).
2. Copy its required CSS, JavaScript, images, audio, and other assets while preserving the relative paths used by the game.
3. Open `app.js` and add a new object to the `GAME_LIST` array:

```js
{
  id: "my-game",
  name: "My Game",
  letter: "M",
  category: "Action",
  file: "games/my-game.html",
  accent: "#c9ff47",
  description: "A short description of the game"
}
```

4. Add the object before the closing `];` of `GAME_LIST`.
5. Save the file and refresh the browser.

### Game entry fields

| Field | Purpose |
|---|---|
| `id` | Unique identifier for the game. Use a lowercase, hyphen-separated value. |
| `name` | Name displayed on the game card and in the player title. |
| `letter` | Large initial displayed in the card artwork. |
| `category` | Genre used by the category filter system. |
| `file` | Path to the game's HTML file, relative to `index.html`. |
| `accent` | Hex colour used for the game's card accent. |
| `description` | Short text displayed under the game name. |

Use the existing category wording where possible so the game appears under the expected filter. The current filters recognize keywords for Action, Strategy, Adventure, Puzzle, Racing, and Classics. If you add a new genre, update the `FILTERS` and `FILTER_MATCHERS` definitions in `app.js` as well.

### Asset path example

If a game is stored like this:

```text
 games/
 ├── my-game.html
 └── my-game-assets/
     ├── game.css
     ├── game.js
     └── player.png
```

Then the HTML file should reference those assets using paths such as `my-game-assets/game.css`, `my-game-assets/game.js`, and `my-game-assets/player.png`, assuming the HTML file is in the `games/` directory.

## Player controls

- **Open a game:** Select its card in the lobby.
- **Show the return button:** Tap or click the curved handle in the top-left corner of the player. You can also focus the handle and press `Enter` or `Space`.
- **Return to the lobby:** Select **BACK TO LIBRARY** after it appears. It automatically hides after five seconds, so tap or click the handle again to reveal it.
- **While a game is open:** `Escape` intentionally does not close the player. Use the return handle instead.
- **Search the library:** Press `/` when you are not typing in another field. Press `Escape` while the search field is focused to clear the query or remove focus.

The launcher unloads the iframe when you return to the lobby, which stops that game's page, scripts, and audio. Game progress is not automatically saved by the launcher; each game must implement its own save system if needed.

## Test on a phone or tablet

To test on a mobile device connected to the same Wi-Fi network:

1. Start the project with VS Code Live Server on your computer.
2. Find your computer's local IPv4 address.
3. On your phone, open the Live Server address using that IP and the port shown by Live Server. For example: `http://192.168.1.10:5500/`.
4. Make sure both devices are connected to the same network and that your firewall allows the connection.

For public access, deploy the project to GitHub Pages or another static hosting service.

## Deploy to GitHub Pages

1. Create a GitHub repository, for example `tss-arcade-hub`.
2. Upload or push the **contents** of the project folder so that `index.html`, `style.css`, and `app.js` are in the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The published address will appear in the Pages settings.

After updating the project, commit and push the changes to the selected branch. GitHub Pages will publish the updated static files.

### Important deployment notes

- Keep `index.html`, `style.css`, and `app.js` together in the repository root unless you update the references in `index.html`.
- Keep the `games/` directory and all game assets in the repository.
- File and folder names are case-sensitive on GitHub Pages. Make sure every `file` path in `GAME_LIST` matches the actual filename and capitalization exactly.
- Use relative paths for local game files and their assets. Avoid local computer paths such as `C:\Users\...`.

## Known limitations

- The player is a viewport-sized iframe, not browser or operating-system kiosk mode.
- A game may request browser fullscreen or pointer lock independently. The launcher cannot override those APIs; games that use them should provide their own exit handling.
- Browsers do not always report missing iframe files through `onerror`. The launcher uses a 15-second loading fallback, but a slow-loading game may also reach that fallback.
- The launcher does not provide shared accounts, leaderboards, cloud saves, or automatic game-progress persistence. Those features need to be implemented separately.
- Google Fonts are loaded from the web. If they are unavailable, the interface falls back to system fonts.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- HTML iframe game embedding

No frontend framework or build step is required.

---

**TSS GAMESPACE — Your arcade. Your rules.**
