/*
  Transicion de salida presentacion → CV.
  Al pulsar cualquier enlace "VER CV" (el del HUD #cta-view-cv o el CTA
  central #beatCta del ultimo beat) el mundo 3D se "consume": implosiona
  hacia el centro mientras un nucleo rojo florece y estalla, dejando la
  pantalla en el color base. Luego navega a /cv, donde init-cv reproduce
  la entrada.

  Implementado con animaciones CSS puras (sin GSAP) para máxima fiabilidad.
*/

const FLAG = 'cv-intro';
const DURATION = 1000; // ms — debe coincidir con las @keyframes en presentation.css
const CV_LINK_IDS = ['cta-view-cv', 'beatCta'];

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'fx-consume';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="fx-consume__core"></div>';
  document.body.appendChild(overlay);
}

export function initWorldConsume() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let consuming = false;

  // Listener delegado en captura: intercepta el click antes que cualquier
  // otro handler, sin depender de que los enlaces existan al iniciar.
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element | null;
      const link = target?.closest?.('a');
      if (!link || !CV_LINK_IDS.includes(link.id)) return;

      const href = link.getAttribute('href') || '/cv';
      event.preventDefault();
      if (consuming) return;
      consuming = true;

      try {
        sessionStorage.setItem(FLAG, '1');
      } catch {
        /* sessionStorage no disponible: la entrada del CV simplemente no se reproduce */
      }

      if (reduce) {
        window.location.href = href;
        return;
      }

      buildOverlay();
      document.body.classList.add('is-consuming');
      window.setTimeout(() => {
        window.location.href = href;
      }, DURATION);
    },
    true,
  );
}
