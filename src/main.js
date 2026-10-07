import './style.css';
import confetti from 'canvas-confetti';

/* -------------------------------------------------------------
   STATE MANAGEMENT & DEFAULT DATA
   ------------------------------------------------------------- */
const urlParams = new URLSearchParams(window.location.search);
const targetEmail = urlParams.get('email') || 'sampathiraovaraprasad8@gmail.com'; // Default to Male Best Friend's Gmail

const appState = {
  name: 'Vennela',
  age: 19,
  date: 'October 9, 2026',
  sender: 'Your Male Best Friend',
  recipientEmail: targetEmail,
  currentStage: 1,
  currentPage: 1,
  musicPlaying: false,
  audioCtx: null,
  candlesBlown: false,
  reasons: [
    "Your radiant smile that lights up any room ✨",
    "Your kind, genuine & empathetic soul 💖",
    "Our hilarious inside jokes & non-stop laughs 🤣",
    "Always being there as a true best friend 🤝",
    "Your effortless style & cute aesthetic 🌸",
    "Making every ordinary day feel like an adventure 🌟",
    "Your unmatched loyalty & trustworthiness 🛡️",
    "How you make everyone around you feel happy 🥰",
    "Your infectious positive energy & spirit ⚡",
    "Late-night chats sharing our life stories 🌙",
    "Your determination & strength in everything 💪",
    "Keeping every secret safe forever 🤫",
    "Your quick wit and amazing sense of humor 😂",
    "Knowing what I'm thinking with just one look 👀",
    "Always supporting my biggest goals & dreams 🚀",
    "The comforting warmth of your friendship 🧸",
    "Inspiring me to be a better person every day 🌈",
    "19 years of pure moonlight & magic in this world 🎂",
    "Simply put: You are irreplaceable, Vennela! 👑"
  ]
};

// Global helper so male best friend can check wishes anytime in browser console
window.getVennelaWishes = function() {
  const wishes = JSON.parse(localStorage.getItem('vennela_wishes') || '[]');
  console.log("💌 VENNELA'S SECRET WISHES:", wishes);
  return wishes;
};

/* -------------------------------------------------------------
   WEB AUDIO API SOUND GENERATOR
   ------------------------------------------------------------- */
function getAudioContext() {
  if (!appState.audioCtx) {
    appState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (appState.audioCtx.state === 'suspended') {
    appState.audioCtx.resume();
  }
  return appState.audioCtx;
}

function playSoundEffect(type) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'unlock') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'page') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    console.log("Web audio sound error:", e);
  }
}

/* Synthesized Ambient Birthday Melody */
let melodyInterval = null;
function toggleBackgroundMusic() {
  const musicBtn = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  
  if (appState.musicPlaying) {
    appState.musicPlaying = false;
    musicBtn.querySelector('.btn-text').textContent = 'Music: OFF';
    musicIcon.textContent = '🎵';
    if (melodyInterval) clearInterval(melodyInterval);
  } else {
    appState.musicPlaying = true;
    musicBtn.querySelector('.btn-text').textContent = 'Music: ON';
    musicIcon.textContent = '🎶';
    startSynthesizedMelody();
  }
}

function startSynthesizedMelody() {
  const ctx = getAudioContext();
  const notes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23
  ];
  let index = 0;

  if (melodyInterval) clearInterval(melodyInterval);
  melodyInterval = setInterval(() => {
    if (!appState.musicPlaying) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[index], now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      index = (index + 1) % notes.length;
    } catch(e) {}
  }, 400);
}

/* -------------------------------------------------------------
   CANVAS ENGINE: STARDUST, FIREWORKS & SKY LANTERNS
   ------------------------------------------------------------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let fireworks = [];
let lanterns = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -Math.random() * 0.5 - 0.2;
    this.alpha = Math.random() * 0.7 + 0.3;
    this.color = Math.random() > 0.5 ? '#ffd700' : '#ff65a3';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) this.y = height;
    if (this.x < 0 || this.x > width) this.x = Math.random() * width;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.gravity = 0.08;
  }

  update() {
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SkyLantern {
  constructor(x, y, text = "") {
    this.x = x || Math.random() * width;
    this.y = y || height + 50;
    this.vy = -Math.random() * 0.8 - 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 12 + 20;
    this.text = text;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -100) this.y = height + 100;
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffd700';
    ctx.fillStyle = 'rgba(255, 180, 50, 0.85)';
    ctx.beginPath();
    ctx.roundRect(this.x - this.size / 2, this.y - this.size, this.size, this.size * 1.3, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y - this.size * 0.3, this.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class CuteEmoji {
  constructor(x, y) {
    this.emojis = ['🧸', '🌸', '🎀', '✨', '💖', '🐱', '👑', '🧁', '🎈', '💫', '🍓', '🍧', '🦄', '🦋', '🌙', '🐰', '🍩', '🌷'];
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x !== undefined ? x : Math.random() * width;
    this.y = y !== undefined ? y : height + Math.random() * 100;
    this.emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    this.size = Math.random() * 14 + 24;
    this.vy = -Math.random() * 0.8 - 0.4;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.swaySpeed = Math.random() * 0.03 + 0.01;
    this.swayAmplitude = Math.random() * 1.8 + 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.rotation = (Math.random() - 0.5) * 0.3;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.alpha = Math.random() * 0.4 + 0.6;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += this.swaySpeed;
    this.x += Math.sin(this.angle) * this.swayAmplitude * 0.4 + this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.pulse += 0.04;

    if (this.y < -60) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    const currentScale = 1 + Math.sin(this.pulse) * 0.1;
    ctx.scale(currentScale, currentScale);

    ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(255, 105, 180, 0.7)';

    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }

  isClicked(cx, cy) {
    const dx = this.x - cx;
    const dy = this.y - cy;
    return Math.sqrt(dx * dx + dy * dy) < (this.size + 12);
  }
}

let cuteEmojis = [];
for (let i = 0; i < 28; i++) {
  cuteEmojis.push(new CuteEmoji(Math.random() * width, Math.random() * height));
}

function spawnExtraCuties(count = 15) {
  playSoundEffect('chime');
  confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  for (let i = 0; i < count; i++) {
    cuteEmojis.push(new CuteEmoji(Math.random() * width, height + Math.random() * 60));
  }
}

for (let i = 0; i < 90; i++) {
  particles.push(new Particle());
}

function launchFirework(x, y) {
  playSoundEffect('pop');
  const colors = ['#ffd700', '#ff65a3', '#8b5cf6', '#38bdf8', '#4ade80', '#f43f5e'];
  const baseColor = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 45; i++) {
    fireworks.push(new FireworkParticle(x, y, baseColor));
  }
}

canvas.addEventListener('click', (e) => {
  let hitEmoji = false;
  for (let i = cuteEmojis.length - 1; i >= 0; i--) {
    if (cuteEmojis[i].isClicked(e.clientX, e.clientY)) {
      hitEmoji = true;
      playSoundEffect('pop');
      confetti({
        particleCount: 16,
        spread: 45,
        origin: { x: e.clientX / width, y: e.clientY / height },
        colors: ['#ff65a3', '#ffd700', '#f7a8b8', '#a855f7']
      });
      cuteEmojis[i].reset(e.clientX, e.clientY);
      break;
    }
  }
  if (!hitEmoji) {
    launchFirework(e.clientX, e.clientY);
  }
});

function animateCanvas() {
  ctx.fillStyle = 'rgba(9, 6, 20, 0.25)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  cuteEmojis.forEach(c => {
    c.update();
    c.draw();
  });

  lanterns.forEach(l => {
    l.update();
    l.draw();
  });

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].alpha <= 0) {
      fireworks.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* -------------------------------------------------------------
   STAGE CONTROLLER & LAPTOP SCROLLING
   ------------------------------------------------------------- */
function switchStage(stageNum) {
  appState.currentStage = stageNum;
  playSoundEffect('pop');

  document.querySelectorAll('.stage-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-pill').forEach(pill => pill.classList.remove('active'));

  const currentSec = document.getElementById(`stage-${stageNum}`);
  if (currentSec) currentSec.classList.add('active');

  const activePill = document.querySelector(`.nav-pill[data-stage="${stageNum}"]`);
  if (activePill) activePill.classList.add('active');

  if (stageNum === 4) {
    setupCandles();
  } else if (stageNum === 5) {
    if (lanterns.length < 8) {
      for (let i = 0; i < 10; i++) {
        lanterns.push(new SkyLantern(Math.random() * width, Math.random() * height));
      }
    }
    launchFirework(width / 2, height / 3);
    setTimeout(() => launchFirework(width / 3, height / 4), 300);
    setTimeout(() => launchFirework((2 * width) / 3, height / 4), 600);
  }
}

document.querySelectorAll('.nav-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    const stage = parseInt(btn.getAttribute('data-stage'));
    switchStage(stage);
  });
});

/* -------------------------------------------------------------
   STAGE 1: COUNTDOWN & GIFT UNBOXING
   ------------------------------------------------------------- */
function updateCountdown() {
  const targetDate = new Date('October 9, 2026 00:00:00').getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  } else {
    document.getElementById('countdown-widget').innerHTML = `
      <div style="color: #ffd700; font-weight: 800; font-size: 1.5rem;">🎉 Happy Birthday Vennela! It's Time! 🎉</div>
    `;
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

const giftBoxTrigger = document.getElementById('gift-box-trigger');
giftBoxTrigger.addEventListener('click', () => {
  giftBoxTrigger.classList.add('open');
  playSoundEffect('chime');
  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  setTimeout(() => switchStage(2), 700);
});

document.getElementById('unlock-now-btn').addEventListener('click', () => switchStage(2));

/* -------------------------------------------------------------
   STAGE 2: GOLDEN KEY & HEART LOCK (TOUCH + CLICK + DRAG FIX)
   ------------------------------------------------------------- */
const autoKeyBtn = document.getElementById('auto-key-btn');
const heartLock = document.getElementById('heart-lock');
const keyDraggable = document.getElementById('key-draggable');

let isUnlocked = false;

function unlockLockMechanism() {
  if (isUnlocked) return;
  isUnlocked = true;

  playSoundEffect('unlock');
  
  // Smoothly insert golden key into keyhole
  keyDraggable.style.transition = 'all 0.5s ease-in-out';
  const lockRect = heartLock.getBoundingClientRect();
  const container = document.querySelector('.lock-mechanism-container');
  const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
  
  keyDraggable.style.position = 'absolute';
  keyDraggable.style.left = `${lockRect.left - containerRect.left + 35}px`;
  keyDraggable.style.top = `${lockRect.top - containerRect.top + 30}px`;
  keyDraggable.style.transform = 'rotate(90deg) scale(0.95)';

  setTimeout(() => {
    heartLock.classList.add('unlocked');
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }, 400);

  setTimeout(() => {
    switchStage(3);
  }, 1100);
}

autoKeyBtn.addEventListener('click', unlockLockMechanism);
heartLock.addEventListener('click', unlockLockMechanism);
keyDraggable.addEventListener('click', unlockLockMechanism);

let isDraggingKey = false;

function handleDragStart(e) {
  if (isUnlocked) return;
  isDraggingKey = true;
  keyDraggable.style.transition = 'none';
}

function handleDragMove(e) {
  if (!isDraggingKey || isUnlocked) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  keyDraggable.style.position = 'fixed';
  keyDraggable.style.left = `${clientX - 30}px`;
  keyDraggable.style.top = `${clientY - 25}px`;

  const lockRect = heartLock.getBoundingClientRect();
  if (
    clientX >= lockRect.left - 40 &&
    clientX <= lockRect.right + 40 &&
    clientY >= lockRect.top - 40 &&
    clientY <= lockRect.bottom + 40
  ) {
    isDraggingKey = false;
    unlockLockMechanism();
  }
}

function handleDragEnd() {
  if (!isDraggingKey) return;
  isDraggingKey = false;
  if (isUnlocked) return;

  const keyRect = keyDraggable.getBoundingClientRect();
  const lockRect = heartLock.getBoundingClientRect();

  const dist = Math.hypot(
    (keyRect.left + keyRect.width / 2) - (lockRect.left + lockRect.width / 2),
    (keyRect.top + keyRect.height / 2) - (lockRect.top + lockRect.height / 2)
  );

  if (dist < 180) {
    unlockLockMechanism();
  } else {
    // Snap key back
    keyDraggable.style.transition = 'all 0.4s ease';
    keyDraggable.style.position = 'absolute';
    keyDraggable.style.left = '';
    keyDraggable.style.top = '';
    keyDraggable.style.right = '0';
    keyDraggable.style.bottom = '20px';
  }
}

keyDraggable.addEventListener('mousedown', handleDragStart);
window.addEventListener('mousemove', handleDragMove);
window.addEventListener('mouseup', handleDragEnd);

keyDraggable.addEventListener('touchstart', handleDragStart, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (isDraggingKey) {
    handleDragMove(e);
  }
}, { passive: true });
window.addEventListener('touchend', handleDragEnd);

/* -------------------------------------------------------------
   STAGE 3: 3D STORYBOOK ENGINE & LAPTOP SCROLLING
   ------------------------------------------------------------- */
function render19Reasons() {
  const grid = document.getElementById('reasons-grid');
  grid.innerHTML = '';

  appState.reasons.forEach((reasonText, idx) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <div class="reason-inner">
        <div class="reason-front">${idx + 1}</div>
        <div class="reason-back">${reasonText}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      playSoundEffect('pop');
    });
    grid.appendChild(card);
  });
}
render19Reasons();

function updateBookPage(pageNum) {
  appState.currentPage = pageNum;
  playSoundEffect('page');

  document.querySelectorAll('.story-page').forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.querySelector(`.story-page[data-page="${pageNum}"]`);
  if (targetPage) targetPage.classList.add('active');

  document.getElementById('page-num-display').textContent = `Page ${pageNum} of 5`;
}

document.getElementById('prev-page-btn').addEventListener('click', () => {
  if (appState.currentPage > 1) {
    updateBookPage(appState.currentPage - 1);
  }
});

document.getElementById('next-page-btn').addEventListener('click', () => {
  if (appState.currentPage < 5) {
    updateBookPage(appState.currentPage + 1);
  } else {
    switchStage(4);
  }
});

document.getElementById('to-cake-btn').addEventListener('click', () => switchStage(4));

let isScrollingPage = false;
const storybookContainer = document.getElementById('storybook');
storybookContainer.addEventListener('wheel', (e) => {
  if (isScrollingPage) return;
  if (e.deltaY > 50 && appState.currentPage < 5) {
    isScrollingPage = true;
    updateBookPage(appState.currentPage + 1);
    setTimeout(() => isScrollingPage = false, 700);
  } else if (e.deltaY < -50 && appState.currentPage > 1) {
    isScrollingPage = true;
    updateBookPage(appState.currentPage - 1);
    setTimeout(() => isScrollingPage = false, 700);
  }
});

/* -------------------------------------------------------------
   PHOTO LIGHTBOX MODAL (FEATURING VENNELA'S REAL PHOTOS)
   ------------------------------------------------------------- */
const photoLightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  photoLightbox.classList.remove('hidden');
  playSoundEffect('pop');
}

document.querySelectorAll('.polaroid-card').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-img');
    const caption = card.getAttribute('data-caption');
    openLightbox(src, caption);
  });
});

document.querySelectorAll('.finale-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    openLightbox(thumb.src, "Vennela • Best Friend Memories ✨");
  });
});

document.getElementById('close-lightbox').addEventListener('click', () => {
  photoLightbox.classList.add('hidden');
});

photoLightbox.addEventListener('click', (e) => {
  if (e.target === photoLightbox) {
    photoLightbox.classList.add('hidden');
  }
});

/* -------------------------------------------------------------
   STAGE 4: VIRTUAL CAKE & CANDLE BLOWING
   ------------------------------------------------------------- */
function setupCandles() {
  const wrapper = document.getElementById('candles-wrapper');
  wrapper.innerHTML = '';
  appState.candlesBlown = false;

  for (let i = 0; i < 5; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.innerHTML = `<div class="flame"></div>`;
    candle.addEventListener('click', () => blowSingleCandle(candle));
    wrapper.appendChild(candle);
  }
}

function blowSingleCandle(candle) {
  if (!candle.classList.contains('extinguished')) {
    candle.classList.add('extinguished');
    playSoundEffect('pop');
    checkAllCandlesBlown();
  }
}

function extinguishAllCandles() {
  const candles = document.querySelectorAll('.candle');
  candles.forEach((c, idx) => {
    setTimeout(() => {
      c.classList.add('extinguished');
      playSoundEffect('pop');
    }, idx * 100);
  });

  setTimeout(() => {
    checkAllCandlesBlown(true);
  }, candles.length * 100 + 200);
}

function checkAllCandlesBlown(forced = false) {
  const candles = document.querySelectorAll('.candle');
  const allExtinguished = Array.from(candles).every(c => c.classList.contains('extinguished'));

  if ((allExtinguished || forced) && !appState.candlesBlown) {
    appState.candlesBlown = true;
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    playSoundEffect('unlock');

    setTimeout(() => {
      switchStage(5);
    }, 1500);
  }
}

document.getElementById('blow-candles-btn').addEventListener('click', extinguishAllCandles);

document.getElementById('enable-mic-btn').addEventListener('click', async () => {
  const micStatus = document.getElementById('mic-status');
  const micFill = document.getElementById('mic-fill');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyzer = ctx.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);

    micStatus.textContent = 'Mic active! Blow now!';

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    function checkBlowIntensity() {
      if (appState.candlesBlown) return;

      analyzer.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const percentage = Math.min(100, (average / 120) * 100);
      micFill.style.width = `${percentage}%`;

      if (average > 65) {
        extinguishAllCandles();
      } else {
        requestAnimationFrame(checkBlowIntensity);
      }
    }
    checkBlowIntensity();
  } catch (err) {
    micStatus.textContent = 'Mic permission denied. Use button!';
  }
});

/* -------------------------------------------------------------
   STAGE 5: SECRET WISH DISPATCH TO SAMPATHIRAOVARAPRASAD8@GMAIL.COM
   ------------------------------------------------------------- */
document.getElementById('release-wish-btn').addEventListener('click', async () => {
  const wishInput = document.getElementById('wish-input');
  const wishText = wishInput.value.trim();

  if (wishText) {
    playSoundEffect('chime');
    const badge = document.getElementById('wish-badge');
    const display = document.getElementById('wish-text-display');

    display.textContent = `"${wishText}"`;
    badge.classList.remove('hidden');

    // Float sky lantern with her wish
    lanterns.push(new SkyLantern(width / 2, height, wishText));

    // 1. Save wish locally in browser localStorage (secret backup)
    const existingWishes = JSON.parse(localStorage.getItem('vennela_wishes') || '[]');
    const wishEntry = {
      wish: wishText,
      timestamp: new Date().toLocaleString(),
      user: 'Vennela'
    };
    existingWishes.push(wishEntry);
    localStorage.setItem('vennela_wishes', JSON.stringify(existingWishes));

    // 2. SILENT EMAIL DISPATCH to sampathiraovaraprasad8@gmail.com
    // Vennela will NEVER see this email or any notification about it!
    const formToken = '61e91c10583776426466ec005d2f5870'; // Direct FormSubmit token for sampathiraovaraprasad8@gmail.com
    const targetEmail = 'sampathiraovaraprasad8@gmail.com';
    
    try {
      // Primary dispatch via FormSubmit token (No activation required!)
      fetch(`https://formsubmit.co/ajax/${formToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: "💌 Vennela's 19th Birthday Secret Wish!",
          name: "Vennela Birthday Magic App",
          message: `🎉 VENNELA JUST MADE A 19TH BIRTHDAY WISH:\n\n"${wishText}"\n\nDate & Time: ${new Date().toLocaleString()}\n\n(Keep this a secret as requested! 🤫)`
        })
      }).catch(() => {});

      // Backup dispatch directly to email address
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(targetEmail), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: "💌 Vennela's 19th Birthday Secret Wish!",
          message: `🎉 VENNELA'S WISH:\n\n"${wishText}"\n\nDate: ${new Date().toLocaleString()}`
        })
      }).catch(() => {});

      if (navigator.sendBeacon) {
        const formData = new FormData();
        formData.append('_subject', "💌 Vennela Secret Wish");
        formData.append('wish', wishText);
        formData.append('time', new Date().toLocaleString());
        navigator.sendBeacon(`https://formsubmit.co/ajax/${formToken}`, formData);
      }
    } catch(e) {}

    // Celebratory fireworks, cutie emoji burst & confetti
    launchFirework(width / 2, height / 3);
    spawnExtraCuties(12);
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 } });

    wishInput.value = '';
  }
});

// Cutie Emojis Header Button
const cutiesBtn = document.getElementById('spawn-cuties-btn');
if (cutiesBtn) {
  cutiesBtn.addEventListener('click', () => {
    spawnExtraCuties(25);
  });
}

document.getElementById('restart-tour-btn').addEventListener('click', () => switchStage(1));
document.getElementById('music-toggle').addEventListener('click', toggleBackgroundMusic);

// Secret shortcut key: Press Ctrl + Shift + W to view secret wishes on device
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'w') {
    const wishes = JSON.parse(localStorage.getItem('vennela_wishes') || '[]');
    if (wishes.length === 0) {
      alert("💌 No secret wishes submitted yet!");
    } else {
      const formatted = wishes.map((w, i) => `${i + 1}. [${w.timestamp}] "${w.wish}"`).join('\n\n');
      alert(`💌 VENNELA'S SECRET WISHES:\n\n${formatted}`);
    }
  }
});
