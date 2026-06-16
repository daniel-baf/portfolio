import { prefersReducedMotion } from './core/runtime.js';
import { initThemeSystem } from './features/theme-system.js';
import { initActiveNav } from './features/active-nav.js';
import { initScrollReveal } from './features/scroll-reveal.js';
import { initSkillBars } from './features/skill-bars.js';
import { initSkillPopup } from './features/skill-popup.js';
import { initTypewriter } from './features/typewriter.js';
import { initTerminalWriter } from './features/terminal-writer.js';
import { initNavbarScroll } from './features/navbar-scroll.js';

export function initCv() {
  const { html } = initThemeSystem();
  initNavbarScroll();
  initTypewriter();
  initTerminalWriter(prefersReducedMotion);
  initSkillPopup();
  initActiveNav();
  initScrollReveal();
  initSkillBars();

  const printBtn = document.getElementById('cta-print-cv');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  console.log('[CV MODE] Static document ready. Theme:', html.dataset.theme);
}
