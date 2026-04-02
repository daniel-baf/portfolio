const skillNotes = {
  Python:
    'He trabajado con Python en herramientas tecnicas y utilidades, incluyendo calculo estructural, logica aplicada y automatizacion.',
  Java:
    'Java ha sido parte fuerte de mi formacion y practica, con proyectos academicos, ejercicios de logica y aplicaciones orientadas a objetos.',
  TypeScript:
    'Lo he usado para construir interfaces y logica tipada en proyectos web, especialmente cuando necesito mantener estructura y claridad.',
  Docker:
    'Lo uso para entornos reproducibles, despliegues y flujos de trabajo mas consistentes entre desarrollo e infraestructura.',
  'CI/CD':
    'Me interesa automatizar integracion, despliegue y tareas repetitivas para reducir friccion y mejorar velocidad de entrega.',
  GCP:
    'Actualmente estoy profundizando en GCP para fortalecer mi perfil en infraestructura, despliegue y arquitectura cloud.',
  'REST APIs':
    'He trabajado construyendo e integrando APIs para sistemas empresariales y modulos backend con reglas de negocio.',
  SQL: 'He trabajado con bases de datos relacionales para sistemas empresariales, consultas, estructuras y soporte a logica backend.',
  Angular:
    'Lo he utilizado en proyectos como compiladores web e interfaces con una estructura modular y flujo tecnico mas claro.',
  Assembly:
    'Forma parte de mi base tecnica desde la universidad, especialmente en arquitectura del computador y comprension de bajo nivel.',
  Linux: 'Es parte de mi entorno de trabajo diario para desarrollo, automatizacion y tareas de operacion tecnica.',
  Git: 'Lo uso de forma continua para versionado, trabajo iterativo y colaboracion ordenada sobre proyectos personales y profesionales.',
};

export function initSkillPopup() {
  const skillPopup = document.getElementById('skillPopup');
  const skillPopupTitle = skillPopup?.querySelector('.skill-popup-title');
  const skillPopupCopy = skillPopup?.querySelector('.skill-popup-copy');
  const skillButtons = document.querySelectorAll('.tag-button');
  const aboutTags = document.querySelector('.about-tags');

  if (!skillPopup || !skillPopupTitle || !skillPopupCopy || !skillButtons.length) return;

  function showSkillPopup(button) {
    const skill = button.dataset.skill;
    skillPopupTitle.textContent = skill;
    skillPopupCopy.textContent =
      skillNotes[skill] || 'Experiencia construyendo herramientas, logica de negocio y soluciones tecnicas alrededor de esta tecnologia.';
    skillPopup.hidden = false;
    skillPopup.classList.add('is-visible');
  }

  function hideSkillPopup() {
    skillPopup.classList.remove('is-visible');
    skillPopup.hidden = true;
  }

  skillButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => showSkillPopup(button));
    button.addEventListener('focus', () => showSkillPopup(button));
  });

  aboutTags?.addEventListener('mouseleave', hideSkillPopup);
  aboutTags?.addEventListener('focusout', (event) => {
    if (!aboutTags.contains(event.relatedTarget)) hideSkillPopup();
  });
}
