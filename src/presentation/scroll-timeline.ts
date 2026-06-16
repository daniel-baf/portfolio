import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PresentationBeat } from '../data/presentation';
import { getBeatIndexForProgress } from './scene-states';
import type { TypographyController } from './typography-driver';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollTimelineController {
  getProgress: () => number;
  setProgress: (value: number) => void;
  getScrollForProgress: (value: number) => number;
  destroy: () => void;
}

interface ScrollTimelineOptions {
  beats: PresentationBeat[];
  typography: TypographyController;
  onProgress: (progress: number) => void;
}

function applyTimelineProgress(
  progress: number,
  beats: PresentationBeat[],
  typography: TypographyController,
  onProgress: (progress: number) => void,
) {
  const beatIndex = getBeatIndexForProgress(beats, progress);
  typography.setBeat(beats[beatIndex], beatIndex, beats.length);
  typography.setProgressLabel(progress);
  onProgress(progress);
}

export function initScrollTimeline({
  beats,
  typography,
  onProgress,
}: ScrollTimelineOptions): ScrollTimelineController {
  const driver = document.getElementById('scroll-driver');
  if (!driver) {
    throw new Error('Presentation scroll driver not found');
  }

  const state = { progress: 0 };

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    paused: true,
    onUpdate: () => {
      state.progress = timeline.progress();
      applyTimelineProgress(state.progress, beats, typography, onProgress);
    },
  });

  beats.forEach((beat) => {
    timeline.to(
      {},
      {
        duration: beat.weight,
        onStart: () => {
          const beatIndex = beats.indexOf(beat);
          typography.setBeat(beat, beatIndex, beats.length);
        },
      },
    );
  });

  const trigger = ScrollTrigger.create({
    animation: timeline,
    trigger: driver,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1, // mas alto = la animacion sigue al scroll con mas suavidad/retardo
    invalidateOnRefresh: true,
  });

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('resize', refresh);
  refresh();

  applyTimelineProgress(0, beats, typography, onProgress);
  timeline.progress(0);

  return {
    getProgress: () => state.progress,
    getScrollForProgress: (value) => {
      const clamped = Math.min(Math.max(value, 0), 1);
      return trigger.start + (trigger.end - trigger.start) * clamped;
    },
    setProgress: (value) => {
      const clamped = Math.min(Math.max(value, 0), 1);
      const scrollPos = trigger.start + (trigger.end - trigger.start) * clamped;
      window.scrollTo({ top: scrollPos, behavior: 'auto' });
      timeline.progress(clamped);
      state.progress = clamped;
      applyTimelineProgress(clamped, beats, typography, onProgress);
    },
    destroy: () => {
      window.removeEventListener('resize', refresh);
      trigger.kill();
      timeline.kill();
    },
  };
}
