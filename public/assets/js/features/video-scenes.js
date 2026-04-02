export function initVideoScenes() {
  const sceneTargets = document.querySelectorAll('#hero[data-scene], section[data-scene]');
  const bgVideos = document.querySelectorAll('.bg-video');
  const videoOverlay = document.querySelector('.video-overlay');

  if (!sceneTargets.length || !bgVideos.length) return;

  function setScene(sceneName) {
    document.body.classList.remove('scene-core', 'scene-desk', 'scene-pixel');
    document.body.classList.add(`scene-${sceneName}`);

    bgVideos.forEach((video) => {
      const isActive = video.dataset.scene === sceneName;
      video.classList.toggle('active', isActive);

      if (isActive) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
    });

    if (videoOverlay) {
      videoOverlay.style.opacity = sceneName === 'desk' ? '0.9' : sceneName === 'pixel' ? '0.82' : '1';
    }
  }

  const sceneObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setScene(entry.target.dataset.scene);
        }
      });
    },
    { threshold: 0.45 },
  );

  sceneTargets.forEach((target) => sceneObserver.observe(target));
  setScene(document.querySelector('#hero')?.dataset.scene || 'core');
}
