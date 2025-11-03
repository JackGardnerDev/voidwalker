// Outpost

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
    const group = new THREE.Group();

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('assets/textures/wall4.jpg');
    
    // Optional: Configure texture repeat/wrapping for tiling
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10); // Adjust numbers to tile the texture

    // Ground with texture
    const groundGeo = new THREE.BoxGeometry(150, 1, 150);
    const groundMat = new THREE.MeshStandardMaterial({ 
        map: groundTexture // Use 'map' property for the texture
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    group.add(ground);

    return group;
}