const THEME_COLORS = {
  'terminal-orange': { primary: '#FF851B', accent: '#FDAF00' },
  'terminal-red': { primary: '#FF4136', accent: '#FF6B6B' },
  'terminal-green': { primary: '#00FF41', accent: '#00E639' },
  'terminal-classic': { primary: '#00FF41', accent: '#FFFFFF' },
};

function getStoredTheme() {
  try {
    return localStorage.getItem('terminal-theme');
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('terminal-theme', theme);
  } catch {
    // Ignore storage failures on restricted origins.
  }
}

export function initThemeSystem() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const html = document.documentElement;

  window.binaryRainColors = THEME_COLORS['terminal-orange'];

  function applyTerminalTheme(themeName) {
    html.dataset.theme = themeName;
    storeTheme(themeName);

    themeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });

    window.binaryRainColors = THEME_COLORS[themeName] || THEME_COLORS['terminal-orange'];
    console.log(`[TERMINAL] Theme switched to: ${themeName}`);
  }

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyTerminalTheme(btn.dataset.theme));
  });

  const storedTheme = getStoredTheme() || 'terminal-orange';
  applyTerminalTheme(storedTheme);

  return { html };
}
