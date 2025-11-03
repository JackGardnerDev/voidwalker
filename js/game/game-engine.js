// Game Engine - Main game loop and scene setup

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';
import { PlayerController } from './player-controller.js';
import { updateFPS } from './ui-manager.js';

// Add audio listener and loader
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

export function startGame(hero, map, weapon, spawnPosition = { x: 0, y: 2, z: 5 }, spawnRotation = { yaw: 0 }) {

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e15); // Deep bluish-black background for atmosphere

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    // Add audio listener to camera
    camera.add(listener);

    // Load teleporter sound
    const teleportSound = new THREE.Audio(listener);
    console.log('Loading teleport sound...');
    audioLoader.load('assets/sounds/teleport.mp3', 
        function(buffer) {
            teleportSound.setBuffer(buffer);
            teleportSound.setVolume(0.5);
            console.log('✓ Teleport sound loaded successfully!');
        },
        function(progress) {
            console.log('Loading audio:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
        },
        function(error) {
            console.error('✗ Error loading teleport sound:', error);
        }
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: false,                   // Disable antialiasing for performance
        powerPreference: "high-performance" // Prioritize GPU efficiency
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);            // Fixed pixel ratio to prevent scaling issues
    // Below may affect performance
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.enabled = false;   // Disable shadows for performance
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // General ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // Directional light for realism
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ADD THIS HERE - Point light for the central tower
    const pointLight = new THREE.PointLight(0xffffaa, 1, 100);
    pointLight.position.set(0, 20, 0);
    // Below may affect performance
    pointLight.castShadow = true;
    scene.add(pointLight);

    // You can also add corner lights for the light posts
    const cornerPositions = [
        [40, 0, 40], [40, 0, -40], [-40, 0, 40], [-40, 0, -40]
    ];

    cornerPositions.forEach(([x, y, z]) => {
        const cornerLight = new THREE.PointLight(0xffffaa, 0.5, 50);
        cornerLight.position.set(x, 12, z);
        scene.add(cornerLight);
    });

    // Add map and hero to the scene
    scene.add(map);
    scene.add(hero);

    // Hide the hero's full model in first-person view
    hero.visible = false;

    // Attach weapon to camera so it moves with the player's view
    camera.add(weapon);
    scene.add(camera);

    // Gather collidable objects from the map
    const collidables = [];
    map.traverse((child) => {
        if (child.isMesh && child.geometry) {
            collidables.push(child);
        }
    });

    console.log(`Found ${collidables.length} collidable objects`);

    // Initialize the player controller
    const player = new PlayerController(hero, camera, collidables, teleportSound);
    player.setWeapon(weapon); // Pass weapon reference for syncing movement
    
    // Set initial spawn rotation
    player.yaw = spawnRotation.yaw;
    
    // Apply rotation to camera immediately
    camera.rotation.order = 'YXZ';
    camera.rotation.y = spawnRotation.yaw;
    camera.rotation.x = 0; // No pitch at spawn

    // Game loop setup
    let lastTime = performance.now();

    function animate() {
        requestAnimationFrame(animate);

        // Calculate time delta for smooth, frame-independent updates
        const now = performance.now();
        const delta = (now - lastTime) / 1000; // Convert ms to seconds
        lastTime = now;

        // Update player and render scene
        player.update(delta);
        renderer.render(scene, camera);

        // Update FPS counter on screen
        updateFPS(delta);
    }

    // Start the loop
    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Add starry sky to the scene
    const textureLoader = new THREE.TextureLoader();
    
    // Array of star texture paths
    const starTextures = [
        'assets/textures/stars1.jpg',
        'assets/textures/stars2.jpg',
        'assets/textures/stars3.jpg'
        // 'assets/textures/stars4.jpg'
    ];
    
    // Randomly select one
    const randomIndex = Math.floor(Math.random() * starTextures.length);
    const starTexture = textureLoader.load(starTextures[randomIndex]);

    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Set initial camera/player position (spawn point)
    camera.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
    hero.position.set(spawnPosition.x, spawnPosition.y - 1, spawnPosition.z); // Hero 1 unit below camera

}