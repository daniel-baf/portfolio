import type Lenis from 'lenis';
import type { PresentationBeat } from '../data/presentation';
import type { ScrollTimelineController } from './scroll-timeline';

interface InputControllerOptions {
  timeline: ScrollTimelineController;
  beats: PresentationBeat[];
  lenis: Lenis | null;
}

// Centro (en progress 0..1) de cada beat, segun su peso. Un click avanza al
// centro del beat siguiente, con scroll suave — ya no un salto fijo y brusco.
function computeBeatCenters(beats: PresentationBeat[]): number[] {
  const total = beats.reduce((sum, beat) => sum + beat.weight, 0);
  const centers: number[] = [];
  let cursor = 0;
  beats.forEach((beat) => {
    const start = cursor / total;
    cursor += beat.weight;
    const end = cursor / total;
    centers.push((start + end) / 2);
  });
  return centers;
}

export function initInputController({ timeline, beats, lenis }: InputControllerOptions) {
  const prevZone = document.getElementById('presentationZonePrev');
  const nextZone = document.getElementById('presentationZoneNext');
  const centers = computeBeatCenters(beats);

  function currentBeatIndex() {
    const progress = timeline.getProgress();
    // beat cuyo centro esta mas cerca del progreso actual
    let nearest = 0;
    let best = Infinity;
    centers.forEach((center, i) => {
      const dist = Math.abs(center - progress);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  function goToBeat(index: number) {
    const clamped = Math.min(Math.max(index, 0), beats.length - 1);
    const targetProgress = centers[clamped];

    if (lenis) {
      const targetPx = timeline.getScrollForProgress(targetProgress);
      lenis.scrollTo(targetPx, { duration: 1.1 });
    } else {
      timeline.setProgress(targetProgress);
    }
  }

  function step(dir: number) {
    goToBeat(currentBeatIndex() + dir);
  }

  prevZone?.addEventListener('click', () => step(-1));
  nextZone?.addEventListener('click', () => step(1));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      step(-1);
    }
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      step(1);
    }
  });
}
