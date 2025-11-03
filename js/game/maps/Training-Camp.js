// Training Camp

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
    const group = new THREE.Group();
  
    // Map dimensions: approximately 100x100 units
    const mapSize = 100;

    // ===== GROUND =====
    // Load gorund texture
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('assets/textures/wall4.jpg');

    // Configure texture repeating for better tiling
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(mapSize / 10, mapSize / 10);

    const groundGeo = new THREE.BoxGeometry(mapSize, 1, mapSize);
    const groundMat = new THREE.MeshStandardMaterial({ 
    map: groundTexture,  // Add the texture here
    roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    group.add(ground);

    // Load wall texture
    const wallTexture = textureLoader.load('assets/textures/wall2.jpg');

    // Configure texture repeating
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;

    // ===== OUTER WALLS (Black border) =====
    const wallHeight = 30;
    const wallThickness = 2;
    const wallMat = new THREE.MeshStandardMaterial({ 
        map: wallTexture,  // Add the texture here
        // color: 0x1a1a1a,
        roughness: 0.8
    });

    // Top wall
    const topWall = new THREE.Mesh(
        new THREE.BoxGeometry(mapSize, wallHeight, wallThickness),
        wallMat
    );
    topWall.position.set(0, wallHeight/2, -mapSize/2);
    topWall.castShadow = true;
    wallTexture.repeat.set(mapSize / 5, wallHeight / 5);
    group.add(topWall);

    // Bottom wall
    const bottomWall = topWall.clone();
    bottomWall.position.set(0, wallHeight/2, mapSize/2);
    group.add(bottomWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, mapSize),
        wallMat
    );
    leftWall.position.set(-mapSize/2, wallHeight/2, 0);
    leftWall.castShadow = true;
    wallTexture.repeat.set(mapSize / 5, wallHeight / 5);
    group.add(leftWall);

    // Right wall
    const rightWall = leftWall.clone();
    rightWall.position.set(mapSize/2, wallHeight/2, 0);
    group.add(rightWall);

    // ===== PURPLE BOT PATHS =====
    const purpleMat = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff,
        roughness: 0.7
    });

    // Bot platforms next to explosive canisters
    const floorTexture = textureLoader.load('assets/textures/floor7.jpg');

    // Configure texture settings
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1); // Adjust to control tiling

    // Create material with the texture
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: floorTexture,
        roughness: 0.8
    });

    // Bot platforms next to explosive canisters
    const topBotSpot = [
        [-42.5, -42.5], [-32.5, -42.5], [-22.5, -42.5], [-12.5, -42.5] //Left to right (when looking from center of map)
    ];
    topBotSpot.forEach(([x, z]) => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(5, 1, 5),
            floorMat
        );
        box.position.set(x, -0.4, z);
        box.castShadow = true;
        group.add(box);
    });

    // Bot platforms without canisters & with walking

    // X: negative = left, positive = right
    // Y: controls height (higher number = higher up)
    // Z: negative = toward top of map, positive = toward bottom

    // Long walking platform
    const topRightPurpleLeft = new THREE.Mesh(
        new THREE.BoxGeometry(15, 1, 5),  // width, height, depth
        floorMat
    );
    topRightPurpleLeft.position.set(17.5, -0.4, -42.5);  // (left/right, up/down, forward/back)
    topRightPurpleLeft.castShadow = true;
    group.add(topRightPurpleLeft);

    // 2 square standing platforms
    const topFarRightPositions = [[32.5, -42.5], [42.5, -42.5]];
    topFarRightPositions.forEach(([x, z]) => {
        const box = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 5), // width, height, depth
        floorMat
        );
        box.position.set(x, -0.4, z); // (left/right, up/down, forward/back)
        box.castShadow = true;
        group.add(box);
    });


    // 3 walking bot lanes
    const bottomLeftPositions = [[-42.5, 32.5], [-32.5, 32.5], [-22.5, 32.5]];
    bottomLeftPositions.forEach(([x, z]) => {
        const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 25),
        floorMat
        );
        pillar.position.set(x, -0.4, z);
        pillar.castShadow = true;
        group.add(pillar);
    });

    // 2 square standing bot spots
    const bottomRightPositions = [[22.5, 42.5], [32.5, 42.5], [42.5, 42.5]]; // Right to left from centre
    bottomRightPositions.forEach(([x, z]) => {
        const box = new THREE.Mesh(
        new THREE.BoxGeometry(5, 1, 5),
        floorMat
        );
        box.position.set(x, -0.4, z);
        box.castShadow = true;
        group.add(box);
    });

    // ===== RED EXPLOSIVE CANISTERS =====
    const redPositions = [[-37.5, -42.5], [-27.5, -42.5], [-17.5, -42.5]];
    redPositions.forEach(([x, z]) => {
        const canister = new THREE.Group();
        
        const body = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2.5, 12), // Radius top, radius bottom, height, smoothness
        new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        })
        );
        body.castShadow = true;
        canister.add(body);
        
        // Warning stripe
        const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 0.5, 12), // Radius top, radius bottom, height, smoothness
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        canister.add(stripe);
        
        canister.position.set(x, 1, z);
        group.add(canister);
    });

    // ===== ELEVATED PLATFORMS =====

    const platformTexture = textureLoader.load('assets/textures/floor4.jpg');

    // Configure texture settings
    platformTexture.wrapS = THREE.RepeatWrapping;
    platformTexture.wrapT = THREE.RepeatWrapping;
    platformTexture.repeat.set(1, 1); // Adjust to control tiling
    const platformMat = new THREE.MeshStandardMaterial({ 
        map: platformTexture,
        roughness: 0.8
    });

    // Platform with ramp
    const topBrownPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(10, 20, 10), // width, height, depth
        platformMat
    );
    topBrownPlatform.position.set(0, 0, -45); // (left/right, up/down, forward/back)
    topBrownPlatform.castShadow = true;
    topBrownPlatform.receiveShadow = true;
    group.add(topBrownPlatform);

    // Platform with jump pack
    const bottomBrownPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(10, 20, 20),
        platformMat
    );
    bottomBrownPlatform.position.set(0, 0, 40);
    bottomBrownPlatform.castShadow = true;
    bottomBrownPlatform.receiveShadow = true;
    group.add(bottomBrownPlatform);

    // Platform dividing spawn and health packs
    const bottomRightBrown = new THREE.Mesh(
        new THREE.BoxGeometry(35, 20, 5), // width, height, depth
        platformMat
    );
    bottomRightBrown.position.set(32.5, 0, 17.5); // (left/right, up/down, forward/back)
    bottomRightBrown.castShadow = true;
    bottomRightBrown.receiveShadow = true;
    group.add(bottomRightBrown);

    // ===== RAMP =====

    const rampTexture = textureLoader.load('assets/textures/floor4.jpg');

    // Configure texture settings
    rampTexture.wrapS = THREE.RepeatWrapping;
    rampTexture.wrapT = THREE.RepeatWrapping;
    rampTexture.repeat.set(1, 2); // Adjust to control tiling
    const rampMat = new THREE.MeshStandardMaterial({ 
        map: rampTexture,
        roughness: 0.8
    });

    // Create ramp using multiple flat platforms (stairs/steps)
    const rampSteps = 20; // Number of steps
    const rampWidth = 9.99;
    const rampTotalHeight = 9.99;
    const rampTotalDepth = 25;
    const stepHeight = rampTotalHeight / rampSteps;
    const stepDepth = rampTotalDepth / rampSteps;

    for (let i = 0; i < rampSteps; i++) {
        const step = new THREE.Mesh(
            new THREE.BoxGeometry(rampWidth, stepHeight, stepDepth),
            rampMat
        );
        
        // Position each step progressively higher and further back
        step.position.set(
            0, // centered horizontally
            (i * stepHeight) + (stepHeight / 2), // height increases
            -5 - (rampTotalDepth / 2) - (i * stepDepth) + (stepDepth / 2), // depth increases
        );
        
        step.castShadow = true;
        step.receiveShadow = true;
        group.add(step);
    }

    // ===== TOWER =====

    const towerTexture = textureLoader.load('assets/textures/floor9.jpg');

    // Configure texture settings
    towerTexture.wrapS = THREE.RepeatWrapping;
    towerTexture.wrapT = THREE.RepeatWrapping;
    towerTexture.repeat.set(1, 1); // Adjust to control tiling
    const towerMat = new THREE.MeshStandardMaterial({ 
        map: towerTexture,
        roughness: 0.8
    });

    // Centre tower
    const centerTower = new THREE.Mesh(
        new THREE.BoxGeometry(15, 30, 15), // width, height, depth
        towerMat
    );
    centerTower.position.set(0, 0, 0); // (left/right, up/down, forward/back)
    centerTower.castShadow = true;
    centerTower.receiveShadow = true;
    group.add(centerTower);

    // ===== GOLD SPAWN POINT =====

    const spawnPlatform = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 0.1, 16), // Radius top, radius bottom, height, smoothness
        new THREE.MeshStandardMaterial({ 
        color: 0xffdd00,
        emissive: 0xffdd00,
        emissiveIntensity: 0.5,
        metalness: 0.5
        })
    );
    spawnPlatform.position.set(40, 0, 0); // (left/right, up/down, forward/back)
    spawnPlatform.receiveShadow = true;
    group.add(spawnPlatform);

    // ===== GREEN JUMP PADS =====
    const jumpPadPositions = [
        [0, -12.5], // Top center (towards ramp)
        [-12.5, 0], // Left of center
        [12.5, 0],  // Right of center
        [0, 12.5], // Bottom of center
        [0, 25]  // Bottom near brown platform
    ];

    jumpPadPositions.forEach(([x, z]) => {
        const jumpPad = new THREE.Group();
        
        const base = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 3, 0.5, 8), // Radius top, radius bottom, height, smoothness
        new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.6
        })
        );
        base.receiveShadow = true;
        jumpPad.add(base);

        jumpPad.userData.isJumpPad = true;
        jumpPad.userData.launchForce = 30;
        
        jumpPad.position.set(x, 0, z); // (left/right, up/down, forward/back)
        group.add(jumpPad);
    });

    // ===== BLUE HEALTH PACKS =====
    const healthPositions = [[27.5, 22.5], [37.5, 22.5]];

    healthPositions.forEach(([x, z]) => {
        const healthPack = new THREE.Group();
        
        const mainBox = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 2, 16), // radiusTop, radiusBottom, height, segments
            new THREE.MeshStandardMaterial({ 
                color: 0x0000ff,
                emissive: 0x0000ff,
                emissiveIntensity: 0.4
            })
        );
        mainBox.castShadow = true;
        healthPack.add(mainBox);

        healthPack.position.set(x, 1, z); // (left/right, up/down, forward/back)
        group.add(healthPack);
    });

    // ===== TELEPORTERS =====
    // Teleporter A (left side of map) (Blue)
    const teleporterA = new THREE.Group();
    
    // Create portal frame
    const frameA = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.3, 16, 32), // radius, tube, radial segments, tubular segments
        new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.8,
            metalness: 0.8
        })
    );
    frameA.rotation.x = Math.PI / 2; // Make it vertical
    teleporterA.add(frameA);
    
    // Portal center (glowing disc)
    const portalA = new THREE.Mesh(
        new THREE.CircleGeometry(2, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    portalA.rotation.y = Math.PI / 2;
    teleporterA.add(portalA);
    
    // Tag as teleporter with destination
    teleporterA.userData.isTeleporter = true;
    teleporterA.userData.destination = { // To Teleporter B
        x: -42.5, 
        y: 2, 
        z: 10,
        yaw: Math.PI * 1.5
    };
    teleporterA.userData.teleporterId = 'A';
    
    teleporterA.position.set(-45.5, 2, -25); // (left/right, up/down, forward/back)
    group.add(teleporterA);
    
    // Teleporter B (right side of map) - mirror of A (Magenta)
    const teleporterB = new THREE.Group();
    
    const frameB = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.3, 16, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.8,
            metalness: 0.8
        })
    );
    frameB.rotation.x = Math.PI / 2;
    teleporterB.add(frameB);
    
    const portalB = new THREE.Mesh(
        new THREE.CircleGeometry(2, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })
    );
    portalB.rotation.y = Math.PI / 2;
    teleporterB.add(portalB);
    
    teleporterB.userData.isTeleporter = true;
    teleporterB.userData.destination = { // Teleport to A location
        x: -42.5, 
        y: 2, 
        z: -25,
        yaw: Math.PI * 1.5
    };
    teleporterB.userData.teleporterId = 'B';
    
    teleporterB.position.set(-45.5, 2, 10); // (left/right, up/down, forward/back)
    group.add(teleporterB);

    return group;
}

// Export spawn position and rotation for this map
// Position: { x, y, z } where y is height above ground
// Rotation: yaw in radians (0 = facing +Z, Math.PI/2 = facing -X, Math.PI = facing -Z, -Math.PI/2 = facing +X)
export const spawnPosition = {
    x: 40,   // On the gold spawn platform
    y: 2,    // 2 units above ground (eye height)
    z: 0
};

export const spawnRotation = {
    yaw: Math.PI / 2  // Face toward center of map (-Z direction)
};