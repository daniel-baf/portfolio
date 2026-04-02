export function initScrollReveal() {
  const revealTargets = document.querySelectorAll('.fade-up, .timeline-item');
  if (!revealTargets.length) return;

  revealTargets.forEach((element) => {
    element.classList.add('animate-hidden');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('animate-hidden');
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}
