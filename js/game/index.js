// START BUTTON HANDLER - Saves player selections and starts the game
// This script runs on the selection screen (index.html).
// When the player clicks the "Start" button, it stores their chosen hero and map
// in localStorage, then navigates to the main game page (main.html).

document.getElementById('start').onclick = () => {

  // Read selected values from the dropdowns
  // These elements are <select> inputs with IDs 'hero' and 'map'.
  // Their selected values correspond directly to file names in:
  //   js/heroes/<hero>.js
  //   js/maps/<map>.js
  const heroValue = document.getElementById('hero').value;
  const mapValue = document.getElementById('map').value;

  // Save selections to localStorage
  // localStorage acts like a small, persistent key-value database in the browser.
  // These values can be read later by the game loader script (game-loader.js)
  // to dynamically import the correct hero and map files.
  localStorage.setItem('selectedHero', heroValue);
  localStorage.setItem('selectedMap', mapValue);

  // Log the selections for debugging — useful for checking exact case or typos.
  console.log('Selected Hero:', heroValue);
  console.log('Selected Map:', mapValue);

  // Navigate to the main game page
  // Once selections are stored, redirect to main.html where the loader will:
  //   1. Read localStorage values,
  //   2. Dynamically import the corresponding hero/map modules,
  //   3. Start the game engine.
  window.location.href = 'game.html';
};
