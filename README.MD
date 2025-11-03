# Voidwalker FPS Concept

A browser-based first-person shooter prototype built with **HTML**, **CSS**, and **JavaScript**, powered by **Three.js**.
This early-stage concept draws inspiration from **Star Wars**, **Quake**, and **Overwatch**, blending sci-fi aesthetics with fast-paced arena combat ideas.

## Overview

This project is an experimental FPS concept built using **Three.js**, a JavaScript 3D library for rendering and animation.
It currently focuses on world rendering, hero and map prototypes, and early movement/combat mechanics.

All 3D rendering is handled in the browser — no additional game engines or frameworks are required.

## Features

* Built with **HTML**, **CSS**, and **JavaScript**
* Uses **Three.js** (imported via CDN link)
* Prototype for **arena-based FPS gameplay**
* Inspired by **Star Wars**, **Quake**, and **Overwatch**
* Modular structure (heroes, maps, game logic, etc.)
* Early-stage concept: visuals, movement, and interaction experiments

## Requirements

To run this project correctly, it must be served over **HTTP** — loading directly from file (`file://`) will cause errors due to browser security restrictions.

### Recommended:

* **VS Code** with the **Live Server** extension
  → Right-click `index.html` → **"Open with Live Server"**

### Alternatives:

* **Python 3**

  ```bash
  python -m http.server
  ```
* Any lightweight HTTP server (e.g., Node.js `http-server`)

## How to Run

1. Clone or download the repository.

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   ```
2. Open the folder in your code editor.
3. Run a local server (see above).
4. Open the provided local URL in your browser (e.g. `http://127.0.0.1:5500`).
5. Enjoy testing / modding the concept!

## Future Plans

* Work on existing incomplete maps and heroes
* Implement abilities, weapons, and AI enemy bots
* Add UI elements (Cooldowns & Health)
* Improve lighting, textures, and effects
* Multiplayer experimentation (WebSocket or WebRTC)

## Missing Assets

The assets/ and images/ folders are not included in this repository because they contain large files (such as models, textures, and sounds) that significantly increase the repo size.

Without these files there will be errors loading the game.
These files are required for local development and testing.
Excluding them helps keep the repository lightweight and fast to clone.
If you’re setting up the project locally, you’ll need to create these folders and include your own or placeholder content.
The file structure for these folders is as follows:

images/ : background/ border-icons/ planets/ rank-icons/ voidwalker-icons/ favicon.png

assets/ : models/ sounds/ textures/

## Notes

This project is an **early development concept** and intended for collaboration, experimentation and learning.
Expect incomplete features, placeholder assets, and rapid iteration.

## License

This project is open-source and available under the **MIT License**.
Feel free to mod by adding new maps, heroes, gamemodes, etc.