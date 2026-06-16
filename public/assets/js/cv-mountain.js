/*
  Montaña esquemática del CV — movimiento scroll-driven.
  Lee el progreso de scroll (0..1) y, vía requestAnimationFrame:
    · zoom + paneo del macizo completo (se mueve de un lado a otro)
    · fractura: cada faceta se separa de su centroide como "roca"
  Todo es función del progreso → reversible al subir. Respeta
  prefers-reduced-motion (queda estático centrado).
*/
(() => {
  const root = document.querySelector('[data-cv-mountain]');
  if (!root) return;

  const range = root.querySelector('[data-cv-range]');
  const facets = Array.from(root.querySelectorAll('[data-cv-facet]'));
  if (!range || facets.length === 0) return;

  const VIEW_CENTER = { x: 600, y: 360 };

  // Precalcula centroide + dirección de deriva de cada faceta.
  const facetData = facets.map((el) => {
    const pts = el
      .getAttribute('points')
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(',').map(Number));
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    let dx = cx - VIEW_CENTER.x;
    let dy = cy - VIEW_CENTER.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    // Rotación pseudo-aleatoria pero determinista por posición.
    const spin = ((cx * 13 + cy * 7) % 40) - 20;
    return { el, cx, cy, dx, dy, spin };
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  let target = 0;
  let current = 0;
  let ticking = false;

  function readProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    requestTick();
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  function render() {
    // Easing hacia el objetivo para un movimiento con inercia suave.
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) current = target;

    const p = reduce ? 0 : current;

    // Macizo completo: zoom progresivo + paneo lateral (de izq. a der.).
    const scale = 1 + p * 0.55;
    const panX = -60 + p * 200;
    const panY = p * 90;
    range.setAttribute(
      'transform',
      `translate(${panX} ${panY}) translate(${VIEW_CENTER.x} ${VIEW_CENTER.y}) scale(${scale}) translate(${-VIEW_CENTER.x} ${-VIEW_CENTER.y})`,
    );

    // Fractura en rocas: arranca a mitad de scroll, total cerca del final.
    const split = smooth(0.35, 0.92, p);
    const burst = 260 * split;

    for (let i = 0; i < facetData.length; i += 1) {
      const f = facetData[i];
      const tx = f.dx * burst;
      const ty = f.dy * burst * 0.7 + split * 40; // leve "gravedad"
      const rot = f.spin * split;
      f.el.setAttribute('transform', `translate(${tx} ${ty}) rotate(${rot} ${f.cx} ${f.cy})`);
    }

    // La montaña se desvanece un poco al fracturarse del todo.
    root.style.setProperty('--cv-mountain-fade', String(1 - split * 0.35));

    if (Math.abs(target - current) > 0.0005) {
      requestAnimationFrame(render);
    } else {
      ticking = false;
    }
  }

  window.addEventListener('scroll', readProgress, { passive: true });
  window.addEventListener('resize', readProgress);
  readProgress();
})();
