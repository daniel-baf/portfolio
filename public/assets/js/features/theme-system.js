// Experiencia de un solo tema curado (mando). Sin selector ni persistencia:
// el tema vive fijo en el atributo data-theme del <html> (ver BaseLayout).
const THEME = 'terminal-mando';
const THEME_COLORS = { primary: '#E62815', accent: '#8B4944' };

export function initThemeSystem() {
  const html = document.documentElement;
  html.dataset.theme = THEME;
  window.binaryRainColors = THEME_COLORS;
  return { html };
}
