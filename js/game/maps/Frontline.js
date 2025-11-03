import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
  const group = new THREE.Group();

  // Ground - larger arena
  const groundGeo = new THREE.BoxGeometry(80, 1, 80);
  const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a,
    roughness: 0.9,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  group.add(ground);

  // Wall material
  const wallMat = new THREE.MeshStandardMaterial({ 
    color: 0x4a4a4a,
    roughness: 0.8
  });

  // Center circle
  const centerGeo = new THREE.CylinderGeometry(5, 5, 3, 16);
  const center = new THREE.Mesh(centerGeo, wallMat);
  center.position.set(0, 1.5, 0);
  group.add(center);

  // Cardinal direction walls (4 rounded rectangles - North, South, East, West)
  const cardinalWallGeo = new THREE.BoxGeometry(8, 4, 12);
  
  // North wall
  const northWall = new THREE.Mesh(cardinalWallGeo, wallMat);
  northWall.position.set(0, 2, -20);
  group.add(northWall);
  
  // South wall
  const southWall = new THREE.Mesh(cardinalWallGeo, wallMat);
  southWall.position.set(0, 2, 20);
  group.add(southWall);
  
  // East wall (rotated)
  const eastWall = new THREE.Mesh(cardinalWallGeo, wallMat);
  eastWall.position.set(20, 2, 0);
  eastWall.rotation.y = Math.PI / 2;
  group.add(eastWall);
  
  // West wall (rotated)
  const westWall = new THREE.Mesh(cardinalWallGeo, wallMat);
  westWall.position.set(-20, 2, 0);
  westWall.rotation.y = Math.PI / 2;
  group.add(westWall);

  // Diagonal corner walls (4 diamonds - NE, NW, SE, SW)
  const diagonalWallGeo = new THREE.BoxGeometry(6, 4, 6);
  
  // Northeast diamond
  const neDiamond = new THREE.Mesh(diagonalWallGeo, wallMat);
  neDiamond.position.set(14, 2, -14);
  neDiamond.rotation.y = Math.PI / 4;
  group.add(neDiamond);
  
  // Northwest diamond
  const nwDiamond = new THREE.Mesh(diagonalWallGeo, wallMat);
  nwDiamond.position.set(-14, 2, -14);
  nwDiamond.rotation.y = Math.PI / 4;
  group.add(nwDiamond);
  
  // Southeast diamond
  const seDiamond = new THREE.Mesh(diagonalWallGeo, wallMat);
  seDiamond.position.set(14, 2, 14);
  seDiamond.rotation.y = Math.PI / 4;
  group.add(seDiamond);
  
  // Southwest diamond
  const swDiamond = new THREE.Mesh(diagonalWallGeo, wallMat);
  swDiamond.position.set(-14, 2, 14);
  swDiamond.rotation.y = Math.PI / 4;
  group.add(swDiamond);

  // Add some ambient battlefield details (optional debris/cover)
  const debrisMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a });
  
  // Small cover pieces scattered around
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 10;
    const debrisGeo = new THREE.BoxGeometry(
      1 + Math.random(), 
      0.5 + Math.random() * 0.5, 
      1 + Math.random()
    );
    const debris = new THREE.Mesh(debrisGeo, debrisMat);
    debris.position.set(
      Math.cos(angle) * radius,
      0.3,
      Math.sin(angle) * radius
    );
    debris.rotation.y = Math.random() * Math.PI;
    group.add(debris);
  }

  return group;
}