import gsap from 'gsap';
import type { PresentationBeat } from '../data/presentation';
import type { JourneyHighlight } from '../data/journey';

export interface TypographyController {
  setBeat: (beat: PresentationBeat, index: number, total: number) => void;
  setProgressLabel: (progress: number) => void;
}

// Posiciones predefinidas (en % del stage) donde van apareciendo las burbujas,
// alternando lados para que rodeen el titulo sin taparlo.
const BUBBLE_SLOTS = [
  { left: '12%', top: '24%' },
  { left: '70%', top: '30%' },
  { left: '8%', top: '62%' },
  { left: '74%', top: '66%' },
  { left: '20%', top: '82%' },
];

export function initTypographyDriver(beats: PresentationBeat[]): TypographyController {
  const primaryEl = document.getElementById('beatPrimary');
  const secondaryEl = document.getElementById('beatSecondary');
  const labelEl = document.getElementById('beatLabel');
  const ctaEl = document.getElementById('beatCta') as HTMLAnchorElement | null;
  const contactBtnEl = document.getElementById('beatContact');
  const progressEl = document.getElementById('presentationProgress');
  const bubblesEl = document.getElementById('achievementBubbles');

  let currentIndex = -1;

  function renderBubbles(highlights: JourneyHighlight[] = []) {
    if (!bubblesEl) return;

    // Saca las burbujas actuales y luego limpia
    const previous = Array.from(bubblesEl.children) as HTMLElement[];
    if (previous.length) {
      gsap.to(previous, {
        opacity: 0,
        y: -12,
        duration: 0.3,
        stagger: 0.04,
        onComplete: () => previous.forEach((node) => node.remove()),
      });
    }

    if (!highlights.length) return;

    const fresh: HTMLElement[] = [];
    highlights.slice(0, BUBBLE_SLOTS.length).forEach((highlight, i) => {
      const slot = BUBBLE_SLOTS[i];
      const bubble = document.createElement('div');
      bubble.className = 'achievement-bubble';
      bubble.style.left = slot.left;
      bubble.style.top = slot.top;
      bubble.innerHTML = `<span class="achievement-bubble__tag">${highlight.tag}</span><span class="achievement-bubble__text">${highlight.text}</span>`;
      bubblesEl.appendChild(bubble);
      fresh.push(bubble);
    });

    gsap.fromTo(
      fresh,
      { opacity: 0, y: 22, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.2,
      },
    );

    // Flotacion suave continua
    fresh.forEach((node, i) => {
      gsap.to(node, {
        y: '+=8',
        duration: 2.4 + (i % 3) * 0.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.6 + i * 0.1,
      });
    });
  }

  function setBeat(beat: PresentationBeat, index: number, total: number) {
    if (!primaryEl || !secondaryEl || !labelEl) return;
    if (index === currentIndex) return;
    currentIndex = index;

    labelEl.textContent = `// beat.${beat.id}`;
    primaryEl.textContent = beat.primary;
    secondaryEl.textContent = beat.secondary;

    renderBubbles(beat.highlights);

    if (progressEl) progressEl.textContent = `${index + 1}/${total}`;

    if (ctaEl) {
      if (beat.cta) {
        ctaEl.hidden = false;
        ctaEl.textContent = beat.cta.label;
        ctaEl.href = beat.cta.href;
      } else {
        ctaEl.hidden = true;
      }
    }

    // El boton de contacto acompaña al CTA final (mismo beat con cta).
    if (contactBtnEl) contactBtnEl.hidden = !beat.cta;
  }

  function setProgressLabel(progress: number) {
    if (!progressEl) return;
    const pct = Math.round(progress * 100);
    progressEl.setAttribute('title', `Scroll ${pct}%`);
  }

  if (beats.length > 0) {
    setBeat(beats[0], 0, beats.length);
  }

  return { setBeat, setProgressLabel };
}
