export function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    navbar.style.borderBottomColor = window.scrollY > 50 ? `${primaryColor}88` : 'var(--border)';
  });
}
