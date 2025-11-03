// UI Manager - Handles all UI elements and updates

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const uiEl = document.getElementById('ui');
const backBtn = document.getElementById('back-btn');
const fpsEl = document.getElementById('fps');

let uiVisible = false;
let currentHeroName = null; // Track which hero is loaded

// Set current hero (call this from game-loader.js when hero loads)
export function setCurrentHero(heroName) {
    currentHeroName = heroName;
    console.log('Current hero set to:', heroName);
}

// Hero information text
const heroInfo = {
    'Cane': {
        name: 'Cane',
        description: 'Counter grouping specialist',
        abilities: [
            'Blast - Thrown object knocks enemies, self-back, similar to junk mine (8s)',
            'Sticky Bombs - 8 ammo, 20 dmg per shot, sticks to surfaces (6s)'
        ],
        melee: 'Rocket Launcher - 100 dmg per shot, 1 shot per second, no HS',
        playstyle: 'Can rocket jump, takes 0 self dmg'
    },
    'Carpe': {
        name: 'Carpe',
        description: 'Close range, counter angles expert',
        abilities: [
            'Hook - 50 dmg on impact, reels in, hitting hook reduces cooldown by 2s (8s)',
            'Black Hole - Throw ball which drags players towards it (8s)'
        ],
        melee: 'Shotgun - 200 dmg per pump, 6 ammo',
        playstyle: 'Lifesteal - 10% of damage heals, hitting hook gives 20% extra dmg 2s'
    },
    'D-11': {
        name: 'D-11',
        description: 'Single healing, close range support',
        abilities: [
            'Combat Roll - Somersault 2m, take 10% dmg while active (1s, 8s)',
            'Disable Pack - Throw, victim only receives 50% healing, 20 meter radius (10s, 4s)'
        ],
        melee: 'Railgun - HS: 75, BS: 25, 1 per/s, 20 ammo, only dmg no healing',
        playstyle: 'Kill resets combat roll cooldown'
    },
    'Danteh': {
        name: 'Danteh',
        description: 'Horizontal mobility, keeping space, close range',
        abilities: [
            'Deflect - 100% dmg deflected for 4s to facing direction, if 200 dmg deflected cooldown (4s)',
            'Reinforce - Throw Deployable Fortify, recipient ally takes 50% dmg for 4s (8s)'
        ],
        melee: 'Laser - 75 dmg per/s, 100 ammo, 20 ammo per/s',
        playstyle: 'Dmg scales on same target overtime (5/m Gun)'
    },
    'Exo': {
        name: 'Exo',
        description: 'Vertical mobility, keeping space, close range but long range spray',
        abilities: [
            'Jet Boosters - Fly in facing direction 4s (6s), anyone hit gets knocked back 1 meter (10 vs Fly)',
            'Absorption Shield - Absorbs all dmg, self heals 20% of damage taken, for 4s (8s)'
        ],
        melee: 'Gatling Cannons - HS: 10 dmg, BS: 5, 12 ammo per/s, 100ammo',
        playstyle: 'Ammo regenerates when not firing, after 2s gain 20 per second'
    },
    'IM-94': {
        name: 'IM-94',
        description: 'Close range specialist',
        abilities: [
            'Leap - Medium speed jump forwards, 5m, take half damage while in air (3s)',
            'Flame Thrower - 50 dmg per second, 4s (10s), 1 meter radius'
        ],
        melee: 'Machine Gun - HS 40 dmg, BS 20, 5 per/s, 25 ammo',
        playstyle: 'Take 30% dmg reduction for 4s after using leap'
    },
    'Janus': {
        name: 'Janus',
        description: 'Vertical mobility, take space, close range',
        abilities: [
            'Ice Drag (1.5s) - 1st Cast - Launch to angle (5s), enabling an explosion from a wall (flash, staggers, 50 healing if casted down twice, 5s)',
            'Imprison Shield - Bubble, 500 per (10s)'
        ],
        melee: 'Ice Firing Pump - 80 dmg/s, 2.5m range, 100 ammo, 10 ammo/shot',
        playstyle: 'Jumping take 20 dmg after being hit by lighting, healing damage dealt while bubble'
    },
    'Lancer': {
        name: 'Lancer',
        description: 'Horizontal mobility, taking space, close range',
        abilities: [
            'Horizontal Boosters - Launch forwards 15 meters (8s), anyone hit take 50 dmg and knocked back 4 meter',
            'Valrium Shield - 1000 HP, 150 regen per/s, 4s before broken (6s)'
        ],
        melee: 'Warhammer/Laser Spear - 75 dmg per swing, 2m range, 1s refresh',
        playstyle: 'Gain 25% speed boost when swinging'
    },
    'Mae': {
        name: 'Mae',
        description: 'Neutral position, airborne take off less dmg',
        abilities: [
            'Launch (unwork) & Lights to WASD direction (4s) + 4s cooldown (2 cooldown casts) + 10 HS (50 dmg, gravity disabled upward by 10m)',
            'Fear Explosive Grenade - 4s at spawn after kill (15s)'
        ],
        melee: 'Dual Pistols - BS: 8 dmg, HS: 16 dmg, 40 ammo per/s (10 ammo), Heat gun can shoot forever if gun not overheated',
        playstyle: 'Abilities, take 20% movement speed 4s per kill dmg'
    },
    'Moka': {
        name: 'Moka',
        description: 'Single Healing, Long range support',
        abilities: [
            'Sonar Dart - Tagged enemies visible through walls for 6s (8s), works on walls, enemies hit it follows, hit darts towers cooldown (4s)',
            'Boost Dart - x2 healing for ally for 4s on hit enemy (10s)'
        ],
        melee: 'Rifle - 75 Healing / Dmg Per Shot, no HS, 1 shot per second',
        playstyle: '3 shots kill in a row halfs cooldown'
    },
    'Nyx': {
        name: 'Nyx',
        description: 'Long range specialist',
        abilities: [
            'Grapple - Headshot skill from rifle resets the cooldown (8s)',
            'Smoke Grenade - 4s, smoke only applies to enemies, 60% visibility, 2m radius (12s)'
        ],
        melee: 'Pistol - HS: 100, BS: 50, 6 ammo',
        playstyle: 'Wall cling, no time limit, headshot hit gives sonar on hit target'
    },
    'Qin': {
        name: 'Qin',
        description: 'Area denial specialist',
        abilities: [
            'Freeze (3s) - Spawn Gate',
            'Ice - HS: 160 dmg (1s identifier) vs no ramp (no drops CD, dmg CD)'
        ],
        melee: 'Icicles of Death and Ice Stream',
        playstyle: 'Ultimate combine'
    },
    'Raze': {
        name: 'Raze',
        description: 'AOE healing, Long range support',
        abilities: [
            'Slowing Field - Movement abilities are disabled when in the field, 2.5m radius 4s uptime (8s)',
            'Explosive Canister - 50 instant heal & dmg, 25 over 2s (10s)'
        ],
        melee: 'Dart Gun / Nailgun - 70 dmg/healing, 10 ammo, Only Bodyshots',
        playstyle: 'When >20% health gain 20% dmg resistance, when allies >20% health gain 20% increased healing'
    },
    'Vex': {
        name: 'Vex',
        description: 'AOE healing, Close range support',
        abilities: [
            'Knockback - 2 meters, looks like the force with both hands pushing (6s)',
            'Speed Team - Splash Vigorium Field to x2 ally speed, 4s (10s)'
        ],
        melee: 'Capsuelt / Balls - Green Potion / Yellow Heals, 10 ammo, 1 per s, 25 dmg / 50 heals per capsuelt, AOE',
        playstyle: '20% passive self speed boost'
    }
};

// Back button handler
backBtn.onclick = () => {
    window.location.href = 'index.html';
};

// Show/Hide UI functions
export function hideLoading() {
    loadingEl.style.display = 'none';
}

export function showUI() {
    // Don't show UI immediately - wait for user to press ~ key or P
    uiEl.style.display = 'none';
    fpsEl.style.display = 'block';
    backBtn.style.display = 'none';
}

export function showError(message) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.innerHTML = `
    <strong>Error Loading Game</strong><br><br>
    ${message}<br><br>
    <button onclick="window.location.href='index.html'" style="padding: 10px 20px; background: #00ffff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        Back to Menu
    </button>
    `;
}

// Create F1 hero info popup
function createHeroInfoPopup() {
    let popup = document.getElementById('hero-info-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'hero-info-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popup.style.border = '2px solid #00ffff';
        popup.style.borderRadius = '10px';
        popup.style.padding = '30px';
        popup.style.zIndex = '1000';
        popup.style.color = '#ffffff';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.minWidth = '400px';
        popup.style.maxWidth = '600px';
        popup.style.display = 'none';
        popup.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        document.body.appendChild(popup);
    }
    return popup;
}

// Show hero info popup
function showHeroInfo() {
    if (!currentHeroName || !heroInfo[currentHeroName]) {
        console.log('No hero info available for:', currentHeroName);
        return;
    }

    const popup = createHeroInfoPopup();
    const info = heroInfo[currentHeroName];
    
    // Get hero color
    const heroColors = {
        'Cane': '#00b7eb',
        'Carpe': '#b90202',
        'D-11': '#FF9900',
        'Danteh': '#7030A0',
        'Exo': '#66FF66',
        'IM-94': '#504e4e',
        'Janus': '#FF3300',
        'Lancer': '#0000cd',
        'Mae': '#FF3399',
        'Moka': '#00B050',
        'Nyx': '#FFFF00',
        'Qin': '#660033',
        'Raze': '#CC00FF',
        'Vex': '#FFCC00'
    };
    const heroColor = heroColors[currentHeroName] || '#00ffff';
    
    popup.style.borderColor = heroColor;
    popup.innerHTML = `
        <h2 style="margin: 0 0 15px 0; color: ${heroColor}; font-size: 28px;">${info.name}</h2>
        <p style="margin: 0 0 20px 0; font-size: 16px; font-style: italic;">${info.description}</p>
        
        <h3 style="margin: 0 0 10px 0; color: ${heroColor}; font-size: 20px;">Abilities:</h3>
        <ul style="margin: 0 0 20px 0; padding-left: 20px; line-height: 1.8;">
            ${info.abilities.map(ability => `<li>${ability}</li>`).join('')}
        </ul>
        
        <h3 style="margin: 0 0 10px 0; color: ${heroColor}; font-size: 20px;">Playstyle:</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.6;">${info.playstyle}</p>
        
        <p style="margin: 0; font-size: 14px; color: #888; text-align: center;">
            Hold F1 to view | Release to close
        </p>
    `;
    
    popup.style.display = 'block';
    
    // Release pointer lock when info is shown
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}

// Hide hero info popup
function hideHeroInfo() {
    const popup = document.getElementById('hero-info-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// UI Toggle with ` or P key, and F1 for hero info
export function setupUIToggle() {
    console.log('UI Toggle setup initialized'); // Debug log

    document.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.code, e.key); // Debug log

        // Toggle menu with ` or P
        if (e.code === 'Backquote' || e.code === 'KeyP') {
            e.preventDefault(); // Prevent ` character from appearing
            uiVisible = !uiVisible;
            console.log('Toggling UI to:', uiVisible); // Debug log

            uiEl.style.display = uiVisible ? 'block' : 'none';
            backBtn.style.display = uiVisible ? 'block' : 'none';

            // Release pointer lock when menu is open
            if (uiVisible) {
                document.exitPointerLock();
            }
        }

        // Show hero info with F1 (hold)
        if (e.code === 'F1') {
            e.preventDefault(); // Prevent browser's default F1 behavior
            showHeroInfo();
        }
    });

    // Hide hero info when F1 is released
    document.addEventListener('keyup', (e) => {
        if (e.code === 'F1') {
            e.preventDefault();
            hideHeroInfo();
        }
    });
}

// FPS Counter
let fpsFrames = 0;
let fpsTimer = 0;

export function updateFPS(delta) {
    fpsFrames++;
    fpsTimer += delta;
    if (fpsTimer >= 0.5) {
        const fps = Math.round(fpsFrames / fpsTimer);
        fpsEl.textContent = `FPS: ${fps}`;
        fpsFrames = 0;
        fpsTimer = 0;
    }
}

// FIX: The function must be called to attach the listener. 
// We call setupUIToggle immediately to ensure the keyboard listener is active.
setupUIToggle();