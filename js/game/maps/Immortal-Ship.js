import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
  const group = new THREE.Group();

  // Ground
  const groundGeo = new THREE.BoxGeometry(500, 1, 500);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x144444 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  group.add(ground);

  // Create a large sphere for the skybox with stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 5000;
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // Random position in a sphere around the map
    const radius = 400 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i + 2] = radius * Math.cos(phi);
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  group.add(stars);
  
  // Optional: Add some colored nebula-like stars
  const coloredStarGeo = new THREE.BufferGeometry();
  const coloredStarPositions = new Float32Array(1000 * 3);
  const coloredStarColors = new Float32Array(1000 * 3);
  
  for (let i = 0; i < 1000 * 3; i += 3) {
    const radius = 350 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    coloredStarPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    coloredStarPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    coloredStarPositions[i + 2] = radius * Math.cos(phi);
    
    // Random colors (blues, purples, pinks)
    coloredStarColors[i] = 0.5 + Math.random() * 0.5;
    coloredStarColors[i + 1] = 0.3 + Math.random() * 0.4;
    coloredStarColors[i + 2] = 0.8 + Math.random() * 0.2;
  }
  
  coloredStarGeo.setAttribute('position', new THREE.BufferAttribute(coloredStarPositions, 3));
  coloredStarGeo.setAttribute('color', new THREE.BufferAttribute(coloredStarColors, 3));
  
  const coloredStarMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  
  const coloredStars = new THREE.Points(coloredStarGeo, coloredStarMaterial);
  group.add(coloredStars);

  // ============ BARRIERS / WALLS ============
  
  const barrierMat = new THREE.MeshStandardMaterial({ 
    color: 0x666666,
    roughness: 0.8,
    metalness: 0.3
  });
  
  const wallHeight = 5;
  const mapSize = 250; // Half of ground size
  const wallThickness = 2;
  
  // North wall
  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(500, wallHeight, wallThickness),
    barrierMat
  );
  northWall.position.set(0, wallHeight / 2, -mapSize);
  group.add(northWall);
  
  // South wall
  const southWall = new THREE.Mesh(
    new THREE.BoxGeometry(500, wallHeight, wallThickness),
    barrierMat
  );
  southWall.position.set(0, wallHeight / 2, mapSize);
  group.add(southWall);
  
  // East wall
  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, 500),
    barrierMat
  );
  eastWall.position.set(mapSize, wallHeight / 2, 0);
  group.add(eastWall);
  
  // West wall
  const westWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, 500),
    barrierMat
  );
  westWall.position.set(-mapSize, wallHeight / 2, 0);
  group.add(westWall);
  
  // ============ INTERIOR OBSTACLES ============
  
  // Add some interior walls/structures
  const interiorWallMat = new THREE.MeshStandardMaterial({ 
    color: 0x555555,
    roughness: 0.9
  });
  
  // Example: Create a cross pattern in the center
//   const centerWall1 = new THREE.Mesh(
//     new THREE.BoxGeometry(100, 4, 4),
//     interiorWallMat
//   );
//   centerWall1.position.set(0, 2, 0);
//   group.add(centerWall1);
  
//   const centerWall2 = new THREE.Mesh(
//     new THREE.BoxGeometry(4, 4, 100),
//     interiorWallMat
//   );
//   centerWall2.position.set(0, 2, 0);
//   group.add(centerWall2);
  
  // Add some pillars around the map
  const pillarGeo = new THREE.CylinderGeometry(3, 3, 8, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ 
    color: 0x777777,
    metalness: 0.4,
    roughness: 0.6
  });
  
  const pillarPositions = [
    [80, 4, 80],
    [-80, 4, 80],
    [80, 4, -80],
    [-80, 4, -80],
    [120, 4, 0],
    [-120, 4, 0],
    [0, 4, 120],
    [0, 4, -120]
  ];
  
  for (const pos of pillarPositions) {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(pos[0], pos[1], pos[2]);
    group.add(pillar);
  }
  
  // Add some cover boxes scattered around
  for (let i = 0; i < 20; i++) {
    const boxSize = 2 + Math.random() * 2;
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize, boxSize, boxSize),
      new THREE.MeshStandardMaterial({ color: 0x888888 })
    );
    box.position.set(
      (Math.random() - 0.5) * 400,
      boxSize / 2,
      (Math.random() - 0.5) * 400
    );
    box.rotation.y = Math.random() * Math.PI;
    group.add(box);
  }

  return group;
}