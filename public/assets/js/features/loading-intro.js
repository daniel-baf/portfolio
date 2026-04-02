export function initLoadingIntro(prefersReducedMotion) {
  const loadingIntro = document.getElementById('loadingIntro');
  if (!loadingIntro) return;

  const introDuration = prefersReducedMotion ? 220 : 2000;
  const outroDuration = 640;

  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  setTimeout(() => {
    document.body.classList.add('intro-complete');
    document.body.style.overflow = '';

    setTimeout(() => {
      loadingIntro.remove();
    }, outroDuration);
  }, introDuration);
}
