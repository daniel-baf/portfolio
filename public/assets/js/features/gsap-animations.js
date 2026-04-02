export function initGsapAnimations(prefersReducedMotion) {
  if (prefersReducedMotion || !window.gsap) return;

  window.gsap
    .timeline()
    .from('#hero .hero-tag', { opacity: 0, y: -18, duration: 0.5, delay: 0.2 })
    .from('#hero .hero-avatar-frame', { opacity: 0, scale: 0.82, duration: 0.65, ease: 'power3.out' }, '-=0.1')
    .from('#hero .hero-name', { opacity: 0, y: 22, duration: 0.55 }, '-=0.35')
    .from('#hero .hero-title', { opacity: 0, y: 16, duration: 0.5 }, '-=0.25')
    .from('#hero .hero-summary', { opacity: 0, y: 16, duration: 0.5 }, '-=0.25')
    .from('#hero .metric', { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 }, '-=0.2')
    .from('#hero .hero-cta', { opacity: 0, y: 16, duration: 0.45 }, '-=0.15')
    .from('#hero .hero-terminal', { opacity: 0, x: 28, duration: 0.7 }, '-=0.65')
    .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.15');

  window.gsap.utils.toArray('.section-title').forEach((title) => {
    window.gsap.from(title, {
      opacity: 0,
      x: -30,
      duration: 0.7,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  window.gsap.from('.project-card', {
    opacity: 0,
    y: 40,
    stagger: 0.12,
    duration: 0.6,
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  window.gsap.from('.hobby-card', {
    opacity: 0,
    scale: 0.82,
    stagger: 0.08,
    duration: 0.45,
    immediateRender: false,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#hobbies',
      start: 'top 75%',
      once: true,
    },
  });

  window.gsap.from('.contact-box', {
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
    },
  });

  window.gsap.to('.video-stage', {
    yPercent: -6,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });
}
