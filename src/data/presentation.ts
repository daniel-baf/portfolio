import { journey } from './journey';
import type { JourneyHighlight, SceneKey } from './journey';

export type { SceneKey } from './journey';

export interface PresentationBeat {
  id: string;
  primary: string;
  secondary: string;
  scene: SceneKey;
  weight: number;
  highlights?: JourneyHighlight[];
  cta?: { label: string; href: string };
}

export const presentationMeta = {
  title: 'Daniel Bautista | Dev Presentation',
  description:
    'Presentacion scroll-driven con WebGL: backend engineer, cloud y sistemas confiables.',
  loadingCopy: 'initializing webgl pipeline...',
  helpCopy: 'Usa scroll, flechas arriba/abajo o toca la parte superior/inferior de la pantalla.',
};

// Los beats son una proyeccion de los capitulos de `journey` (fuente de verdad).
export const presentationBeats: PresentationBeat[] = journey.map((chapter) => ({
  id: chapter.id,
  primary: chapter.title,
  secondary: chapter.subtitle,
  scene: chapter.scene,
  weight: chapter.weight ?? 1,
  highlights: chapter.highlights,
  cta: chapter.cta,
}));

export const SCROLL_HEIGHT_PER_WEIGHT = 170; // vh per beat weight unit (mas recorrido = scroll mas calmado)

export function getScrollDriverHeight(beats = presentationBeats) {
  const totalWeight = beats.reduce((sum, beat) => sum + beat.weight, 0);
  return totalWeight * SCROLL_HEIGHT_PER_WEIGHT;
}
