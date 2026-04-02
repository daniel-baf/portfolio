function createVirusParticles(card) {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'virus-particles';
  particlesContainer.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    overflow: hidden;
  `;
  card.appendChild(particlesContainer);

  for (let i = 0; i < 15; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'virus-particle';
    particle.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background: var(--primary);
      box-shadow: 0 0 6px var(--primary);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: virus-float ${Math.random() * 1 + 0.5}s infinite alternate;
      animation-delay: ${Math.random() * 0.5}s;
      border-radius: 0px;
    `;
    particlesContainer.appendChild(particle);
  }
}

export function initProjectParticles() {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes virus-float {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.8;
      }
      100% {
        transform: translate(${ -10 + Math.random() * 20 }px, ${ -10 + Math.random() * 20 }px) scale(1.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  projectCards.forEach((card) => {
    createVirusParticles(card);

    card.addEventListener('mouseenter', () => {
      const particles = card.querySelector('.virus-particles');
      if (particles) particles.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      const particles = card.querySelector('.virus-particles');
      if (particles) particles.style.opacity = '0';
    });
  });
}
