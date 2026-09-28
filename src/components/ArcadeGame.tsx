import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { GAME_ASSETS } from '../assets/gameAssets';
import { WeaponType, WEAPONS, Question, SubjectId } from '../types/game';
import { soundManager } from '../utils/audio';

export interface ArcadeGameHandle {
  setDirection: (dir: 'up' | 'down' | 'left' | 'right', isPressed: boolean) => void;
  triggerJump: () => void;
  setShooting: (isShooting: boolean) => void;
  switchWeapon: () => void;
}

interface ArcadeGameProps {
  onTriggerQuiz: (bonusWeapon: WeaponType, isBoss: boolean) => void;
  onGameOver: (finalScore: number, stage: number) => void;
  onStageClear: (score: number) => void;
  activeWeapon: WeaponType;
  onChangeWeapon: (weapon: WeaponType) => void;
  lives: number;
  onUpdateLives: (newLives: number) => void;
  score: number;
  onUpdateScore: (newScore: number) => void;
  isPaused: boolean;
  scanlinesEnabled: boolean;
  selectedSubject?: SubjectId;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'ground' | 'steel' | 'bridge';
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  damage: number;
  isPlayer: boolean;
  type: WeaponType;
  life: number;
}

interface Enemy {
  id: number;
  type: 'soldier' | 'turret' | 'drone' | 'capsule' | 'boss';
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  fireCooldown: number;
  direction: -1 | 1;
  stateTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
}

interface FloatingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'S' | 'L' | 'F' | 'SHIELD' | 'KNOWLEDGE';
  letter: string;
  life: number;
}

export const ArcadeGame = forwardRef<ArcadeGameHandle, ArcadeGameProps>(({
  onTriggerQuiz,
  onGameOver,
  onStageClear,
  activeWeapon,
  onChangeWeapon,
  lives,
  onUpdateLives,
  score,
  onUpdateScore,
  isPaused,
  scanlinesEnabled,
  selectedSubject
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background and sprite images
  const bgJungleImg = useRef<HTMLImageElement | null>(null);
  const bossImg = useRef<HTMLImageElement | null>(null);

  // Game internal state ref
  const gameState = useRef({
    cameraX: 0,
    stageDistance: 0,
    maxStageDistance: 3200,
    bossSpawned: false,
    bossDefeated: false,
    nextEnemyId: 1,
    lastShootTime: 0,
    invulnerableTimer: 0,
    playerHp: 100,
    maxPlayerHp: 100,
    hasShield: false,
    shieldTimer: 0,
    muzzleFlashTimer: 0,
    screenShake: 0,
    barrelRecoil: 0,
    // Jump mechanics
    jumpCount: 0,
    coyoteTimer: 0,
    // Player coordinates & animation
    player: {
      x: 120,
      y: 418,
      vx: 0,
      vy: 0,
      w: 32,
      h: 52,
      facing: 1 as 1 | -1,
      aimY: 0 as -1 | 0 | 1, // -1 up, 1 down
      isGrounded: true,
      isCrouching: false,
      somersault: false,
      somersaultAngle: 0
    },
    // Input keys
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false,
      shoot: false
    },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    items: [] as FloatingItem[],
    platforms: [
      { x: 0, y: 470, w: 3600, h: 70, type: 'ground' },
      { x: 220, y: 390, w: 160, h: 16, type: 'steel' },
      { x: 440, y: 310, w: 180, h: 16, type: 'steel' },
      { x: 680, y: 380, w: 200, h: 16, type: 'steel' },
      { x: 960, y: 300, w: 170, h: 16, type: 'steel' },
      { x: 1200, y: 240, w: 220, h: 16, type: 'steel' },
      { x: 1500, y: 360, w: 240, h: 16, type: 'steel' },
      { x: 1820, y: 280, w: 190, h: 16, type: 'steel' },
      { x: 2120, y: 380, w: 200, h: 16, type: 'steel' },
      { x: 2420, y: 300, w: 260, h: 16, type: 'steel' },
      { x: 2750, y: 380, w: 350, h: 16, type: 'steel' }
    ] as Platform[]
  });

  // Expose direct controller handle for 0-latency touch controls
  useImperativeHandle(ref, () => ({
    setDirection: (dir, isPressed) => {
      const k = gameState.current.keys;
      if (dir === 'up') k.up = isPressed;
      if (dir === 'down') k.down = isPressed;
      if (dir === 'left') k.left = isPressed;
      if (dir === 'right') k.right = isPressed;
    },
    triggerJump: () => {
      const state = gameState.current;
      const p = state.player;
      // Perform Ground Jump or Mid-air Double Jump!
      if (p.isGrounded || state.jumpCount < 2) {
        p.vy = state.jumpCount === 0 ? -14.2 : -12.8;
        p.isGrounded = false;
        p.somersault = true;
        state.jumpCount++;
        soundManager.playJump();

        // Air blast particle for double jump
        if (state.jumpCount === 2) {
          for (let i = 0; i < 8; i++) {
            const angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4;
            state.particles.push({
              x: p.x + p.w / 2,
              y: p.y + p.h,
              vx: Math.cos(angle) * (2 + Math.random() * 3),
              vy: Math.sin(angle) * 3,
              color: '#38bdf8',
              radius: 2.5,
              life: 0,
              maxLife: 15
            });
          }
        }
      }
    },
    setShooting: (isShooting) => {
      gameState.current.keys.shoot = isShooting;
    },
    switchWeapon: () => {
      const list: WeaponType[] = ['NORMAL', 'SPREAD', 'LASER', 'FIRE'];
      const next = list[(list.indexOf(activeWeapon) + 1) % list.length];
      onChangeWeapon(next);
      soundManager.playPowerUp();
    }
  }));

  // Preload graphics
  useEffect(() => {
    const jImg = new Image();
    jImg.src = GAME_ASSETS.stageJungle;
    bgJungleImg.current = jImg;

    const bImg = new Image();
    bImg.src = GAME_ASSETS.bossAlienCore;
    bossImg.current = bImg;
  }, []);

  // Keyboard controls listener (Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = gameState.current.keys;
      const key = e.key.toLowerCase();

      if (['arrowleft', 'a'].includes(key)) { k.left = true; }
      if (['arrowright', 'd'].includes(key)) { k.right = true; }
      if (['arrowdown', 's'].includes(key)) { k.down = true; }
      if (['arrowup', 'w'].includes(key)) { k.up = true; }

      // Jump keys: Space, K, W, Up Arrow
      if (['k', ' '].includes(key)) {
        e.preventDefault();
        const state = gameState.current;
        const p = state.player;
        if (p.isGrounded || state.jumpCount < 2) {
          p.vy = state.jumpCount === 0 ? -14.2 : -12.8;
          p.isGrounded = false;
          p.somersault = true;
          state.jumpCount++;
          soundManager.playJump();
        }
      }

      // Shoot keys: J, F, Enter
      if (['j', 'f', 'enter'].includes(key)) {
        k.shoot = true;
        e.preventDefault();
      }

      // Switch Weapon: L or Q
      if (key === 'l' || key === 'q') {
        const list: WeaponType[] = ['NORMAL', 'SPREAD', 'LASER', 'FIRE'];
        const next = list[(list.indexOf(activeWeapon) + 1) % list.length];
        onChangeWeapon(next);
        soundManager.playPowerUp();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = gameState.current.keys;
      const key = e.key.toLowerCase();

      if (['arrowleft', 'a'].includes(key)) k.left = false;
      if (['arrowright', 'd'].includes(key)) k.right = false;
      if (['arrowdown', 's'].includes(key)) k.down = false;
      if (['arrowup', 'w'].includes(key)) k.up = false;
      if (['j', 'f', 'enter'].includes(key)) k.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeWeapon, onChangeWeapon]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let spawnTimer = 0;
    let capsuleTimer = 0;

    const createExplosion = (x: number, y: number, count = 20, color = '#f97316') => {
      soundManager.playExplosion();
      gameState.current.screenShake = 6;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        gameState.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.4 ? color : '#facc15',
          radius: 3 + Math.random() * 4,
          life: 0,
          maxLife: 22 + Math.random() * 20
        });
      }
    };

    // Shoot weapon with heavy gun barrel recoil and muzzle flash
    const shootWeapon = () => {
      const state = gameState.current;
      const p = state.player;
      const wep = WEAPONS[activeWeapon];
      const now = Date.now();

      if (now - state.lastShootTime < wep.fireRateMs) return;
      state.lastShootTime = now;

      soundManager.playShoot(activeWeapon);
      state.muzzleFlashTimer = 6;
      state.barrelRecoil = 6;
      state.screenShake = 3;

      // Calculate gun muzzle tip based on facing and aim angle
      let muzzleX = p.x + (p.facing === 1 ? p.w + 22 : -22);
      let muzzleY = p.isCrouching ? p.y + 36 : p.y + 22;

      let baseVx = p.facing * wep.bulletSpeed;
      let baseVy = 0;

      if (p.aimY === -1) {
        if (p.vx !== 0) {
          // 45 degrees diagonal up
          muzzleX = p.x + (p.facing === 1 ? p.w + 14 : -14);
          muzzleY = p.y + 4;
          baseVx = p.facing * wep.bulletSpeed * 0.707;
          baseVy = -wep.bulletSpeed * 0.707;
        } else {
          // Straight Up 90 degrees
          muzzleX = p.x + p.w / 2 + (p.facing === 1 ? 4 : -4);
          muzzleY = p.y - 12;
          baseVx = 0;
          baseVy = -wep.bulletSpeed;
        }
      } else if (p.aimY === 1 && !p.isGrounded) {
        // Diagonal Down in air
        muzzleX = p.x + (p.facing === 1 ? p.w + 14 : -14);
        muzzleY = p.y + p.h - 4;
        baseVx = p.facing * wep.bulletSpeed * 0.707;
        baseVy = wep.bulletSpeed * 0.707;
      }

      // Muzzle spark particles
      for (let s = 0; s < 4; s++) {
        state.particles.push({
          x: muzzleX,
          y: muzzleY,
          vx: baseVx * 0.2 + (Math.random() - 0.5) * 4,
          vy: baseVy * 0.2 + (Math.random() - 0.5) * 4,
          color: wep.color,
          radius: 2,
          life: 0,
          maxLife: 8
        });
      }

      if (activeWeapon === 'SPREAD') {
        // 5 Heavy Spread Gun Blasts
        const angles = [-0.38, -0.19, 0, 0.19, 0.38];
        const baseAngle = Math.atan2(baseVy, baseVx);
        angles.forEach(offset => {
          const finalAngle = baseAngle + offset;
          const spd = wep.bulletSpeed;
          state.bullets.push({
            x: muzzleX,
            y: muzzleY,
            vx: Math.cos(finalAngle) * spd,
            vy: Math.sin(finalAngle) * spd,
            radius: 6,
            color: '#f43f5e',
            damage: wep.damage,
            isPlayer: true,
            type: 'SPREAD',
            life: 80
          });
        });
      } else if (activeWeapon === 'LASER') {
        state.bullets.push({
          x: muzzleX,
          y: muzzleY,
          vx: baseVx * 1.35,
          vy: baseVy * 1.35,
          radius: 7,
          color: '#06b6d4',
          damage: wep.damage,
          isPlayer: true,
          type: 'LASER',
          life: 75
        });
      } else if (activeWeapon === 'FIRE') {
        state.bullets.push({
          x: muzzleX,
          y: muzzleY,
          vx: baseVx * 0.95,
          vy: baseVy * 0.95,
          radius: 10,
          color: '#fb923c',
          damage: wep.damage,
          isPlayer: true,
          type: 'FIRE',
          life: 90
        });
      } else {
        // NORMAL Heavy Blaster
        state.bullets.push({
          x: muzzleX,
          y: muzzleY,
          vx: baseVx,
          vy: baseVy,
          radius: 5,
          color: '#38bdf8',
          damage: wep.damage,
          isPlayer: true,
          type: 'NORMAL',
          life: 75
        });
      }
    };

    const spawnCapsule = () => {
      const cam = gameState.current.cameraX;
      gameState.current.enemies.push({
        id: gameState.current.nextEnemyId++,
        type: 'capsule',
        x: cam + 980,
        y: 120 + Math.random() * 80,
        vx: -2.8,
        vy: 0,
        w: 36,
        h: 24,
        hp: 1,
        maxHp: 1,
        fireCooldown: 0,
        direction: -1,
        stateTimer: 0
      });
    };

    const spawnEnemy = () => {
      const cam = gameState.current.cameraX;
      const typeRand = Math.random();
      let enemyType: 'soldier' | 'turret' | 'drone' = 'soldier';

      if (typeRand < 0.55) {
        enemyType = 'soldier';
      } else if (typeRand < 0.8) {
        enemyType = 'drone';
      } else {
        enemyType = 'turret';
      }

      if (enemyType === 'soldier') {
        gameState.current.enemies.push({
          id: gameState.current.nextEnemyId++,
          type: 'soldier',
          x: cam + 960,
          y: 418,
          vx: -2.4 - Math.random() * 1.0,
          vy: 0,
          w: 28,
          h: 48,
          hp: 35,
          maxHp: 35,
          fireCooldown: 70 + Math.random() * 80,
          direction: -1,
          stateTimer: 0
        });
      } else if (enemyType === 'drone') {
        gameState.current.enemies.push({
          id: gameState.current.nextEnemyId++,
          type: 'drone',
          x: cam + 980,
          y: 160 + Math.random() * 140,
          vx: -3.4,
          vy: 0,
          w: 32,
          h: 28,
          hp: 25,
          maxHp: 25,
          fireCooldown: 85,
          direction: -1,
          stateTimer: 0
        });
      } else {
        // Turret on platform
        const plat = gameState.current.platforms.find(p => p.x > cam + 500 && p.x < cam + 1200 && p.type === 'steel');
        const tx = plat ? plat.x + plat.w / 2 : cam + 900;
        const ty = plat ? plat.y - 32 : 438;
        gameState.current.enemies.push({
          id: gameState.current.nextEnemyId++,
          type: 'turret',
          x: tx,
          y: ty,
          vx: 0,
          vy: 0,
          w: 34,
          h: 34,
          hp: 55,
          maxHp: 55,
          fireCooldown: 80 + Math.random() * 60,
          direction: -1,
          stateTimer: 0
        });
      }
    };

    const spawnBoss = () => {
      gameState.current.bossSpawned = true;
      const cam = gameState.current.cameraX;
      gameState.current.enemies.push({
        id: 9999,
        type: 'boss',
        x: cam + 700,
        y: 180,
        vx: 0,
        vy: 1,
        w: 150,
        h: 190,
        hp: 400,
        maxHp: 400,
        fireCooldown: 60,
        direction: -1,
        stateTimer: 0
      });
    };

    // Game loop tick
    const loop = () => {
      if (!isPaused) {
        const state = gameState.current;
        const p = state.player;
        const k = state.keys;

        // Aiming & crouch states
        p.aimY = k.up ? -1 : (k.down ? 1 : 0);
        p.isCrouching = k.down && p.isGrounded && p.vx === 0;

        // Horizontal movement
        if (k.left) {
          p.vx = -4.5;
          p.facing = -1;
        } else if (k.right) {
          p.vx = 4.5;
          p.facing = 1;
        } else {
          p.vx = 0;
        }

        // Apply Gravity
        p.vy += 0.52;
        if (p.vy > 14) p.vy = 14;

        // Apply Somersault Rotation in air
        if (!p.isGrounded && p.somersault) {
          p.somersaultAngle += 0.28 * p.facing;
        } else {
          p.somersaultAngle = 0;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Platform & Ground Collision Checking
        const prevBottom = (p.y - p.vy) + p.h;
        const currBottom = p.y + p.h;
        p.isGrounded = false;

        for (const plat of state.platforms) {
          // Landing on top surface of platform
          if (
            p.x + p.w > plat.x + 4 &&
            p.x < plat.x + plat.w - 4 &&
            p.vy >= 0
          ) {
            if (prevBottom <= plat.y + 12 && currBottom >= plat.y) {
              p.y = plat.y - p.h;
              p.vy = 0;
              p.isGrounded = true;
              p.somersault = false;
              state.jumpCount = 0;
              break;
            }
          }
        }

        // Safety ground clamp: Never fall below ground level (y=470)
        const groundLevel = 470 - p.h;
        if (p.y >= groundLevel) {
          p.y = groundLevel;
          p.vy = 0;
          p.isGrounded = true;
          p.somersault = false;
          state.jumpCount = 0;
        }

        // Boundary constraint
        if (p.x < state.cameraX + 20) p.x = state.cameraX + 20;
        if (p.x > state.cameraX + 900) p.x = state.cameraX + 900;

        // Smooth camera track
        if (p.x - state.cameraX > 450 && state.cameraX < state.maxStageDistance) {
          state.cameraX = Math.min(state.maxStageDistance, p.x - 450);
          state.stageDistance = state.cameraX;
        }

        // Continuous rapid auto-fire when holding shoot
        if (k.shoot) {
          shootWeapon();
        }

        // Recoil & Muzzle flash cooldown
        if (state.muzzleFlashTimer > 0) state.muzzleFlashTimer--;
        if (state.barrelRecoil > 0) state.barrelRecoil -= 1;
        if (state.screenShake > 0) state.screenShake *= 0.85;

        // Invulnerability countdown
        if (state.invulnerableTimer > 0) state.invulnerableTimer--;
        if (state.shieldTimer > 0) {
          state.shieldTimer--;
          if (state.shieldTimer === 0) state.hasShield = false;
        }

        // Spawning cycle
        spawnTimer++;
        if (spawnTimer > 100 && !state.bossSpawned) {
          spawnTimer = 0;
          if (state.enemies.filter(e => e.type !== 'capsule').length < 5) {
            spawnEnemy();
          }
        }

        // Capsule spawn
        capsuleTimer++;
        if (capsuleTimer > 350) {
          capsuleTimer = 0;
          spawnCapsule();
        }

        // Check if reach boss stage
        if (state.cameraX >= state.maxStageDistance - 200 && !state.bossSpawned) {
          spawnBoss();
        }

        // Update Bullets
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.life--;

          // Despawn bullet offscreen or expired
          if (b.life <= 0 || b.x < state.cameraX - 100 || b.x > state.cameraX + 1100) {
            state.bullets.splice(i, 1);
            continue;
          }

          // Player bullet hitting enemies
          if (b.isPlayer) {
            let hit = false;
            for (let j = state.enemies.length - 1; j >= 0; j--) {
              const e = state.enemies[j];
              if (
                b.x >= e.x &&
                b.x <= e.x + e.w &&
                b.y >= e.y &&
                b.y <= e.y + e.h
              ) {
                hit = true;
                e.hp -= b.damage;

                // Spark particle
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: '#ffffff',
                  radius: 3,
                  life: 0,
                  maxLife: 10
                });

                // ⭐ USER REQUIREMENT: CÂU HỎI XUẤT HIỆN MỖI KHI BẮN XONG MỘT CON QUÁI!
                if (e.hp <= 0) {
                  createExplosion(e.x + e.w / 2, e.y + e.h / 2, e.type === 'boss' ? 55 : 22);
                  onUpdateScore(score + (e.type === 'boss' ? 5000 : 200));

                  const isBoss = e.type === 'boss';
                  if (isBoss) {
                    state.bossDefeated = true;
                    soundManager.playVictory();
                    onStageClear(score + 5000);
                  }

                  // Pick a random powerful weapon upgrade for answering the question
                  const upgrades: WeaponType[] = ['SPREAD', 'LASER', 'FIRE'];
                  const chosenWeapon = upgrades[Math.floor(Math.random() * upgrades.length)];

                  // Remove defeated enemy from battlefield
                  state.enemies.splice(j, 1);

                  // Trigger knowledge quiz immediately on EVERY monster kill!
                  onTriggerQuiz(chosenWeapon, isBoss);
                }
                break;
              }
            }
            if (hit && b.type !== 'LASER') {
              state.bullets.splice(i, 1);
            }
          } else {
            // Enemy bullet hitting player
            if (
              b.x >= p.x &&
              b.x <= p.x + p.w &&
              b.y >= p.y &&
              b.y <= p.y + p.h
            ) {
              state.bullets.splice(i, 1);
              if (state.invulnerableTimer === 0) {
                if (state.hasShield) {
                  state.hasShield = false;
                  state.invulnerableTimer = 40;
                  soundManager.playExplosion();
                } else {
                  state.playerHp -= 35;
                  state.invulnerableTimer = 60;
                  soundManager.playWrong();
                  if (state.playerHp <= 0) {
                    createExplosion(p.x + p.w / 2, p.y + p.h / 2, 25);
                    const newLives = lives - 1;
                    onUpdateLives(newLives);
                    if (newLives < 0) {
                      soundManager.playGameOver();
                      onGameOver(score, 1);
                    } else {
                      state.playerHp = 100;
                      p.x = state.cameraX + 80;
                      p.y = 300;
                      state.invulnerableTimer = 120;
                    }
                  }
                }
              }
            }
          }
        }

        // Update Floating Items
        for (let i = state.items.length - 1; i >= 0; i--) {
          const item = state.items[i];
          item.vy += 0.2;
          item.y += item.vy;
          item.life--;

          // Land on platform
          for (const plat of state.platforms) {
            if (item.y >= plat.y - 12 && item.y <= plat.y + 10 && item.x >= plat.x && item.x <= plat.x + plat.w) {
              item.y = plat.y - 12;
              item.vy = 0;
            }
          }

          // Player collects item
          if (
            p.x + p.w >= item.x - 14 &&
            p.x <= item.x + 14 &&
            p.y + p.h >= item.y - 14 &&
            p.y <= item.y + 14
          ) {
            soundManager.playPowerUp();
            if (item.type === 'S') onChangeWeapon('SPREAD');
            else if (item.type === 'L') onChangeWeapon('LASER');
            else if (item.type === 'F') onChangeWeapon('FIRE');
            else if (item.type === 'SHIELD') {
              state.hasShield = true;
              state.shieldTimer = 400;
            } else if (item.type === 'KNOWLEDGE') {
              const bonus: WeaponType = Math.random() > 0.5 ? 'SPREAD' : 'LASER';
              onTriggerQuiz(bonus, false);
            }
            onUpdateScore(score + 300);
            state.items.splice(i, 1);
            continue;
          }

          if (item.life <= 0) {
            state.items.splice(i, 1);
          }
        }

        // Update Enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i];
          e.stateTimer++;

          if (e.type === 'soldier') {
            e.x += e.vx;
            e.vy += 0.5;
            e.y += e.vy;
            for (const plat of state.platforms) {
              if (e.x + e.w > plat.x && e.x < plat.x + plat.w && e.y + e.h >= plat.y && e.y + e.h <= plat.y + 16) {
                e.y = plat.y - e.h;
                e.vy = 0;
              }
            }

            e.fireCooldown--;
            if (e.fireCooldown <= 0 && Math.abs(e.x - p.x) < 450) {
              e.fireCooldown = 110 + Math.random() * 40;
              const dir = e.x > p.x ? -1 : 1;
              state.bullets.push({
                x: e.x + (dir === 1 ? e.w : 0),
                y: e.y + 20,
                vx: dir * 4.5,
                vy: 0,
                radius: 3.5,
                color: '#ef4444',
                damage: 20,
                isPlayer: false,
                type: 'NORMAL',
                life: 90
              });
            }
          } else if (e.type === 'drone') {
            e.x += e.vx;
            e.y += Math.sin(e.stateTimer * 0.08) * 2;
          } else if (e.type === 'turret') {
            e.fireCooldown--;
            if (e.fireCooldown <= 0 && Math.abs(e.x - p.x) < 500) {
              e.fireCooldown = 120;
              const angle = Math.atan2((p.y + p.h / 2) - e.y, (p.x + p.w / 2) - e.x);
              state.bullets.push({
                x: e.x + e.w / 2,
                y: e.y + e.h / 2,
                vx: Math.cos(angle) * 4.5,
                vy: Math.sin(angle) * 4.5,
                radius: 4,
                color: '#f59e0b',
                damage: 25,
                isPlayer: false,
                type: 'NORMAL',
                life: 100
              });
            }
          } else if (e.type === 'capsule') {
            e.x += e.vx;
          } else if (e.type === 'boss') {
            e.y += Math.sin(e.stateTimer * 0.04) * 1.5;
            e.fireCooldown--;
            if (e.fireCooldown <= 0) {
              e.fireCooldown = 60;
              [-0.2, 0, 0.2].forEach(offset => {
                const angle = Math.PI + offset;
                state.bullets.push({
                  x: e.x,
                  y: e.y + e.h / 2,
                  vx: Math.cos(angle) * 5.2,
                  vy: Math.sin(angle) * 5.2,
                  radius: 5,
                  color: '#dc2626',
                  damage: 30,
                  isPlayer: false,
                  type: 'FIRE',
                  life: 110
                });
              });
            }
          }

          if (e.x < state.cameraX - 200 && e.type !== 'boss') {
            state.enemies.splice(i, 1);
          }
        }

        // Update Particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;
          if (pt.life >= pt.maxLife) {
            state.particles.splice(i, 1);
          }
        }
      }

      // ================= DRAW PHASE =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cam = gameState.current.cameraX;

      // Screen Shake offset
      ctx.save();
      if (gameState.current.screenShake > 0.5) {
        const shakeX = (Math.random() - 0.5) * gameState.current.screenShake;
        const shakeY = (Math.random() - 0.5) * gameState.current.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Parallax Background
      if (bgJungleImg.current && bgJungleImg.current.complete) {
        const bgOffset = (cam * 0.3) % canvas.width;
        ctx.drawImage(bgJungleImg.current, -bgOffset, 0, canvas.width, canvas.height);
        ctx.drawImage(bgJungleImg.current, canvas.width - bgOffset, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#06101e');
        grad.addColorStop(1, '#0f291e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Atmospheric ambient filter
      ctx.fillStyle = 'rgba(10, 20, 35, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-cam, 0);

      // 2. Draw Platforms & Bridges
      for (const plat of gameState.current.platforms) {
        if (plat.type === 'ground') {
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

          // Top foliage grass line
          ctx.fillStyle = '#15803d';
          ctx.fillRect(plat.x, plat.y, plat.w, 8);

          // Foliage detail
          ctx.fillStyle = '#22c55e';
          for (let gx = plat.x; gx < plat.x + plat.w; gx += 20) {
            ctx.fillRect(gx, plat.y, 10, 3);
          }
        } else {
          // Metallic Steel Platform
          ctx.fillStyle = '#334155';
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

          // Top cyber highlight
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(plat.x, plat.y, plat.w, 3);

          ctx.fillStyle = '#1e293b';
          for (let gx = plat.x + 10; gx < plat.x + plat.w; gx += 30) {
            ctx.fillRect(gx, plat.y + 3, 4, plat.h - 3);
          }
        }
      }

      // 3. Draw Floating Items / Power-up Orbs
      for (const item of gameState.current.items) {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.shadowColor = item.type === 'KNOWLEDGE' ? '#38bdf8' : '#f59e0b';
        ctx.shadowBlur = 12;

        ctx.fillStyle = item.type === 'KNOWLEDGE' ? '#0284c7' : '#ea580c';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.letter, 0, 1);
        ctx.restore();
      }

      // 4. Draw Enemies
      for (const e of gameState.current.enemies) {
        if (e.type === 'capsule') {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.ellipse(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(e.x + e.w / 2 - 4, e.y + e.h / 2 - 2, 8, 4);

          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(e.x - 4, e.y + 6, 6, 12);
          ctx.fillRect(e.x + e.w - 2, e.y + 6, 6, 12);
        } else if (e.type === 'soldier') {
          // Red Trooper Sprite
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(e.x + 4, e.y + 12, e.w - 8, 22);

          ctx.fillStyle = '#450a0a';
          ctx.fillRect(e.x + 6, e.y, 16, 12);

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(e.x - 6, e.y + 18, 16, 5);

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(e.x + 4, e.y + 34, 8, 14);
          ctx.fillRect(e.x + 16, e.y + 34, 8, 14);
        } else if (e.type === 'drone') {
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.arc(e.x + e.w / 2, e.y + e.h / 2, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(e.x + 4, e.y + 10, 8, 4);
        } else if (e.type === 'turret') {
          ctx.fillStyle = '#475569';
          ctx.fillRect(e.x, e.y + 16, e.w, 18);
          ctx.fillStyle = '#991b1b';
          ctx.beginPath();
          ctx.arc(e.x + e.w / 2, e.y + 16, 15, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(e.x - 10, e.y + 12, 16, 6);
        } else if (e.type === 'boss') {
          if (bossImg.current && bossImg.current.complete) {
            ctx.drawImage(bossImg.current, e.x, e.y, e.w, e.h);
          } else {
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(e.x, e.y, e.w, e.h);
          }

          // Boss Health Bar
          const hpPct = Math.max(0, e.hp / e.maxHp);
          ctx.fillStyle = '#000000';
          ctx.fillRect(e.x, e.y - 22, e.w, 10);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(e.x, e.y - 22, e.w * hpPct, 10);
          ctx.strokeStyle = '#ffffff';
          ctx.strokeRect(e.x, e.y - 22, e.w, 10);
        }
      }

      // 5. Draw Bullets (With Glowing Tracer & Neon Cores)
      for (const b of gameState.current.bullets) {
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.isPlayer ? 14 : 8;

        if (b.type === 'LASER') {
          // Thick railgun laser beam with bright white center
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 18, b.y - 4, 36, 8);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(b.x - 14, b.y - 2, 28, 4);
        } else if (b.type === 'FIRE') {
          // Giant revolving fireball
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius + 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Normal & Spread bullets
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          // Bright center
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 6. Draw Player Commando Soldier & Prominent Gun Barrel
      const p = gameState.current.player;
      const isBlinking = gameState.current.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0;

      if (!isBlinking) {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

        // Invulnerability Force Field Bubble
        if (gameState.current.hasShield || gameState.current.invulnerableTimer > 0) {
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(0, 0, 40, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Somersault Rotation during jump
        if (!p.isGrounded && p.somersault) {
          ctx.rotate(p.somersaultAngle);

          // Tucked Ball Somersault Sprite
          ctx.fillStyle = '#15803d'; // Camouflage green ball
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();

          // Red bandana fluttering streak
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-18, -6, 36, 8);

          // Boots tuck
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-8, 12, 16, 8);
        } else {
          // Standing / Running / Crouching Stance
          ctx.scale(p.facing, 1);

          // Offset from center
          ctx.translate(-p.w / 2, -p.h / 2);

          // Blue Headband trailing in wind
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(-10, 4, 12, 4);

          // Face & Head
          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(4, 2, 22, 14);

          // Red Bandana forehead band
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(4, 4, 22, 4);

          // Torso (Muscular Tactical Vest)
          ctx.fillStyle = '#15803d';
          ctx.fillRect(4, 16, 24, p.isCrouching ? 16 : 20);

          // Arms holding weapon
          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(8, 20, 14, 8);

          // ⭐ USER REQUIREMENT: NÒNG SÚNG BẮN MẠNH HƠN (Heavy Metallic Gun Barrel)
          const recoil = gameState.current.barrelRecoil;
          const wepInfo = WEAPONS[activeWeapon];

          ctx.save();
          if (p.aimY === -1) {
            // AIMING STRAIGHT UP 90 DEGREES
            ctx.translate(14, 14);
            // Gun Receiver
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-4, -6, 12, 16);
            // Heavy Chrome Barrel
            ctx.fillStyle = '#475569';
            ctx.fillRect(-2, -26 + recoil, 8, 22);
            // Metallic highlight
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(0, -26 + recoil, 3, 22);
            // Plasma Heat Core on barrel
            ctx.fillStyle = wepInfo.color;
            ctx.fillRect(-1, -18 + recoil, 6, 8);
            // Muzzle Brake
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-3, -29 + recoil, 10, 4);

            // Muzzle Flash
            if (gameState.current.muzzleFlashTimer > 0) {
              ctx.save();
              ctx.translate(2, -32 + recoil);
              ctx.fillStyle = '#fef08a';
              ctx.shadowColor = wepInfo.color;
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(0, 0, 12, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(-2, -18, 4, 36);
              ctx.fillRect(-18, -2, 36, 4);
              ctx.restore();
            }
          } else if (p.isCrouching) {
            // CROUCHING LOW SHOT
            ctx.translate(18, 26);
            // Heavy Barrel pointing forward low
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-4, -4, 10, 10);
            ctx.fillStyle = '#475569';
            ctx.fillRect(6 - recoil, -4, 26, 8);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(6 - recoil, -3, 26, 3);
            ctx.fillStyle = wepInfo.color;
            ctx.fillRect(12 - recoil, -2, 10, 4);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(30 - recoil, -5, 4, 10);

            // Muzzle Flash
            if (gameState.current.muzzleFlashTimer > 0) {
              ctx.save();
              ctx.translate(34 - recoil, 0);
              ctx.fillStyle = '#fef08a';
              ctx.shadowColor = wepInfo.color;
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(0, 0, 12, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(-2, -18, 4, 36);
              ctx.fillRect(-18, -2, 36, 4);
              ctx.restore();
            }
          } else {
            // FORWARD HORIZONTAL SHOT
            ctx.translate(16, 18);
            // Heavy Rifle Receiver & Stock
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-6, -4, 14, 12);
            // Dual Heavy Chrome Barrel
            ctx.fillStyle = '#334155';
            ctx.fillRect(8 - recoil, -4, 28, 9);
            // Chrome Highlight
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(8 - recoil, -3, 28, 3);
            // Glowing Energy Chamber
            ctx.fillStyle = wepInfo.color;
            ctx.fillRect(14 - recoil, -1, 12, 4);
            // Muzzle Port
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(34 - recoil, -5, 5, 11);

            // Explosive Muzzle Flash Starburst
            if (gameState.current.muzzleFlashTimer > 0) {
              ctx.save();
              ctx.translate(40 - recoil, 0);
              ctx.fillStyle = '#fef08a';
              ctx.shadowColor = wepInfo.color;
              ctx.shadowBlur = 22;
              ctx.beginPath();
              ctx.arc(0, 0, 14, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(-3, -20, 6, 40);
              ctx.fillRect(-20, -3, 40, 6);
              ctx.restore();
            }
          }
          ctx.restore();

          // Combat Pants & Heavy Boots
          if (!p.isCrouching) {
            ctx.fillStyle = '#365314';
            ctx.fillRect(5, 36, 9, 16);
            ctx.fillRect(17, 36, 9, 16);

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(4, 48, 11, 4);
            ctx.fillRect(16, 48, 11, 4);
          }
        }

        ctx.restore();
      }

      // 7. Draw Particles
      for (const pt of gameState.current.particles) {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.5, pt.radius * (1 - pt.life / pt.maxLife)), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // end camera translation
      ctx.restore(); // end screen shake

      // 8. In-Canvas Retro HUD Header
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, 0, canvas.width, 36);

      // Score
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`1P ${score.toString().padStart(6, '0')}`, 16, 22);

      // Stage Progress
      const progress = Math.min(100, Math.floor((gameState.current.cameraX / gameState.current.maxStageDistance) * 100));
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`TIẾN ĐỘ ${progress}%`, 170, 22);

      // Current Weapon Code & Name
      const wep = WEAPONS[activeWeapon];
      ctx.fillStyle = wep.color;
      ctx.fillText(`VŨ KHÍ: [${wep.code}] ${wep.name.split(' ')[0]}`, 340, 22);

      // Lives
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`MẠNG: ${'♥'.repeat(Math.max(0, lives))}`, 620, 22);

      // Shield indicator
      if (gameState.current.hasShield) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`LÁ CHẮN ON`, 780, 22);
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [
    isPaused,
    activeWeapon,
    lives,
    score,
    onGameOver,
    onStageClear,
    onTriggerQuiz,
    onUpdateLives,
    onUpdateScore,
    onChangeWeapon
  ]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Retro Arcade Screen Box */}
      <div className={`relative w-full max-w-5xl rounded-lg overflow-hidden border-4 border-slate-800 shadow-2xl bg-black ${
        scanlinesEnabled ? 'crt-overlay' : ''
      }`}>
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full aspect-video block pixelated"
        />

        {/* In-Game Status Floating Banner */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-4">
            <h2 className="font-arcade text-2xl text-amber-400 mb-2">TẠM DỪNG</h2>
            <p className="text-sm font-tech text-slate-300 max-w-md">
              Nhấn phím [P] hoặc nút TIẾP TỤC bên dưới để quay lại chiến trường Contra Lớp 11!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ArcadeGame.displayName = 'ArcadeGame';
