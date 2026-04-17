// ===================== DATA =====================
const messages = [
    "Bạn ơi hãy nhớ lấy lời,\nDẫu đi vạn dặm phương trời xa xôi.\nMáu đào vẫn chảy trong người,\nChung nhau hai tiếng đồng bào mình ơi!",
    "Sống sao cho đáng thân mình,\nCho đi trọn vẹn chữ tình đồng hương.\nDẫu mai muôn dặm nẻo đường,\nViệt Nam vẫn mãi là thương là chờ.",
    "Việt Nam hai tiếng là nhà,\nBốn ngàn năm trước ông cha đắp bồi.\nDòng sông chảy mãi không thôi,\nBạn là dòng chảy nối đời tương lai.",
    "Dù cho biển rộng đường xa,\nSóng to gió lớn chẳng qua lòng người.\nBạn đi tô điểm cho đời,\nGói theo bóng dáng phương trời Việt Nam.",
    "Quê hương vốn dĩ là nhà,\nLà câu hát cũ mẹ cha vẫn hò.\nDù cho thế giới có to,\nVề đây vẫn có con đò bến xưa.",
    "Gửi bạn ánh nắng mai vươn,\nViết tiếp trang sử chẳng vương bụi mờ.\nSống sao cho đẹp như thơ,\nCho bõ công sức mong chờ của cha ông."
];

const particleEmojis = ['⭐', '✨', '🌟', '🇻🇳', '📖', '📚', '🏮', '🎋'];

// ===================== STATE =====================
let bgMusic = null;
let musicPlaying = false;
let newsAudio = null;
let newsPlaying = false;
let currentSection = null;
let shownLetterIndices = [];
let particleAnimRunning = false;
let audioFadeInterval = null; // Quản lý vòng lặp âm lượng để chống lỗi giật tiếng

// ===================== LANDING PARTICLES =====================
function createLandingParticles() {
    const c = document.getElementById('landingParticles');
    if (!c) return;
    const emojis = ['🇻🇳', '⭐', '📖', '✨', '📚', '🌟', '🏮', '🎋', '🌸', '🌺'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'floating-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.fontSize = (Math.random() * 16 + 12) + 'px';
        p.style.animationDuration = (Math.random() * 10 + 8) + 's';
        p.style.animationDelay = (Math.random() * 6) + 's';
        c.appendChild(p);
    }
}

// ===================== STAR CANVAS =====================
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let starAnimId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    for (let i = 0; i < 80; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.8,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.25 + 0.05,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.5 ? '211, 47, 47' : '249, 168, 37',
        });
    }

    function draw() {
        if (document.getElementById('landing-page').classList.contains('hidden')) return; // Optimize
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.twinklePhase += s.twinkleSpeed;
            const alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.twinklePhase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
            ctx.fill();
            // Glow
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, ${alpha * 0.08})`;
            ctx.fill();
        });
        starAnimId = requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', resize);
}

// ===================== PARTICLE CANVAS (MAIN PAGE) =====================
function initParticleCanvas() {
    if (particleAnimRunning) return;
    particleAnimRunning = true;

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();

    class Particle {
        constructor(randomY) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : -20;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1; // Falling down 
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.wobble = Math.random() * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            const colors = [
                'rgba(255, 215, 0, ',   // Gold
                'rgba(255, 235, 59, ',  // Yellow
                'rgba(255, 193, 7, ',   // Amber
                'rgba(255, 255, 255, '  // White sparks
            ];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.wobble += this.wobbleSpeed;
            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.fill();
            // Glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + (this.opacity * 0.15) + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) {
        particles.push(new Particle(true));
    }

    let particleAnimId;
    function loop() {
        if (!document.getElementById('main-page').classList.contains('show')) {
            particleAnimId = requestAnimationFrame(loop);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        particleAnimId = requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', resize);
}

// ===================== CONFETTI BURST =====================
function burstConfetti(count) {
    const colors = ['#da2d2d', '#ffd54f', '#ef5350', '#ffb300', '#b71c1c', '#fff', '#f9a825', '#ffe082'];
    for (let i = 0; i < count; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = (Math.random() * 100) + 'vw';
        c.style.top = '-10px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.width = (Math.random() * 8 + 4) + 'px';
        c.style.height = (Math.random() * 8 + 4) + 'px';
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        c.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        c.style.animationDelay = (Math.random() * 0.8) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

// ===================== SPARKLE ON CLICK =====================
document.addEventListener('click', e => {
    const colors = ['#da2d2d', '#ffd54f', '#ef5350', '#ffb300', '#ffe082'];
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.background = colors[Math.floor(Math.random() * colors.length)];
        s.style.left = (e.clientX + (Math.random() - 0.5) * 40) + 'px';
        s.style.top = (e.clientY + (Math.random() - 0.5) * 40) + 'px';
        const sz = (Math.random() * 6 + 3) + 'px';
        s.style.width = sz;
        s.style.height = sz;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 700);
    }
});

// ===================== BACKGROUND MUSIC =====================
function startBgMusic() {
    if (!bgMusic) {
        bgMusic = new Audio('1.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.35;
    }
    bgMusic.play().then(() => {
        musicPlaying = true;
        updateMusicBtn();
    }).catch(() => {});
}

function toggleBgMusic() {
    const btn = document.getElementById('musicBtn');
    if (!bgMusic) {
        startBgMusic();
        return;
    }
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        updateMusicBtn();
    } else {
        bgMusic.play().then(() => {
            musicPlaying = true;
            updateMusicBtn();
        }).catch(() => {});
    }
}

function updateMusicBtn() {
    const btn = document.getElementById('musicBtn');
    if (!btn) return;
    if (musicPlaying) {
        btn.classList.add('playing');
        btn.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Fade volume smoothly up or down
function fadeBgVolumeTo(targetVol, duration) {
    if (!bgMusic || !musicPlaying) return;
    clearInterval(audioFadeInterval); // Dọn dẹp tiến trình cũ

    const startVol = bgMusic.volume;
    const steps = 30;
    const interval = duration / steps;
    const volStep = (targetVol - startVol) / steps;
    let step = 0;

    audioFadeInterval = setInterval(() => {
        step++;
        let newVol = startVol + volStep * step;
        if (newVol < 0) newVol = 0;
        if (newVol > 1) newVol = 1;
        bgMusic.volume = newVol;
        
        if (step >= steps) {
            bgMusic.volume = targetVol;
            clearInterval(audioFadeInterval);
        }
    }, interval);
}

// ===================== NEWS AUDIO (2.mp3) =====================
function toggleNewsAudio() {
    const btn = document.getElementById('newsAudioBtn');
    const eq = document.getElementById('newsEq');

    if (!newsAudio) {
        newsAudio = new Audio('2.mp3');
        newsAudio.volume = 0.8;
        newsAudio.addEventListener('ended', () => {
            newsPlaying = false;
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('playing');
            eq.classList.remove('active');
            // Restore bg music volume
            fadeBgVolumeTo(0.35, 2000);
        });
    }

    if (newsPlaying) {
        newsAudio.pause();
        newsPlaying = false;
        btn.innerHTML = '<i class="fas fa-play"></i>';
        btn.classList.remove('playing');
        eq.classList.remove('active');
        // Restore bg music volume
        fadeBgVolumeTo(0.35, 2000);
    } else {
        // Duck bg music volume down to let voice be heard
        fadeBgVolumeTo(0.08, 1500);
        newsAudio.currentTime = 0;
        newsAudio.play().then(() => {
            newsPlaying = true;
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            btn.classList.add('playing');
            eq.classList.add('active');
        }).catch(() => {});
    }
}

// ===================== START EXPERIENCE =====================
function startExperience() {
    const landing = document.getElementById('landing-page');
    landing.classList.add('hidden');

    // Start bg music
    startBgMusic();

    setTimeout(() => {
        landing.style.display = 'none';
        document.getElementById('main-page').classList.add('show');
        document.getElementById('musicBtn').style.display = 'flex';
        initParticleCanvas();
        burstConfetti(60);
    }, 1000);
}

function openSection(sectionName) {

    // Hide hero (header + nav)
    document.getElementById('mainNav').style.display = 'none';
    document.querySelector('.main-header').style.display = 'none';

    // Show content area overlay
    const contentArea = document.getElementById('contentArea');
    contentArea.classList.add('show');

    // Hide all sections then show the selected one
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    const section = document.getElementById('section-' + sectionName);
    if (section) {
        section.classList.add('active');
        // Re-trigger timeline animations
        if (sectionName === 'timeline') {
            section.querySelectorAll('.timeline-item').forEach((item, i) => {
                item.style.animation = 'none';
                item.offsetHeight; // trigger reflow
                item.style.animation = `timelineFadeIn 0.6s ease forwards ${i * 0.1 + 0.1}s`;
            });
        }
    }

    // Show back button
    document.getElementById('backBtn').style.display = 'block';
    currentSection = sectionName;

    // Scroll to top
    contentArea.scrollTop = 0;
}

function closeSection() {
    // Stop news audio if playing
    if (newsPlaying && newsAudio) {
        newsAudio.pause();
        newsPlaying = false;
        const btn = document.getElementById('newsAudioBtn');
        const eq = document.getElementById('newsEq');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('playing');
        }
        if (eq) eq.classList.remove('active');
    }

    // Hide sections
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));

    // Hide content area overlay
    document.getElementById('contentArea').classList.remove('show');

    // Show hero (header + nav) again
    document.querySelector('.main-header').style.display = '';
    document.getElementById('mainNav').style.display = 'flex';

    // Hide back button
    document.getElementById('backBtn').style.display = 'none';
    currentSection = null;
}

// ===================== LETTER LOGIC =====================
function showRandomLetter() {
    // If all shown, reset
    if (shownLetterIndices.length >= messages.length) {
        shownLetterIndices = [];
    }

    // Pick a random index not yet shown
    let availableIndices = [];
    for (let i = 0; i < messages.length; i++) {
        if (!shownLetterIndices.includes(i)) {
            availableIndices.push(i);
        }
    }

    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    shownLetterIndices.push(randomIdx);

    // Show the letter
    document.getElementById('letterPrompt').style.display = 'none';
    const display = document.getElementById('letterDisplay');
    display.style.display = 'block';

    const textEl = document.getElementById('letterText');
    textEl.textContent = messages[randomIdx];
    // Re-trigger animation
    textEl.style.animation = 'none';
    textEl.offsetHeight;
    textEl.style.animation = 'letterReveal 1s ease';

    // Re-trigger display animation
    display.style.animation = 'none';
    display.offsetHeight;
    display.style.animation = 'fadeUp 0.7s ease';
}

// ===================== INIT =====================
createLandingParticles();
initStarCanvas();
