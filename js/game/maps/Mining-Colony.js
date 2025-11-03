// Mining Colony

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export function createMap() {
  const group = new THREE.Group();

  // Ground
  const groundGeo = new THREE.BoxGeometry(150, 1, 150);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x144444 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  group.add(ground);

  // A few boxes for obstacles
//   for (let i = 0; i < 5; i++) {
//     const boxGeo = new THREE.BoxGeometry(2, 2, 2);
//     const boxMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
//     const box = new THREE.Mesh(boxGeo, boxMat);
//     box.position.set((Math.random() - 0.5) * 40, 1, (Math.random() - 0.5) * 40);
//     group.add(box);
//   }

  return group;
}