import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll suave con inercia. Suaviza la rueda/trackpad (que se sentia brusco)
// y mantiene ScrollTrigger sincronizado con el scroll real.
export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({
    lerp: 0.08, // mas bajo = mas suave / mas "peso"
    wheelMultiplier: 0.8, // baja la sensibilidad del trackpad/rueda
    smoothWheel: true,
    syncTouch: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
