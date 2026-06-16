// Experiencia de un solo tema curado (sunset). Sin selector ni persistencia:
// el tema vive fijo en el atributo data-theme del <html> (ver BaseLayout).
const THEME = 'terminal-sunset';
const THEME_COLORS = { primary: '#ff704b', accent: '#ffd284' };

export function initThemeSystem() {
  const html = document.documentElement;
  html.dataset.theme = THEME;
  window.binaryRainColors = THEME_COLORS;
  return { html };
}
