export function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach((bar) => {
            bar.style.width = `${bar.dataset.level}%`;
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillObserver.observe(skillsSection);
}
