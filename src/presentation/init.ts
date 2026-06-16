import { presentationBeats, presentationMeta } from '../data/presentation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initInputController } from './input-controller';
import { initHelpPanel, initMuteToggle, initQualitySettings } from './quality-settings';
import { initScrollTimeline } from './scroll-timeline';
import { initSmoothScroll } from './smooth-scroll';
import { initThreeScene } from './three-scene';
import { initTypographyDriver } from './typography-driver';
import { initWorldConsume } from './world-consume';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hideLoading() {
  const loading = document.getElementById('presentationLoading');
  if (!loading) return;
  loading.setAttribute('aria-hidden', 'true');
  loading.classList.add('presentation-loading--done');
}

function showWebGLFallback() {
  const fallback = document.getElementById('presentationFallback');
  const canvas = document.getElementById('webgl-canvas');
  if (fallback) fallback.hidden = false;
  if (canvas) canvas.hidden = true;
  hideLoading();
}

function watchThemeColor(scene: ReturnType<typeof initThreeScene>) {
  const observer = new MutationObserver(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (color) scene?.setThemeColor(color);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

export function initPresentation() {
  initWorldConsume();

  if (prefersReducedMotion) {
    window.location.replace('/cv');
    return;
  }

  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const typography = initTypographyDriver(presentationBeats);
  const lenis = initSmoothScroll();

  const quality = initQualitySettings();
  const scene = initThreeScene(canvas, quality.getSettings());

  if (!scene) {
    showWebGLFallback();
    const timeline = initScrollTimeline({
      beats: presentationBeats,
      typography,
      onProgress: () => {},
    });
    initInputController({ timeline, beats: presentationBeats, lenis });
    initHelpPanel(presentationMeta.helpCopy);
    initMuteToggle();
    hideLoading();
    return;
  }

  quality.setScene(scene);
  quality.applyToScene();
  watchThemeColor(scene);

  const timeline = initScrollTimeline({
    beats: presentationBeats,
    typography,
    onProgress: (progress) => {
      scene.update(progress);
    },
  });

  initInputController({ timeline, beats: presentationBeats, lenis });
  initMuteToggle();
  initHelpPanel(presentationMeta.helpCopy);
  hideLoading();

  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  console.log('[PRESENTATION] Scroll + WebGL initialized');
}
