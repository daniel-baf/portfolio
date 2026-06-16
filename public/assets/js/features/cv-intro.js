/*
  Entrada del CV cuando se llega desde la presentacion ("VER CV").
  Continua la transicion: la pantalla arranca en el estado "consumido"
  (base oscura + nucleo rojo), el nucleo colapsa, un barrido rojo
  "renderiza" la UI y el documento entra desde abajo.
  Solo se reproduce si existe la bandera de sessionStorage; navegacion
  directa a /cv no dispara nada.
*/
export function initCvIntro() {
  let flagged = false;
  try {
    flagged = sessionStorage.getItem('cv-intro') === '1';
    sessionStorage.removeItem('cv-intro');
  } catch {
    flagged = false;
  }
  if (!flagged) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const overlay = document.createElement('div');
  overlay.className = 'fx-reveal';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="fx-reveal__core"></div><div class="fx-reveal__scan"></div>';
  document.body.appendChild(overlay);

  const core = overlay.querySelector('.fx-reveal__core');
  const scan = overlay.querySelector('.fx-reveal__scan');
  const doc = document.getElementById('cv-document');
  const footer = document.querySelector('footer');
  const targets = [doc, footer].filter(Boolean);
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

  targets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
  });

  // 1. El nucleo rojo remanente colapsa hacia un punto.
  core.animate(
    [
      { transform: 'scale(1)', opacity: 0.9 },
      { transform: 'scale(0)', opacity: 0 },
    ],
    { duration: 520, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' },
  );

  // 2. Barrido rojo que "renderiza" de arriba a abajo.
  scan.animate(
    [
      { transform: 'translateY(-110%)', opacity: 0 },
      { transform: 'translateY(0%)', opacity: 1, offset: 0.25 },
      { transform: 'translateY(110%)', opacity: 0 },
    ],
    { duration: 720, delay: 120, easing: 'ease-in-out', fill: 'forwards' },
  );

  // 3. La capa se disuelve y revela el documento.
  const fade = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 480,
    delay: 440,
    easing: 'ease-out',
    fill: 'forwards',
  });

  // 4. El contenido entra desde abajo.
  targets.forEach((el, i) => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(26px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 660, delay: 500 + i * 90, easing: ease, fill: 'forwards' },
    );
  });

  const cleanup = () => {
    overlay.remove();
    targets.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
  };
  fade.finished.then(cleanup).catch(cleanup);
}
