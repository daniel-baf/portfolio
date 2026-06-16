import { initCv } from './init-cv.js';

const mode = document.body.dataset.mode;

if (mode === 'cv') {
  initCv();
}
