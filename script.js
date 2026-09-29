/* 1. 3D DOOR ENTRY ANIMATION */
function openDoor() {
    const doorOverlay = id('door-overlay');
    if (!doorOverlay) return;
    
    doorOverlay.classList.add('door-open');
    
    // Start Petals Canvas
    const petalsCanvas = id('petals-canvas');
    if (petalsCanvas) {
        petalsCanvas.style.opacity = '1';
        startPetals();
    }

    setTimeout(() => {
        doorOverlay.style.visibility = 'hidden';
    }, 2500);
}

function id(e) { return document.getElementById(e); }

/* 2. SCROLL FADE-IN & FADE-OUT OBSERVER */
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active'); // Fade out on scroll away
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* 3. COUNTDOWN TIMER TO NIKAH (29 Nov 2026) */
const weddingDate = new Date('November 29, 2026 11:00:00').getTime();

setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff > 0) {
        const daysEl = id('days');
        const hoursEl = id('hours');
        const minsEl = id('mins');
        const secsEl = id('secs');

        if (daysEl) daysEl.innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (hoursEl) hoursEl.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (minsEl) minsEl.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (secsEl) secsEl.innerText = Math.floor((diff % (1000 * 60)) / 1000);
    }
}, 1000);

/* 4. FALLING ROSE PETALS CANVAS ANIMATION */
let animationFrameId = null; // Track frame to prevent multiple loops

function startPetals() {
    const canvas = id('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];
    const petalCount = 45;

    for (let i = 0; i < petalCount; i++) {
        petals.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 12 + 8,
            speedY: Math.random() * 1.5 + 1,
            speedX: Math.random() * 1 - 0.5,
            angle: Math.random() * 360,
            spin: Math.random() * 0.02 - 0.01,
            color: Math.random() > 0.3 ? '#c41e3a' : '#dfb15b'
        });
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
        ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            p.y += p.speedY;
            p.x += Math.sin(p.y * 0.01) + p.speedX;
            p.angle += p.spin;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }

            drawPetal(p);
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Cancel any existing loop if startPetals is called twice
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate();

    // Handle window resize cleanly (remove duplicate listeners by defining outside or handling sizing dynamically)
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, { passive: true });
}