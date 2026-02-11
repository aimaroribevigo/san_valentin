// Configuration
const startDate = new Date('2024-01-11T00:00:00');
const message = "Si pudiera elegir un lugar seguro, sería a tu lado. Gracias por este tiempo juntos, por cada sonrisa y por ser mi compañera. Te amo más de lo que las palabras pueden expresar.";

// Counter Logic
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Typing Effect
function typeMessage() {
    const textElement = document.getElementById('typing-text');
    let i = 0;

    function type() {
        if (i < message.length) {
            textElement.textContent += message.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    type();
}

// Tree and Heart Animation Logic
const treeSvg = document.getElementById('tree-svg');

const treeData = {
    // Tapering trunk: Centered and vertical for better balance
    trunk: "M200,450 Q190,300 200,150",
    branches: [
        // Adjusted to stay within the heart bounds (now larger)
        "M200,350 Q160,330 110,280",   // Lower Left
        "M200,350 Q240,330 290,280",  // Lower Right
        "M200,280 Q130,250 90,170",    // Mid Left
        "M200,280 Q270,250 310,170",  // Mid Right
        "M200,210 Q160,160 140,70",   // Upper Left
        "M200,210 Q240,160 260,70"    // Upper Right
    ],
    branchEnds: [
        { x: 110, y: 280 }, { x: 290, y: 280 }, { x: 90, y: 170 },
        { x: 310, y: 170 }, { x: 140, y: 70 }, { x: 260, y: 70 }
    ]
};

function createPath(d, className, delay, duration = 2, startWidth = 8, endWidth = 8) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("class", className);

    treeSvg.appendChild(path);
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.strokeWidth = startWidth; // Initial width

    // We'll use a CSS variable or direct style for the draw animation
    path.style.animation = `draw ${duration}s ease-out forwards ${delay}s`;

    if (startWidth !== endWidth) {
        path.style.transition = `stroke-width ${duration}s ease-out ${delay}s`;
        setTimeout(() => {
            path.style.strokeWidth = endWidth;
        }, delay * 1000 + 50);
    }

    return path;
}

function createHeart(x, y, size, delay) {
    const heart = document.createElementNS("http://www.w3.org/2000/svg", "path");
    heart.setAttribute("d", `M${x},${y} c-3,-4 -8,-4 -8,2 c0,5 8,10 8,10 s8,-5 8,-10 c0,-6 -5,-6 -8,-2`);
    heart.setAttribute("class", "heart");
    heart.style.setProperty('--scale', size);
    heart.style.fill = `hsl(${Math.random() * 30 + 330}, 90%, ${Math.random() * 20 + 60}%)`;
    heart.style.transformOrigin = `${x}px ${y}px`;
    heart.style.animation = `bloom 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${delay}s`;
    heart.style.opacity = "0";

    return heart;
}

function animateTree() {
    const trunkDuration = 2;
    const branchDuration = 1.5;
    const branchPaths = [];

    // 1. Draw Smooth Tapered Trunk (Starting with a wide, flat foundation)
    const trunkSegments = 15;
    const startY = 460; // Slightly lower to meet the "floor"
    const endY = 150;
    const startW = 85; // Massive wide flat base
    const endW = 12;

    for (let i = 0; i < trunkSegments; i++) {
        const t = i / trunkSegments;
        const nextT = (i + 1) / trunkSegments;

        const getPoint = (p) => {
            const y = startY + (endY - startY) * p;
            const x = 200 + (1 - p) * Math.sin(p * Math.PI) * -10;
            return { x, y };
        };

        const p1 = getPoint(t);
        const p2 = getPoint(nextT);

        // Taper faster at the bottom for that "flat floor" look
        const easeT = Math.pow(t, 0.4);
        const currentWidth = startW + (endW - startW) * easeT;
        const nextWidth = startW + (endW - startW) * Math.pow(nextT, 0.4);

        const d = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
        createPath(d, "tree-path trunk", t * 1.2, 0.2, currentWidth, nextWidth);
    }

    // 2. Draw Branches
    setTimeout(() => {
        treeData.branches.forEach((d, i) => {
            const path = createPath(d, "tree-path branch", i * 0.1, branchDuration, 8, 3);
            branchPaths.push(path);
        });
    }, trunkDuration * 1000);

    // 3. Bloom Hearts in a large Heart Shape
    const totalBranchWait = (trunkDuration + branchDuration + (treeData.branches.length * 0.1)) * 1000;

    setTimeout(() => {
        const heartCount = 1400; // Even denser
        const centerX = 200;
        const centerY = 150; // Moved up to define the shape better against the trunk
        const scale = 14;

        for (let i = 0; i < heartCount; i++) {
            const t = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random());

            const rawX = 16 * Math.pow(Math.sin(t), 3);
            const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const x = centerX + rawX * r * scale;
            const y = centerY + rawY * r * scale;

            const size = 0.2 + Math.random() * 1.0;
            const delay = Math.random() * 5;

            // Remove artificial Y constraint to let the heart's natural point be the "floor" of the bloom
            // This makes the heart shape unmistakable.
            const heart = createHeart(x, y, size, delay);
            treeSvg.appendChild(heart);
        }
    }, totalBranchWait);
}

// Music Logic
const musicBtn = document.getElementById('music-btn');
const musicMenu = document.getElementById('music-menu');
const bgMusic = document.getElementById('bg-music');
const langBtns = document.querySelectorAll('.lang-btn');
let isPlaying = false;

const musicFiles = {
    es: 'musica.mp3',
    en: 'musica_ingles.mp3'
};

function toggleMusicMenu() {
    musicMenu.classList.toggle('show');
}

function playSong(lang) {
    if (bgMusic.getAttribute('data-current-lang') === lang && isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.querySelector('.music-icon').textContent = '🎵';
    } else {
        bgMusic.src = musicFiles[lang];
        bgMusic.setAttribute('data-current-lang', lang);
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.music-icon').textContent = '⏸️';

            langBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
            });
        }).catch(e => console.log("Audio play failed:", e));
    }
    musicMenu.classList.remove('show');
}

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusicMenu();
});

langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.getAttribute('data-lang');
        playSong(lang);
    });
});

document.addEventListener('click', () => {
    musicMenu.classList.remove('show');
});

document.addEventListener('click', () => {
    if (!isPlaying) {
        playSong('es');
    }
}, { once: true });

// Game Logic: Flappy Heart
let gameActive = false;
let gameLoop = null;
let score = 0;
let birdY = 250;
let birdVelocity = 0;
const gravity = 0.20;
const jump = -5.2;
let pipes = [];
let lastPipeTime = 0;
let pipesSpawned = 0;
let boyEl = null;
let boyX = 0;

const gameOverlay = document.getElementById('game-overlay');
const gameCanvas = document.getElementById('game-canvas');
const gameBird = document.getElementById('game-catcher');
const scoreDisplay = document.getElementById('game-score');
const startGameBtn = document.getElementById('start-game-btn');
const closeGameBtn = document.getElementById('close-game-btn');

let birdScaleX = 1;
let birdScaleY = 1;

let lastTime = 0;
let currentRotation = 0;
let particles = [];

function initGame() {
    gameOverlay.style.display = 'flex';
    gameActive = true;
    score = 0;
    birdY = gameCanvas.clientHeight / 2;
    birdVelocity = 0;
    currentRotation = 0;
    birdScaleX = 1;
    birdScaleY = 1;

    gameBird.style.transition = 'none';

    pipes = [];
    particles = [];
    pipesSpawned = 0;
    lastPipeTime = performance.now();
    lastTime = performance.now();
    scoreDisplay.textContent = score;

    const oldPipes = gameCanvas.querySelectorAll('.game-pipe');
    oldPipes.forEach(p => p.remove());
    const oldParts = gameCanvas.querySelectorAll('.game-particle');
    oldParts.forEach(p => p.remove());
    if (boyEl) { boyEl.remove(); boyEl = null; }
    const winMsg = gameCanvas.querySelector('.win-message');
    if (winMsg) { winMsg.remove(); }

    const instr = document.getElementById('game-instructions');
    if (instr) instr.style.display = 'block';

    gameLoop = requestAnimationFrame(updateFlappy);

    gameCanvas.addEventListener('mousedown', jumpBird);
    window.addEventListener('keydown', handleKey);
}

function handleKey(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        jumpBird();
    }
}

function jumpBird() {
    if (!gameActive) return;
    birdVelocity = jump;

    // JS-based juice: Set scale target
    birdScaleX = 1.3;
    birdScaleY = 0.7;
}

function updateFlappy(timestamp) {
    if (!gameActive) return;

    let dt = (timestamp - lastTime) / 16.67;
    if (dt > 4) dt = 4;
    lastTime = timestamp;

    birdVelocity += gravity * dt;
    birdY += birdVelocity * dt;

    // Smooth Scale Return (Juice)
    birdScaleX += (1 - birdScaleX) * 0.1 * dt;
    birdScaleY += (1 - birdScaleY) * 0.1 * dt;

    const targetRotation = Math.min(Math.max(birdVelocity * 4, -25), 90);
    currentRotation += (targetRotation - currentRotation) * 0.15 * dt;

    // Combined Transform: Position + Rotation + Juice-Scale
    gameBird.style.transform = `translate3d(0, ${birdY}px, 0) rotate(${currentRotation}deg) scale(${birdScaleX}, ${birdScaleY}) translate(-50%, -50%)`;

    if (Math.random() < 0.4 * dt) spawnParticle();
    updateParticles(dt);

    const canvasH = gameCanvas.clientHeight;
    if (birdY < 0 || birdY > canvasH) {
        gameOver();
        return;
    }

    if (pipesSpawned < 20 && timestamp - lastPipeTime > 1800) {
        spawnPipe();
        lastPipeTime = timestamp;
    }

    const birdRect = gameBird.getBoundingClientRect();

    // Update Pipes with DT
    for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 3.5 * dt;

        p.topEl.style.transform = `translate3d(${p.x}px, 0, 0)`;
        p.bottomEl.style.transform = `translate3d(${p.x}px, 0, 0)`;

        const topRect = p.topEl.getBoundingClientRect();
        const bottomRect = p.bottomEl.getBoundingClientRect();

        if (checkCollision(birdRect, topRect) || checkCollision(birdRect, bottomRect)) {
            gameOver();
            return;
        }

        if (!p.passed && p.x < 80) {
            p.passed = true;
            score++;
            scoreDisplay.textContent = score;
            if (score === 20) spawnBoy();
        }

        if (p.x < -100) {
            p.topEl.remove();
            p.bottomEl.remove();
            pipes.splice(i, 1);
        }
    }

    if (boyEl) {
        boyX -= 3.5 * dt;
        boyEl.style.transform = `translate3d(${boyX}px, -50%, 0)`;
        if (boyX < 120) {
            winGame();
            return;
        }
    }

    gameLoop = requestAnimationFrame(updateFlappy);
}

function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'game-particle';
    p.textContent = Math.random() > 0.5 ? '✨' : '🌸';
    gameCanvas.appendChild(p);

    particles.push({
        el: p,
        x: 80,
        y: birdY,
        vx: -1 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1.0
    });
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.02 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        p.el.style.opacity = p.life;

        if (p.life <= 0) {
            p.el.remove();
            particles.splice(i, 1);
        }
    }
}

function spawnPipe() {
    pipesSpawned++;
    const gap = 160;
    const minH = 50;
    const canvasH = gameCanvas.clientHeight;
    const topH = minH + Math.random() * (canvasH - gap - minH * 2);
    const canvasW = gameCanvas.clientWidth;

    const topPipe = document.createElement('div');
    topPipe.className = 'game-pipe';
    topPipe.style.height = `${topH}px`;
    topPipe.style.top = '0';

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'game-pipe';
    bottomPipe.style.height = `${canvasH - topH - gap}px`;
    bottomPipe.style.bottom = '0';

    gameCanvas.appendChild(topPipe);
    gameCanvas.appendChild(bottomPipe);

    pipes.push({
        x: canvasW,
        topEl: topPipe,
        bottomEl: bottomPipe,
        passed: false
    });
}

function spawnBoy() {
    boyEl = document.createElement('div');
    boyEl.className = 'game-boy';
    boyEl.textContent = '👦'; // User (waiting)
    boyX = gameCanvas.clientWidth + 100;
    boyEl.style.left = '0'; // We use transform
    gameCanvas.appendChild(boyEl);
}

function checkCollision(r1, r2) {
    const b = 8; // Buffer
    return !(r1.right - b < r2.left + b ||
        r1.left + b > r2.right - b ||
        r1.bottom - b < r2.top + b ||
        r1.top + b > r2.bottom - b);
}

function gameOver() {
    gameActive = false;
    cancelAnimationFrame(gameLoop);
    gameCanvas.classList.add('game-shake');
    setTimeout(() => gameCanvas.classList.remove('game-shake'), 400);

    const m = document.createElement('div');
    m.className = 'win-message';
    m.innerHTML = '<h3 style="color:white; margin-bottom:15px; font-weight:300;">¡Casi llegas! ❤️</h3><button onclick="initGame()" class="game-btn">Intentar de nuevo</button>';
    m.style.position = 'absolute'; m.style.top = '50%'; m.style.left = '50%'; m.style.transform = 'translate(-50%, -50%)';
    gameCanvas.appendChild(m);
}

function winGame() {
    gameActive = false;
    cancelAnimationFrame(gameLoop);

    // Heart meets Boy
    gameBird.style.transition = 'all 0.5s ease-out';
    gameBird.style.transform = `translate3d(${boyX + 20}px, ${birdY}px, 0) scale(1.5) translate(-50%, -50%)`;

    setTimeout(() => {
        const winMsg = document.createElement('div');
        winMsg.className = 'win-message';
        winMsg.innerHTML = '<h2 style="font-family:\'Great Vibes\'; font-size: 3.5rem; color: #ff4d6d; text-shadow: 0 0 25px white;">¡Llegaste a mi corazón! ❤️</h2>';
        winMsg.style.position = 'absolute'; winMsg.style.top = '50%'; winMsg.style.left = '50%'; winMsg.style.transform = 'translate(-50%, -50%)'; winMsg.style.textAlign = 'center'; winMsg.style.width = '100%';
        gameCanvas.appendChild(winMsg);

        pipes.forEach(p => { p.topEl.remove(); p.bottomEl.remove(); });
        pipes = [];

        setTimeout(() => {
            animateTree();
            for (let i = 0; i < 40; i++) setTimeout(spawnMainHeartAtRandom, i * 80);
        }, 1200);
    }, 600);
}

function spawnMainHeartAtRandom() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const h = createHeart(x, y, 0.6 + Math.random(), 0);
    h.style.position = 'fixed'; h.style.zIndex = '3000';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 4000);
}

function closeGame() {
    gameActive = false;
    cancelAnimationFrame(gameLoop);
    gameOverlay.style.display = 'none';
    pipes.forEach(p => { p.topEl.remove(); p.bottomEl.remove(); });
    pipes = [];
    if (boyEl) { boyEl.remove(); boyEl = null; }
    window.removeEventListener('keydown', handleKey);
}

startGameBtn.addEventListener('click', initGame);
closeGameBtn.addEventListener('click', closeGame);

function init() {
    updateCounter();
    setInterval(updateCounter, 1000);
    typeMessage();
    animateTree();

    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.music-icon').textContent = '⏸️';
    }).catch(e => { console.log("Autoplay blocked"); });
}

window.onload = init;
