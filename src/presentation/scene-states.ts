import type { PresentationBeat, SceneKey } from '../data/presentation';

export interface SceneState {
  cameraPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  groupWeights: Record<SceneKey, number>;
  particleSpeed: number;
}

const SCENE_KEYS: SceneKey[] = [
  'intro',
  'compile',
  'datastructures',
  'web',
  'lowlevel',
  'oracle',
  'network',
  'cloud',
  'ai',
  'outro',
];

// Defaultea todos los pesos a 0; el caller solo declara los grupos activos
// (1) y un poco de "bleed" de los vecinos para que el crossfade sea suave.
function weights(active: Partial<Record<SceneKey, number>>): Record<SceneKey, number> {
  const base = Object.fromEntries(SCENE_KEYS.map((key) => [key, 0])) as Record<SceneKey, number>;
  return { ...base, ...active };
}

export const sceneStates: Record<SceneKey, SceneState> = {
  intro: {
    cameraPosition: [0, 2, 12],
    cameraLookAt: [0, 0, 0],
    groupWeights: weights({ intro: 1, ai: 0.15 }),
    particleSpeed: 0.4,
  },
  compile: {
    cameraPosition: [3, 2, 10],
    cameraLookAt: [0, 0, 0],
    groupWeights: weights({ compile: 1, intro: 0.2 }),
    particleSpeed: 0.45,
  },
  datastructures: {
    cameraPosition: [5, 4, 11],
    cameraLookAt: [0, 1, 0],
    groupWeights: weights({ datastructures: 1, compile: 0.2 }),
    particleSpeed: 0.55,
  },
  web: {
    cameraPosition: [0, 2, 9],
    cameraLookAt: [0, 1, 0],
    groupWeights: weights({ web: 1, datastructures: 0.15 }),
    particleSpeed: 0.5,
  },
  lowlevel: {
    cameraPosition: [-4, 3, 9],
    cameraLookAt: [0, 0, 0],
    groupWeights: weights({ lowlevel: 1, web: 0.15 }),
    particleSpeed: 0.6,
  },
  oracle: {
    cameraPosition: [6, 4, 9],
    cameraLookAt: [0, 1, 0],
    groupWeights: weights({ oracle: 1, lowlevel: 0.2 }),
    particleSpeed: 0.6,
  },
  network: {
    cameraPosition: [-3, 3, 10],
    cameraLookAt: [0, 1, 0],
    groupWeights: weights({ network: 1, oracle: 0.2 }),
    particleSpeed: 0.7,
  },
  cloud: {
    cameraPosition: [0, 6, 11],
    cameraLookAt: [0, 2, 0],
    groupWeights: weights({ cloud: 1, network: 0.3 }),
    particleSpeed: 0.85,
  },
  ai: {
    cameraPosition: [0, 3, 10],
    cameraLookAt: [0, 1, 0],
    groupWeights: weights({ ai: 1, cloud: 0.35 }),
    particleSpeed: 1,
  },
  outro: {
    cameraPosition: [0, 4, 16],
    cameraLookAt: [0, 0, 0],
    groupWeights: weights({ outro: 1, ai: 0.4, cloud: 0.25 }),
    particleSpeed: 0.35,
  },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(a: [number, number, number], b: [number, number, number], t: number) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as [number, number, number];
}

export function mixSceneStates(from: SceneKey, to: SceneKey, t: number): SceneState {
  const a = sceneStates[from];
  const b = sceneStates[to];
  const groupWeights = {} as Record<SceneKey, number>;

  SCENE_KEYS.forEach((key) => {
    groupWeights[key] = lerp(a.groupWeights[key], b.groupWeights[key], t);
  });

  return {
    cameraPosition: lerpVec3(a.cameraPosition, b.cameraPosition, t),
    cameraLookAt: lerpVec3(a.cameraLookAt, b.cameraLookAt, t),
    groupWeights,
    particleSpeed: lerp(a.particleSpeed, b.particleSpeed, t),
  };
}

export function getSceneStateForBeat(beats: PresentationBeat[], progress: number): SceneState {
  const totalWeight = beats.reduce((sum, beat) => sum + beat.weight, 0);
  let cursor = 0;

  for (let i = 0; i < beats.length; i += 1) {
    const beat = beats[i];
    const start = cursor / totalWeight;
    cursor += beat.weight;
    const end = cursor / totalWeight;

    if (progress <= end || i === beats.length - 1) {
      const localT = end === start ? 0 : (progress - start) / (end - start);
      const nextBeat = beats[Math.min(i + 1, beats.length - 1)];
      return mixSceneStates(beat.scene, nextBeat.scene, Math.min(Math.max(localT, 0), 1));
    }
  }

  return sceneStates.outro;
}

export function getBeatIndexForProgress(beats: PresentationBeat[], progress: number) {
  const totalWeight = beats.reduce((sum, beat) => sum + beat.weight, 0);
  let cursor = 0;

  for (let i = 0; i < beats.length; i += 1) {
    cursor += beats[i].weight;
    if (progress <= cursor / totalWeight) return i;
  }

  return beats.length - 1;
}
