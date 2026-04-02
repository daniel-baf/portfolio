export function initAvatarFlip(prefersReducedMotion) {
  if (prefersReducedMotion) return;

  const avatarFrames = document.querySelectorAll('.hero-avatar-frame, .about-avatar-flip');
  if (!avatarFrames.length) return;

  const avatarVisibleMs = 2000;
  const avatarHiddenMs = 9000;
  const avatarFlipDurationMs = 1200;

  avatarFrames.forEach((frame) => {
    let cycleTimeout = null;

    frame.style.transitionDuration = `${avatarFlipDurationMs}ms`;

    const runCycle = () => {
      frame.style.transform = 'rotateY(0deg)';

      cycleTimeout = setTimeout(() => {
        if (!frame.matches(':hover')) {
          frame.style.transform = 'rotateY(180deg)';
        }

        cycleTimeout = setTimeout(runCycle, avatarHiddenMs);
      }, avatarVisibleMs);
    };

    runCycle();

    frame.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!frame.matches(':hover')) {
          frame.style.transform = 'rotateY(0deg)';

          if (cycleTimeout) {
            clearTimeout(cycleTimeout);
          }

          cycleTimeout = setTimeout(runCycle, avatarVisibleMs);
        }
      }, 600);
    });
  });
}
