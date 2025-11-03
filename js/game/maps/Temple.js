// Temple

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
  const group = new THREE.Group();

  // ===== GROUND WITH TEXTURE-LIKE PATTERN =====
  const groundGeo = new THREE.BoxGeometry(150, 1, 150);
  const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a4a4a,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  group.add(ground);

  // Grid lines on ground for detail
  for (let i = -75; i <= 75; i += 15) {
    const lineGeo = new THREE.BoxGeometry(150, 0.1, 0.5);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x1a3a3a });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 0.05, i);
    group.add(line);
    
    const line2 = new THREE.Mesh(lineGeo.clone(), lineMat);
    line2.rotation.y = Math.PI / 2;
    line2.position.set(i, 0.05, 0);
    group.add(line2);
  }

  // ===== SPAWN POINT =====
  const spawnPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 0.5, 16),
    new THREE.MeshStandardMaterial({ 
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
      roughness: 0.3
    })
  );
  spawnPlatform.position.set(0, 0.25, 0);
  spawnPlatform.receiveShadow = true;
  group.add(spawnPlatform);

  // Spawn marker pillars
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4, 0.3),
      new THREE.MeshStandardMaterial({ 
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3
      })
    );
    pillar.position.set(Math.cos(angle) * 4, 2, Math.sin(angle) * 4);
    pillar.castShadow = true;
    group.add(pillar);
  }

  // ===== HEALTH PACKS =====
  for (let i = 0; i < 3; i++) {
    const healthPack = new THREE.Group();
    
    // Main box
    const mainBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.4
      })
    );
    mainBox.castShadow = true;
    healthPack.add(mainBox);
    
    // Cross on top
    const cross1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    cross1.position.y = 0.5;
    healthPack.add(cross1);
    
    const cross2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.2, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    cross2.position.y = 0.5;
    healthPack.add(cross2);
    
    healthPack.position.set(
      (Math.random() - 0.5) * 60,
      1,
      (Math.random() - 0.5) * 60
    );
    group.add(healthPack);
  }

  // ===== JUMP PADS =====
  for (let i = 0; i < 4; i++) {
    const jumpPad = new THREE.Group();
    
    // Base platform
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 4, 0.5, 8),
      new THREE.MeshStandardMaterial({ 
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5,
        roughness: 0.3
      })
    );
    base.receiveShadow = true;
    jumpPad.add(base);
    
    // Arrow indicators
    for (let j = 0; j < 3; j++) {
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1, 4),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          emissive: 0xffaa00,
          emissiveIntensity: 0.3
        })
      );
      arrow.position.y = 1 + j * 0.5;
      arrow.rotation.y = Math.PI / 4;
      jumpPad.add(arrow);
    }
    
    jumpPad.position.set(
      (Math.random() - 0.5) * 70,
      0.25,
      (Math.random() - 0.5) * 70
    );
    group.add(jumpPad);
  }

  // ===== EXPLOSIVE BARRELS =====
  for (let i = 0; i < 5; i++) {
    const barrel = new THREE.Group();
    
    // Main barrel body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2, 12),
      new THREE.MeshStandardMaterial({ 
        color: 0xff4400,
        roughness: 0.6,
        metalness: 0.4
      })
    );
    body.castShadow = true;
    barrel.add(body);
    
    // Warning stripes
    for (let j = 0; j < 3; j++) {
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 0.85, 0.2, 12),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
      );
      stripe.position.y = -0.6 + j * 0.6;
      barrel.add(stripe);
    }
    
    // Hazard symbol on top
    const hazard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.1, 3),
      new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0xff4400,
        emissiveIntensity: 0.3
      })
    );
    hazard.position.y = 1.05;
    hazard.rotation.y = Math.PI;
    barrel.add(hazard);
    
    barrel.position.set(
      (Math.random() - 0.5) * 60,
      1,
      (Math.random() - 0.5) * 60
    );
    group.add(barrel);
  }

  // ===== COVER OBSTACLES (varied) =====
  // Tall walls
  for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 1),
      new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        roughness: 0.9
      })
    );
    wall.position.set(
      (Math.random() - 0.5) * 50,
      2,
      (Math.random() - 0.5) * 50
    );
    wall.rotation.y = Math.random() * Math.PI;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
  }

  // L-shaped cover
  for (let i = 0; i < 2; i++) {
    const lCover = new THREE.Group();
    const part1 = new THREE.Mesh(
      new THREE.BoxGeometry(6, 2.5, 1),
      new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    part1.castShadow = true;
    lCover.add(part1);
    
    const part2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    part2.position.set(2.5, 0, 2.5);
    part2.castShadow = true;
    lCover.add(part2);
    
    lCover.position.set(
      (Math.random() - 0.5) * 60,
      1.25,
      (Math.random() - 0.5) * 60
    );
    lCover.rotation.y = (Math.random() * 4) * (Math.PI / 2);
    group.add(lCover);
  }

  // Small crates
  for (let i = 0; i < 8; i++) {
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ 
        color: 0x8b6f47,
        roughness: 0.8
      })
    );
    crate.position.set(
      (Math.random() - 0.5) * 70,
      1,
      (Math.random() - 0.5) * 70
    );
    crate.rotation.y = Math.random() * Math.PI;
    crate.castShadow = true;
    crate.receiveShadow = true;
    group.add(crate);
  }

  // ===== LIGHT SOURCES =====
  // Central overhead light structure
  const lightTower = new THREE.Group();
  
  const towerPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 20, 8),
    new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2
    })
  );
  towerPole.position.y = 10;
  towerPole.castShadow = true;
  lightTower.add(towerPole);
  
  // Light fixture
  const lightFixture = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1, 4),
    new THREE.MeshStandardMaterial({ 
      color: 0xffff99,
      emissive: 0xffff99,
      emissiveIntensity: 1
    })
  );
  lightFixture.position.y = 20;
  lightTower.add(lightFixture);
  
  lightTower.position.set(0, 0, 0);
  group.add(lightTower);

  // Corner light posts
  const cornerPositions = [
    [40, 40], [40, -40], [-40, 40], [-40, -40]
  ];
  
  cornerPositions.forEach(([x, z]) => {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 12, 8),
      new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.6
      })
    );
    post.position.set(x, 6, z);
    post.castShadow = true;
    group.add(post);
    
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 8, 8),
      new THREE.MeshStandardMaterial({ 
        color: 0xffffaa,
        emissive: 0xffffaa,
        emissiveIntensity: 0.8
      })
    );
    light.position.set(x, 12, z);
    group.add(light);
  });

  return group;
}