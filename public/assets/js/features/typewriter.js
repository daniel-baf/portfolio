export function initTypewriter() {
  const element = document.getElementById('typed-text');
  if (!element) return;

  const texts = [
    'Backend Developer',
    'Cloud Infrastructure Engineer',
    'GCP Specialization Track',
    'Freelance Software Builder',
    'Systems Engineering Student',
  ];

  let currentTextIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = texts[currentTextIndex];
    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    element.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}
