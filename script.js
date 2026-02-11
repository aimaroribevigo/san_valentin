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
    // Tapering trunk: Base (thick) -> Tip (thin)
    trunk: "M200,450 Q110,300 180,150",
    branches: [
        // Branches adjusted to emerge from points along the trunk path
        "M155,340 Q80,300 30,240",   // Emerges from lower trunk
        "M145,280 Q220,260 300,220",  // Emerges from mid trunk
        "M150,250 Q70,200 40,130",    // Emerges from mid trunk
        "M160,200 Q240,180 280,100",  // Emerges from upper trunk
        "M170,170 Q120,130 100,60",   // Emerges from near tip
        "M175,160 Q210,120 230,70",   // Emerges from near tip
        "M180,150 Q180,80 190,30"     // Tip extension
    ],
    branchEnds: [
        { x: 30, y: 240 }, { x: 300, y: 220 }, { x: 40, y: 130 },
        { x: 280, y: 100 }, { x: 100, y: 60 }, { x: 230, y: 70 }, { x: 190, y: 30 }
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

    // If tapering is needed, we'll handle it via an extra animation or static property if supported
    // Since SVG paths usually have constant width, for true tapering we'd need multiple paths or a mask.
    // However, for this effect, we'll use stroke-width transition or just set endWidth.
    if (startWidth !== endWidth) {
        path.style.transition = `stroke-width ${duration}s ease-out ${delay}s`;
        setTimeout(() => {
            path.style.strokeWidth = endWidth;
        }, delay * 1000 + 50); // Start transition slightly after
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

    // 1. Draw Trunk with tapering (Base 35 -> Tip 6)
    createPath(treeData.trunk, "tree-path trunk", 0, trunkDuration, 35, 6);

    // 2. Draw Branches (starting after trunk finishes)
    setTimeout(() => {
        treeData.branches.forEach((d, i) => {
            // Branches also taper slightly (7 -> 3)
            createPath(d, "tree-path branch", i * 0.1, branchDuration, 7, 3);
        });
    }, trunkDuration * 1000);

    // 3. Bloom Hearts
    const totalBranchWait = (trunkDuration + branchDuration + (treeData.branches.length * 0.1)) * 1000;

    setTimeout(() => {
        const heartCount = 400; // ¡Aún más para que sea súper frondoso!
        for (let i = 0; i < heartCount; i++) {
            // Alternar entre poner corazones en las puntas y en el camino de las ramas
            const end = treeData.branchEnds[Math.floor(Math.random() * treeData.branchEnds.length)];

            // Un poco de aleatoriedad para llenar huecos en el centro
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * (i % 3 === 0 ? 70 : 50); // Reducido para contención

            const x = end.x + Math.cos(angle) * dist * 1.1; // Factor horizontal reducido
            const y = end.y + Math.sin(angle) * dist;

            const size = 0.3 + Math.random() * 1.2;
            const delay = Math.random() * 5;

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

// Configuración de archivos (puedes cambiarlos aquí)
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

            // Marcar botón activo
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

// Cerrar menú al hacer clic fuera
document.addEventListener('click', () => {
    musicMenu.classList.remove('show');
});

// Intentar reproducir español automáticamente al primer clic (requerido por navegadores)
document.addEventListener('click', () => {
    if (!isPlaying) {
        playSong('es'); // Por defecto en español
    }
}, { once: true });

function init() {
    updateCounter();
    setInterval(updateCounter, 1000);
    typeMessage();
    animateTree();

    // Intento agresivo de reproducción automática
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.querySelector('.music-icon').textContent = '⏸️';
    }).catch(e => {
        console.log("Autoplay bloqueado, esperando interacción.");
    });
}

window.onload = init;
