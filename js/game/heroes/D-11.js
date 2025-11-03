// D-11

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export function createHero() {
    const hero = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0xFF9900,
        metalness: 0.3,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    hero.add(body);

    const headGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ 
        color: 0xFF9900,
        metalness: 0.3,
        roughness: 0.7
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.5;
    head.castShadow = true;
    hero.add(head);
 
    hero.position.set(0, 1, 0);

    // --- ADDED LOGGING FOR HERO'S TRANSFORMATIONS ---
    console.log('--- Hero Transform Info ---');
    console.log('Position (x, y, z):', hero.position);
    console.log('Rotation (x, y, z) in Radians:', hero.rotation);
    console.log('Scale (x, y, z):', hero.scale);
    console.log('---------------------------');
    // ------------------------------------------------

    return hero;
}

// Create Hero 1's unique weapon - Loads OBJ with fallback
export function createWeapon() {
    const weapon = new THREE.Group();
    const fallbackWeapon = new THREE.Group(); // New group for fallback geometry

    const gunMat = new THREE.MeshStandardMaterial({ 
        color: 0xFF9900, 
        metalness: 0.7, 
        roughness: 0.4 
    });

    // Create geometric fallback meshes
    const gunBodyGeo = new THREE.BoxGeometry(0.1, 0.1, 0.6);
    const gunBody = new THREE.Mesh(gunBodyGeo, gunMat);
    gunBody.position.set(0.2, -0.35, -0.6);
    fallbackWeapon.add(gunBody);

    const gunStockGeo = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const gunStock = new THREE.Mesh(gunStockGeo, gunMat);
    gunStock.position.set(0.2, -0.45, -0.25);
    fallbackWeapon.add(gunStock);

    const gunBarrelGeo = new THREE.BoxGeometry(0.05, 0.05, 0.3);
    const gunBarrel = new THREE.Mesh(gunBarrelGeo, gunMat);
    gunBarrel.position.set(0.2, -0.35, -0.95);
    fallbackWeapon.add(gunBarrel);

    // IMPORTANT: Set initial visibility to false!
    fallbackWeapon.visible = false;

    // Add the fallback group to the main weapon group
    weapon.add(fallbackWeapon);

    // Load OBJ model and replace fallback
    const loader = new OBJLoader();
    loader.load(
    'assets/models/weapons/d-11.obj',
    (object) => {
        // If successful, we DON'T need to remove the meshes, 
        // we just leave fallbackWeapon.visible = false.
        
        // Apply material and compute stats
        let meshCount = 0;
        object.traverse((child) => {
            if (child.isMesh) {
            meshCount++;
            child.material = gunMat;
            child.castShadow = true;
            child.receiveShadow = true;
        }
        });

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);

        console.log('--- OBJ Model Info ---');
        console.log(`Children/Mesh count: ${meshCount}`);
        console.log(`Dimensions (x, y, z):`, size);
        console.log('-----------------------');

        // Position and scale model (adjust later)
        // (Left/Right, Up-Down, Forward/Backward)
        object.position.set(0.2, -0.35, -0.1);
        // FIX: Rotation set to orient the gun correctly. 
        // X (Pitch), Y (Yaw), Z (Roll)
        // object.rotation.set(Math.PI / 0, Math.PI / 0, Math.PI / 0);
        object.rotation.set(0, -Math.PI / 2, 0);
        // object.rotation.set(0, 0, 0);

        const scaleFactor = 1.00; // Defined once for clarity
        object.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // --- ADDED LOGGING FOR WEAPON'S TRANSFORMATIONS AND SCALED SIZE ---
        const scaledSize = size.clone().multiplyScalar(scaleFactor); // Calculate scaled dimensions

        console.log('--- OBJ Model Transform Info (After Scaling) ---');
        console.log('Position (x, y, z):', object.position);
        console.log('Rotation (x, y, z) in Radians:', object.rotation);
        console.log('Scale (x, y, z):', object.scale);
        console.log(`Scaled Dimensions (x, y, z):`, scaledSize);
        console.log('------------------------------------------------');
        // -----------------------------------------------------------------

        weapon.add(object);
        console.log('Weapon OBJ loaded successfully');
    },
    (xhr) => {
        // Optional: you could show a percentage loading here, but we will leave it silent
    },
    (error) => {
        console.error('Error loading weapon OBJ:', error);
        console.log('Using geometric fallback');
        // If the OBJ fails to load, explicitly show the fallback
        fallbackWeapon.visible = true; 
    }
    );
    return weapon; // The weapon Group is returned immediately
}

// NEW: Export function that displays D-11's icon
export function showCharacterIcon() {
    console.log('=== showCharacterIcon called for D-11 ===');
    
    const playerName = localStorage.getItem("playerName") || "Player";
    console.log('Player name from localStorage:', playerName);
    
    console.log('Creating container element...');
    const container = document.createElement('div');
    container.id = 'character-display';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '10px';
    container.style.zIndex = '100';
    console.log('✓ Container created');
    
    console.log('Creating icon element...');
    const icon = document.createElement('img');
    icon.id = 'character-icon';
    icon.src = 'imgs/voidwalker-icons/d-11.png';
    icon.alt = 'Cane';
    icon.style.width = '80px';
    icon.style.height = '80px';
    icon.style.border = '3px solid #FF9900'; // D-11's color
    icon.style.borderRadius = '10px';
    icon.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    console.log('✓ Icon created with src:', icon.src);
    
    console.log('Creating name label...');
    const nameLabel = document.createElement('div');
    nameLabel.id = 'player-name';
    nameLabel.textContent = playerName;
    nameLabel.style.color = '#ffffff';
    nameLabel.style.fontSize = '18px';
    nameLabel.style.fontWeight = 'bold';
    nameLabel.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
    nameLabel.style.fontFamily = 'Arial, sans-serif';
    console.log('✓ Name label created');
    
    console.log('Appending elements...');
    container.appendChild(icon);
    container.appendChild(nameLabel);
    console.log('✓ Elements appended to container');
    
    console.log('Adding container to document.body...');
    console.log('document.body exists:', !!document.body);
    document.body.appendChild(container);
    console.log('✓ Container added to body');
    
    // Verify it's in the DOM
    const check = document.getElementById('character-display');
    console.log('Verification - element in DOM:', !!check);
    if (check) {
        console.log('Element computed style display:', window.getComputedStyle(check).display);
        console.log('Element computed style position:', window.getComputedStyle(check).position);
    }
    
    console.log('✓ D-11 character icon and name added to screen');
    console.log('=== showCharacterIcon complete ===');
}