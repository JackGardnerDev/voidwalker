// Player Controller - simplified collisions (floor + walls)
// Handles input, movement, jumping, gravity, and camera.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';

export class PlayerController {
    constructor(hero, camera, collidables, teleportSound = null) {
        this.hero = hero;
        this.camera = camera;
        this.collidables = collidables;
        this.teleportSound = teleportSound;

        console.log('PlayerController initialized with teleportSound:', this.teleportSound);

        // Physics
        this.velocity = new THREE.Vector3(); // y-axis for gravity
        this.keys = {};
        this.canJump = false;

        // Camera
        this.cameraOffset = new THREE.Vector3(0, 1.6, 0);
        this.pitch = 0;
        this.yaw = 0;
        this.smoothCameraY = 0;

        // Movement
        this.speed = 12.5;
        this.jumpForce = 12.5;
        this.gravity = 35;

        // Weapon sway
        this.swayTime = 0;
        this.weapon = null;

        // Jump pad cooldown to prevent multiple triggers
        this.jumpPadCooldown = 0;
        
        // Teleporter cooldown to prevent infinite loops
        this.teleporterCooldown = 0;

        this.setupControls();
        this.camera.position.copy(this.hero.position).add(this.cameraOffset);
    }

    // Mouse sense   
    setupControls() {
        document.addEventListener('keydown', e => this.keys[e.code] = true);
        document.addEventListener('keyup', e => this.keys[e.code] = false);

        document.body.addEventListener('click', () => document.body.requestPointerLock());
        document.addEventListener('mousemove', e => {
            if (document.pointerLockElement === document.body) {
                this.yaw -= e.movementX * 0.0005;
                this.pitch -= e.movementY * 0.0005;
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            }
        });
    }

    setWeapon(weapon) {
        this.weapon = weapon;
    }

    // Check if a point is colliding with any collidable
    // checkCollision(position, radius = 0.5) {
    //     for (const obj of this.collidables) {
    //         if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
    //         const box = obj.geometry.boundingBox.clone();
    //         box.applyMatrix4(obj.matrixWorld);

    //         box.min.x -= radius; box.min.z -= radius;
    //         box.max.x += radius; box.max.z += radius;

    //         if (
    //             position.x >= box.min.x && position.x <= box.max.x &&
    //             position.z >= box.min.z && position.z <= box.max.z &&
    //             position.y >= box.min.y && position.y <= box.max.y
    //         ) return true;
    //     }
    //     return false;
    // }
    // Check if a point is colliding with any collidable and return push-out vector
    checkCollision(position, radius = 0.5) {
        for (const obj of this.collidables) {
            if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
            const box = obj.geometry.boundingBox.clone();
            box.applyMatrix4(obj.matrixWorld);

            box.min.x -= radius; box.min.z -= radius;
            box.max.x += radius; box.max.z += radius;

            if (
                position.x >= box.min.x && position.x <= box.max.x &&
                position.z >= box.min.z && position.z <= box.max.z &&
                position.y >= box.min.y && position.y <= box.max.y
            ) {
                // Calculate push-out vector
                const pushOut = new THREE.Vector3();
                
                // Find shortest distance to each face
                const distLeft = position.x - box.min.x;
                const distRight = box.max.x - position.x;
                const distFront = position.z - box.min.z;
                const distBack = box.max.z - position.z;
                
                // Push out in the direction of least resistance (smallest distance)
                const minDist = Math.min(distLeft, distRight, distFront, distBack);
                
                if (minDist === distLeft) pushOut.x = -distLeft - 0.1;
                else if (minDist === distRight) pushOut.x = distRight + 0.1;
                else if (minDist === distFront) pushOut.z = -distFront - 0.1;
                else if (minDist === distBack) pushOut.z = distBack + 0.1;
                
                return pushOut;
            }
        }
        return null;
    }

    // Returns the floor height beneath the player
    getFloorHeight() {
        let floorY = 0; // default ground
        for (const obj of this.collidables) {
            if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
            const box = obj.geometry.boundingBox.clone();
            box.applyMatrix4(obj.matrixWorld);

            if (
                this.hero.position.x >= box.min.x && this.hero.position.x <= box.max.x &&
                this.hero.position.z >= box.min.z && this.hero.position.z <= box.max.z &&
                this.hero.position.y >= box.min.y
            ) {
                floorY = Math.max(floorY, box.max.y);
            }
        }
        return floorY;
    }

    // Check if player is standing on a jump pad
    checkJumpPad() {
        for (const obj of this.collidables) {
            // Check if this object or its parent is a jump pad
            let current = obj;
            while (current) {
                if (current.userData && current.userData.isJumpPad) {
                    // Get bounding box
                    if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
                    const box = obj.geometry.boundingBox.clone();
                    box.applyMatrix4(obj.matrixWorld);

                    // Expand horizontally for easier triggering
                    const radius = 0.5;
                    box.min.x -= radius;
                    box.min.z -= radius;
                    box.max.x += radius;
                    box.max.z += radius;

                    // Check if player is on top of jump pad
                    if (
                        this.hero.position.x >= box.min.x && 
                        this.hero.position.x <= box.max.x &&
                        this.hero.position.z >= box.min.z && 
                        this.hero.position.z <= box.max.z &&
                        this.hero.position.y >= box.min.y && 
                        this.hero.position.y <= box.max.y + 1.5 // Allow some height tolerance
                    ) {
                        return current.userData.launchForce || 20;
                    }
                }
                current = current.parent;
            }
        }
        return null;
    }

    // Check if player is touching a teleporter
    checkTeleporter() {
        for (const obj of this.collidables) {
            let current = obj;
            while (current) {
                if (current.userData && current.userData.isTeleporter) {
                    // Get bounding box
                    if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
                    const box = obj.geometry.boundingBox.clone();
                    box.applyMatrix4(obj.matrixWorld);

                    // Expand for easier triggering
                    const radius = 1.5;
                    box.min.x -= radius;
                    box.min.z -= radius;
                    box.max.x += radius;
                    box.max.z += radius;
                    box.min.y -= 1;
                    box.max.y += 1;

                    // Check if player is near teleporter
                    if (
                        this.hero.position.x >= box.min.x && 
                        this.hero.position.x <= box.max.x &&
                        this.hero.position.z >= box.min.z && 
                        this.hero.position.z <= box.max.z &&
                        this.hero.position.y >= box.min.y && 
                        this.hero.position.y <= box.max.y
                    ) {
                        return current.userData.destination;
                    }
                }
                current = current.parent;
            }
        }
        return null;
    }

    update(delta) {
        const direction = new THREE.Vector3();

        // Input
        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;
        if (direction.lengthSq() > 0) direction.normalize();

        // World space
        const moveX = Math.sin(this.yaw) * direction.z + Math.cos(this.yaw) * direction.x;
        const moveZ = Math.cos(this.yaw) * direction.z - Math.sin(this.yaw) * direction.x;

        // Horizontal collision: try moving and revert if colliding
        // const newPos = this.hero.position.clone();
        // newPos.x += moveX * this.speed * delta;
        // if (!this.checkCollision(newPos)) this.hero.position.x = newPos.x;

        // newPos.z += moveZ * this.speed * delta;
        // if (!this.checkCollision(newPos)) this.hero.position.z = newPos.z;
        // Horizontal collision: try moving and push out if stuck
        const newPos = this.hero.position.clone();
        newPos.x += moveX * this.speed * delta;
        const collisionX = this.checkCollision(newPos);
        if (!collisionX) {
            this.hero.position.x = newPos.x;
        } else {
            this.hero.position.add(collisionX); // Push out
        }

        newPos.copy(this.hero.position);
        newPos.z += moveZ * this.speed * delta;
        const collisionZ = this.checkCollision(newPos);
        if (!collisionZ) {
            this.hero.position.z = newPos.z;
        } else {
            this.hero.position.add(collisionZ); // Push out
        }

        // Also check if currently stuck and push out
        const stuckCheck = this.checkCollision(this.hero.position);
        if (stuckCheck) {
            this.hero.position.add(stuckCheck);
        }

        // Jumping
        if (this.keys['Space'] && this.canJump) {
            this.velocity.y = this.jumpForce;
            this.canJump = false;
        }

        // Gravity
        this.velocity.y -= this.gravity * delta;
        this.hero.position.y += this.velocity.y * delta;

        // Floor collision
        const floorY = this.getFloorHeight();
        if (this.hero.position.y <= floorY + 1) {
            this.hero.position.y = floorY + 1;
            this.velocity.y = 0;
            this.canJump = true;
        }

        // Jump pad detection - only trigger when on ground and cooldown expired
        if (this.jumpPadCooldown > 0) {
            this.jumpPadCooldown -= delta;
        } else if (this.canJump) {
            const launchForce = this.checkJumpPad();
            if (launchForce) {
                this.velocity.y = launchForce;
                this.canJump = false;
                this.jumpPadCooldown = 0.5; // Half second cooldown
                console.log('Jump pad activated! Launch force:', launchForce);
            }
        }

        // Teleporter detection
        if (this.teleporterCooldown > 0) {
            this.teleporterCooldown -= delta;
        } else {
            const destination = this.checkTeleporter();
            if (destination) {
                this.hero.position.set(destination.x, destination.y - 1, destination.z);
                
                // Apply rotation if specified
                if (destination.yaw !== undefined) {
                    this.yaw = destination.yaw;
                }

                // Play teleport sound
                console.log('Teleporter activated!');
                console.log('teleportSound exists:', !!this.teleportSound);
                console.log('teleportSound buffer:', !!this.teleportSound?.buffer);
                console.log('teleportSound isPlaying:', this.teleportSound?.isPlaying);
                
                if (this.teleportSound && this.teleportSound.buffer) {
                    if (this.teleportSound.isPlaying) {
                        console.log('Stopping previous sound...');
                        this.teleportSound.stop();
                    }
                    console.log('Playing teleport sound!');
                    this.teleportSound.play();
                } else {
                    console.warn('Cannot play sound - teleportSound or buffer not ready');
                }
                
                this.teleporterCooldown = 1.0;
                console.log('Teleported to:', destination);
            }
        }

        // Camera (with smoothing)
        const targetCameraY = this.hero.position.y + this.cameraOffset.y;
        const lerpSpeed = 10; // Higher = faster smoothing, lower = smoother but slower
        this.smoothCameraY += (targetCameraY - this.smoothCameraY) * lerpSpeed * delta;

        this.camera.position.x = this.hero.position.x + this.cameraOffset.x;
        this.camera.position.y = this.smoothCameraY;
        this.camera.position.z = this.hero.position.z + this.cameraOffset.z;

        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;

        // Weapon sway
        if (this.weapon && direction.lengthSq() > 0) {
            this.swayTime += delta * 10;
            this.weapon.position.y = Math.sin(this.swayTime) * 0.004;
            this.weapon.rotation.z = Math.sin(this.swayTime) * 0.002;
        } else if (this.weapon) {
            this.swayTime = 0;
            this.weapon.position.y = 0;
            this.weapon.rotation.z = 0;
        }
    }
}