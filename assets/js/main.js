/* ============================================================
   DANIEL BAUTISTA - PORTFOLIO JS
   GSAP ScrollTrigger + Binary Rain Canvas + TypeWriter
   ============================================================ */

// ── GSAP SETUP ──────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (error) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // Ignore storage failures on restricted origins.
  }
}

// ── BINARY RAIN CANVAS ───────────────────────────────────────
(function initBinaryRain() {
  const canvas = document.getElementById('binaryCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, cols, drops;
  const chars = '01アイウエオカキクケコ10';
  const fontSize = 14;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / fontSize);
    drops = new Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10,10,15,0.05)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#00ffcc';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = i % 5 === 0 ? '#ff00aa' : '#00ffcc';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

// ── TYPEWRITER ───────────────────────────────────────────────
(function typeWriter() {
  const el    = document.getElementById('typed-text');
  const texts = [
    'Backend Developer',
    'Cloud Infrastructure Engineer',
    'GCP Specialization Track',
    'Freelance Software Builder',
    'Systems Engineering Student',
  ];
  let i = 0, j = 0, isDeleting = false;

  function tick() {
    const current = texts[i];
    if (isDeleting) {
      el.textContent = current.slice(0, --j);
    } else {
      el.textContent = current.slice(0, ++j);
    }

    let delay = isDeleting ? 40 : 90;

    if (!isDeleting && j === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && j === 0) {
      isDeleting = false;
      i = (i + 1) % texts.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
})();

// ── THEME TOGGLE ─────────────────────────────────────────────
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.dataset.theme = theme;
  storeTheme(theme);
  syncThemeButton();
}

function syncThemeButton() {
  const isLight = html.dataset.theme === 'light';
  themeBtn.textContent = isLight ? 'dark' : 'light';
  themeBtn.setAttribute('aria-label', isLight ? 'Activar tema oscuro' : 'Activar tema claro');
}

themeBtn.addEventListener('click', () => {
  const isLight = html.dataset.theme === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

applyTheme(getStoredTheme() || html.dataset.theme || 'dark');

// ── NAVBAR SCROLL EFFECT ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 50
    ? 'rgba(90,242,255,0.42)'
    : 'var(--border)';
});

// ── VIDEO SCENES ──────────────────────────────────────────────
const sceneTargets = document.querySelectorAll('#hero[data-scene], section[data-scene]');
const bgVideos = document.querySelectorAll('.bg-video');
const videoOverlay = document.querySelector('.video-overlay');

function setScene(sceneName) {
  document.body.classList.remove('scene-core', 'scene-desk', 'scene-pixel');
  document.body.classList.add(`scene-${sceneName}`);

  bgVideos.forEach((video) => {
    const isActive = video.dataset.scene === sceneName;
    video.classList.toggle('active', isActive);

    if (isActive) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
    }
  });

  if (videoOverlay) {
    videoOverlay.style.opacity = sceneName === 'desk' ? '0.9' : sceneName === 'pixel' ? '0.82' : '1';
  }
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setScene(entry.target.dataset.scene);
    }
  });
}, { threshold: 0.45 });

sceneTargets.forEach((target) => sceneObserver.observe(target));
setScene(document.querySelector('#hero')?.dataset.scene || 'core');

// ── HERO TERMINAL ─────────────────────────────────────────────
(function terminalWriter() {
  const lines = [
    ['terminal-line-0', '$ init profile --mode portfolio'],
    ['terminal-line-1', 'loading identity... ok'],
    ['terminal-line-2', 'loading work_history... ok'],
    ['terminal-line-3', 'experience = 2_years_professional'],
    ['terminal-line-4', 'specializing_in = gcp'],
    ['terminal-line-5', 'current_focus = backend + automation + cloud'],
  ];

  function typeLine(element, text, delay) {
    let index = 0;
    const tick = () => {
      element.textContent = text.slice(0, index);
      if (index < text.length) {
        index += 1;
        setTimeout(tick, delay);
      } else {
        element.insertAdjacentHTML('beforeend', '<span class="typing-cursor">_</span>');
      }
    };

    tick();
  }

  let initialDelay = 250;
  lines.forEach(([id, text], lineIndex) => {
    const element = document.getElementById(id);
    if (!element) return;

    if (prefersReducedMotion) {
      element.textContent = text;
      return;
    }

    setTimeout(() => typeLine(element, text, 22), initialDelay);
    initialDelay += (text.length * 22) + (lineIndex === lines.length - 1 ? 0 : 260);
  });
})();

// ── ABOUT AVATAR TILT ─────────────────────────────────────────
const aboutAvatarCard = document.getElementById('aboutAvatarCard');

if (aboutAvatarCard && !prefersReducedMotion) {
  aboutAvatarCard.addEventListener('mousemove', (event) => {
    const rect = aboutAvatarCard.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;
    const rotateY = (offsetX - 0.5) * 12;
    const rotateX = (0.5 - offsetY) * 10;

    aboutAvatarCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });

  aboutAvatarCard.addEventListener('mouseleave', () => {
    aboutAvatarCard.style.transform = '';
  });
}

// ── ABOUT TAG POPUPS ──────────────────────────────────────────
const skillNotes = {
  Python: 'He trabajado con Python en herramientas tecnicas y utilidades, incluyendo calculo estructural, logica aplicada y automatizacion.',
  Java: 'Java ha sido parte fuerte de mi formacion y practica, con proyectos academicos, ejercicios de logica y aplicaciones orientadas a objetos.',
  TypeScript: 'Lo he usado para construir interfaces y logica tipada en proyectos web, especialmente cuando necesito mantener estructura y claridad.',
  Docker: 'Lo uso para entornos reproducibles, despliegues y flujos de trabajo mas consistentes entre desarrollo e infraestructura.',
  'CI/CD': 'Me interesa automatizar integracion, despliegue y tareas repetitivas para reducir friccion y mejorar velocidad de entrega.',
  GCP: 'Actualmente estoy profundizando en GCP para fortalecer mi perfil en infraestructura, despliegue y arquitectura cloud.',
  'REST APIs': 'He trabajado construyendo e integrando APIs para sistemas empresariales y modulos backend con reglas de negocio.',
  SQL: 'He trabajado con bases de datos relacionales para sistemas empresariales, consultas, estructuras y soporte a logica backend.',
  Angular: 'Lo he utilizado en proyectos como compiladores web e interfaces con una estructura modular y flujo tecnico mas claro.',
  Assembly: 'Forma parte de mi base tecnica desde la universidad, especialmente en arquitectura del computador y comprension de bajo nivel.',
  Linux: 'Es parte de mi entorno de trabajo diario para desarrollo, automatizacion y tareas de operacion tecnica.',
  Git: 'Lo uso de forma continua para versionado, trabajo iterativo y colaboracion ordenada sobre proyectos personales y profesionales.',
};

const skillPopup = document.getElementById('skillPopup');
const skillPopupTitle = skillPopup?.querySelector('.skill-popup-title');
const skillPopupCopy = skillPopup?.querySelector('.skill-popup-copy');
const skillButtons = document.querySelectorAll('.tag-button');

function showSkillPopup(button) {
  if (!skillPopup || !skillPopupTitle || !skillPopupCopy) return;

  const skill = button.dataset.skill;
  skillPopupTitle.textContent = skill;
  skillPopupCopy.textContent = skillNotes[skill] || 'Experiencia construyendo herramientas, logica de negocio y soluciones tecnicas alrededor de esta tecnologia.';
  skillPopup.hidden = false;
  skillPopup.classList.add('is-visible');
}

function hideSkillPopup() {
  if (!skillPopup) return;
  skillPopup.classList.remove('is-visible');
  skillPopup.hidden = true;
}

skillButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => showSkillPopup(button));
  button.addEventListener('focus', () => showSkillPopup(button));
});

const aboutTags = document.querySelector('.about-tags');
aboutTags?.addEventListener('mouseleave', hideSkillPopup);
aboutTags?.addEventListener('focusout', (event) => {
  if (!aboutTags.contains(event.relatedTarget)) hideSkillPopup();
});

// ── ACTIVE NAV LINK ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

// ── SCROLL REVEAL ─────────────────────────────────────────────
// Add animate-hidden class only if JS is running (progressive enhancement)
document.querySelectorAll('.fade-up, .timeline-item').forEach(el => {
  el.classList.add('animate-hidden');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('animate-hidden');
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .timeline-item').forEach(el => revealObserver.observe(el));

// ── SKILL BARS ────────────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ── GSAP HERO ENTRANCE ────────────────────────────────────────
if (!prefersReducedMotion) {
  gsap.timeline()
    .from('#hero .hero-tag', { opacity: 0, y: -18, duration: 0.5, delay: 0.2 })
    .from('#hero .hero-avatar-frame', { opacity: 0, scale: 0.82, duration: 0.65, ease: 'power3.out' }, '-=0.1')
    .from('#hero .hero-name', { opacity: 0, y: 22, duration: 0.55 }, '-=0.35')
    .from('#hero .hero-title', { opacity: 0, y: 16, duration: 0.5 }, '-=0.25')
    .from('#hero .hero-summary', { opacity: 0, y: 16, duration: 0.5 }, '-=0.25')
    .from('#hero .metric', { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 }, '-=0.2')
    .from('#hero .hero-cta', { opacity: 0, y: 16, duration: 0.45 }, '-=0.15')
    .from('#hero .hero-terminal', { opacity: 0, x: 28, duration: 0.7 }, '-=0.65')
    .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.15');
}

// ── GSAP SECTION TITLES ───────────────────────────────────────
if (!prefersReducedMotion) {
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      x: -30,
      duration: 0.7,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

// ── GSAP PROJECTS STAGGER ─────────────────────────────────────
if (!prefersReducedMotion) {
  gsap.from('.project-card', {
    opacity: 0,
    y: 40,
    stagger: 0.12,
    duration: 0.6,
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });
}

// ── GSAP HOBBY CARDS STAGGER ──────────────────────────────────
if (!prefersReducedMotion) {
  gsap.from('.hobby-card', {
    opacity: 0,
    scale: 0.82,
    stagger: 0.08,
    duration: 0.45,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#hobbies',
      start: 'top 75%',
    }
  });
}

// ── GSAP CONTACT BOX ──────────────────────────────────────────
if (!prefersReducedMotion) {
  gsap.from('.contact-box', {
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
    }
  });

  gsap.to('.video-stage', {
    yPercent: -6,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    }
  });
}
