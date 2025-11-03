// Game Loader - Handles loading heroes, weapons, and maps, then starts the game.

import { startGame } from './game-engine.js';
import { showUI, hideLoading, showError, setCurrentHero } from './ui-manager.js';

// Read player selections from localStorage
const heroName = localStorage.getItem('selectedHero') || 'Cane';
const mapName = localStorage.getItem('selectedMap') || 'Training-Camp';

console.log('Loading hero:', heroName);
console.log('Loading map:', mapName);

// Dynamically load both the hero and map modules
Promise.all([
    import(`./heroes/${heroName}.js`).catch(err => {
        console.error('Hero import error:', err);
        throw new Error(`Failed to load hero: ${heroName}.js. Make sure the file exists in js/game/heroes/`);
    }),

    import(`./maps/${mapName}.js`).catch(err => {
        console.error('Map import error:', err);
        throw new Error(`Failed to load map: ${mapName}.js. Make sure the file exists in js/game/maps/`);
    })
])

.then(([heroModule, mapModule]) => {
    hideLoading();
    showUI();

    // Show crosshair now that the game is ready
    const crosshair = document.getElementById('crosshair');
    if (crosshair) crosshair.style.display = 'block';

    // Set the current hero for F1 info popup
    setCurrentHero(heroName);

    // Create hero, weapon, and map
    const hero = heroModule.createHero();
    const weapon = heroModule.createWeapon();
    const map = mapModule.createMap();

    // Get spawn position and rotation from map (with defaults if not specified)
    const spawnPos = mapModule.spawnPosition || { x: 0, y: 2, z: 5 };
    const spawnRot = mapModule.spawnRotation || { yaw: 0 };
    console.log('Spawn position:', spawnPos);
    console.log('Spawn rotation:', spawnRot);

    // NEW: Call the hero's icon display function if it exists
    if (heroModule.showCharacterIcon) {
        heroModule.showCharacterIcon();
    } else {
        console.warn(`Hero ${heroName} does not have a showCharacterIcon function`);
    }

    // Start the game with hero, map, weapon, spawn position, and rotation
    startGame(hero, map, weapon, spawnPos, spawnRot);
})

.catch(err => {
    console.error('Error loading modules:', err);
    showError(err.message);
});