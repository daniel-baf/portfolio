import * as THREE from 'three';
import type { SceneKey } from '../data/presentation';
import { presentationBeats } from '../data/presentation';
import { getSceneStateForBeat } from './scene-states';

export interface QualitySettings {
  highQuality: boolean;
  pixelRatio: number;
  particleCount: number;
}

export interface ThreeSceneController {
  update: (progress: number) => void;
  setQuality: (settings: QualitySettings) => void;
  setThemeColor: (hex: string) => void;
  dispose: () => void;
  isReady: () => boolean;
}

function getThemePrimaryColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  return value || '#E62815';
}

function createParticleField(count: number, spread: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: getThemePrimaryColor(),
    size: 0.14,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function createWireGrid(size: number, divisions: number) {
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function createServerStack() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  });

  for (let i = 0; i < 5; i += 1) {
    const geometry = new THREE.BoxGeometry(1.6, 0.7, 1.2);
    const cube = new THREE.Mesh(geometry, material.clone());
    cube.position.y = i * 0.85;
    group.add(cube);
  }

  group.position.y = -1.2;
  return group;
}

function createCloudBurst() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });

  for (let i = 0; i < 8; i += 1) {
    const geometry = new THREE.IcosahedronGeometry(0.45 + Math.random() * 0.35, 0);
    const mesh = new THREE.Mesh(geometry, material.clone());
    const angle = (i / 8) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 2.2, 1 + Math.random() * 2.5, Math.sin(angle) * 2.2);
    group.add(mesh);
  }

  return group;
}

function createOutroRing() {
  const geometry = new THREE.TorusGeometry(4.5, 0.03, 8, 80);
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    transparent: true,
    opacity: 0.65,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

// 2020 · primeros programas — bloques de codigo brillantes flotando
function createCodeBlocks() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });

  const rows = 6;
  for (let i = 0; i < rows; i += 1) {
    const width = 1.4 + (i % 3) * 0.9;
    const geometry = new THREE.BoxGeometry(width, 0.28, 0.28);
    const block = new THREE.Mesh(geometry, material.clone());
    block.position.set((i % 2 === 0 ? -0.6 : 0.6), (i - rows / 2) * 0.55, 0);
    group.add(block);
  }

  return group;
}

// 2021-2022 · estructuras de datos — arbol binario de nodos + aristas
function createTreeGraph() {
  const group = new THREE.Group();
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  // posiciones de un arbol binario de 4 niveles
  const nodes: THREE.Vector3[] = [];
  const edges: number[] = [];
  const levels = 4;
  let index = 0;
  for (let level = 0; level < levels; level += 1) {
    const count = 2 ** level;
    const spread = count * 1.6;
    for (let i = 0; i < count; i += 1) {
      const x = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
      const y = (levels / 2 - level) * 1.1;
      nodes.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.6));
      if (level > 0) {
        const parent = Math.floor((index - 1) / 2);
        edges.push(parent, index);
      }
      index += 1;
    }
  }

  nodes.forEach((pos) => {
    const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), nodeMaterial.clone());
    sphere.position.copy(pos);
    group.add(sphere);
  });

  const linePositions = new Float32Array(edges.length * 3);
  edges.forEach((nodeIndex, i) => {
    const pos = nodes[nodeIndex];
    linePositions[i * 3] = pos.x;
    linePositions[i * 3 + 1] = pos.y;
    linePositions[i * 3 + 2] = pos.z;
  });
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: getThemePrimaryColor(),
    transparent: true,
    opacity: 0.5,
  });
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  return group;
}

// 2022 · primer web — planos tipo "ventana de browser" flotando
function createBrowserPlanes() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 4; i += 1) {
    const geometry = new THREE.PlaneGeometry(2.6, 1.7, 6, 4);
    const plane = new THREE.Mesh(geometry, material.clone());
    plane.position.set((i - 1.5) * 1.2, Math.sin(i) * 0.8, -i * 0.9);
    plane.rotation.y = (i - 1.5) * 0.25;
    group.add(plane);
  }

  return group;
}

// 2025 · liderazgo / freelance — red de nodos conectados
function createNodeNetwork() {
  const group = new THREE.Group();
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  const nodes: THREE.Vector3[] = [];
  const count = 10;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2 + (i % 3) * 0.7;
    const pos = new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * radius,
    );
    nodes.push(pos);
    const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 0), nodeMaterial.clone());
    sphere.position.copy(pos);
    group.add(sphere);
  }

  // conecta cada nodo con el siguiente y con el central para formar la malla
  const edgePoints: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = nodes[i];
    const b = nodes[(i + 1) % count];
    edgePoints.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (i % 2 === 0) {
      const c = nodes[(i + 3) % count];
      edgePoints.push(a.x, a.y, a.z, c.x, c.y, c.z);
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePoints), 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: getThemePrimaryColor(),
    transparent: true,
    opacity: 0.45,
  });
  group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  return group;
}

// Planeta + anillo + lunas orbitando — metafora de "sistema"
function createPlanetSystem(options: {
  radius: number;
  ringRadius: number;
  moons: number;
  detail?: number;
}) {
  const { radius, ringRadius, moons, detail = 1 } = options;
  const group = new THREE.Group();

  // planeta central
  const planet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius, detail),
    new THREE.MeshBasicMaterial({
      color: getThemePrimaryColor(),
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    }),
  );
  group.add(planet);

  // anillo inclinado
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(ringRadius, 0.025, 8, 90),
    new THREE.MeshBasicMaterial({
      color: getThemePrimaryColor(),
      transparent: true,
      opacity: 0.55,
    }),
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  // lunas / satelites en orbita (cada una en su propio pivote para girar aparte)
  const moonMaterial = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });
  for (let i = 0; i < moons; i += 1) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / moons) * Math.PI * 2;
    pivot.rotation.z = (Math.random() - 0.5) * 0.6;
    const orbit = ringRadius + 0.4 + i * 0.5;
    const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 0), moonMaterial.clone());
    moon.position.set(orbit, 0, 0);
    moon.userData.orbitSpeed = 0.3 + i * 0.12;
    pivot.add(moon);
    group.add(pivot);
  }

  group.userData.isPlanetSystem = true;
  return group;
}

// 2024 · Oracle ONE — columnas ordenadas (backend estructurado)
function createColumnGrid() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: getThemePrimaryColor(),
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });

  const cols = 5;
  for (let i = 0; i < cols; i += 1) {
    const height = 1.6 + (i % 2 === 0 ? 1.2 : 0);
    const geometry = new THREE.BoxGeometry(0.6, height, 0.6);
    const column = new THREE.Mesh(geometry, material.clone());
    column.position.set((i - (cols - 1) / 2) * 1.1, height / 2 - 1.5, 0);
    group.add(column);
  }

  return group;
}

export function initThreeScene(
  canvas: HTMLCanvasElement,
  initialQuality: QualitySettings,
): ThreeSceneController | null {
  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: initialQuality.highQuality,
      alpha: false,
      powerPreference: initialQuality.highQuality ? 'high-performance' : 'low-power',
    });
    renderer.setClearColor(0x1c1d22, 1);
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1c1d22, 0.018);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 2, 12);

  const ambient = new THREE.AmbientLight(0x8b96a0, 0.4);
  const point = new THREE.PointLight(0xe62815, 1.2, 40);
  point.position.set(4, 6, 8);
  scene.add(ambient, point);

  const groups: Record<SceneKey, THREE.Object3D> = {
    intro: new THREE.Group(),
    compile: new THREE.Group(),
    datastructures: new THREE.Group(),
    web: new THREE.Group(),
    lowlevel: new THREE.Group(),
    oracle: new THREE.Group(),
    network: new THREE.Group(),
    cloud: new THREE.Group(),
    ai: new THREE.Group(),
    outro: new THREE.Group(),
  };

  const introGrid = createWireGrid(14, 18);
  groups.intro.add(introGrid);

  groups.compile.add(createCodeBlocks());
  groups.datastructures.add(createTreeGraph());
  groups.web.add(createBrowserPlanes());

  // bajo nivel: reutiliza el stack de cubos como "bits / registros"
  groups.lowlevel.add(createServerStack());

  groups.oracle.add(createColumnGrid());

  // liderazgo: red de nodos con un planeta-hub al centro
  groups.network.add(createNodeNetwork());
  groups.network.add(createPlanetSystem({ radius: 0.7, ringRadius: 1.4, moons: 2 }));

  // produccion (vantumst): planeta-sistema grande + nube de infraestructura
  groups.cloud.add(createPlanetSystem({ radius: 1.4, ringRadius: 2.6, moons: 4, detail: 1 }));
  groups.cloud.add(createCloudBurst());

  const outroRing = createOutroRing();
  groups.outro.add(outroRing);

  // era IA: planeta-nucleo "neural" + campo de particulas (hereda calidad)
  groups.ai.add(createPlanetSystem({ radius: 0.9, ringRadius: 1.8, moons: 3, detail: 2 }));
  let particleField = createParticleField(initialQuality.particleCount, 16);
  groups.ai.add(particleField);

  Object.values(groups).forEach((group) => scene.add(group));

  let quality = initialQuality;
  let themeColor = new THREE.Color(getThemePrimaryColor());
  let progress = 0;
  let ready = false;
  let animationId = 0;
  const clock = new THREE.Clock();
  const lookAtTarget = new THREE.Vector3();

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(quality.pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function applyGroupWeights(weights: Record<SceneKey, number>) {
    (Object.keys(groups) as SceneKey[]).forEach((key) => {
      const group = groups[key];
      const weight = weights[key];
      group.visible = weight > 0.02;
      if (!group.visible) return; // grupos ocultos: no tocar opacidades
      group.traverse((child) => {
        if ('material' in child && child.material && 'opacity' in child.material) {
          const base = key === 'intro' || key === 'web' ? 0.55 : 0.45;
          child.material.opacity = Math.min(1, base + weight * 0.55);
        }
      });
    });
  }

  function renderFrame() {
    const elapsed = clock.getElapsedTime();
    const state = getSceneStateForBeat(presentationBeats, progress);

    camera.position.set(...state.cameraPosition);
    lookAtTarget.set(...state.cameraLookAt);
    camera.lookAt(lookAtTarget);

    groups.intro.rotation.z = elapsed * 0.04;
    groups.datastructures.rotation.y = elapsed * 0.1;
    groups.lowlevel.rotation.y = elapsed * 0.08;
    groups.oracle.rotation.y = elapsed * 0.06;
    groups.network.rotation.y = elapsed * 0.12;
    groups.cloud.rotation.y = -elapsed * 0.1;
    groups.web.rotation.y = Math.sin(elapsed * 0.3) * 0.15;
    groups.outro.rotation.z = elapsed * 0.05;
    particleField.rotation.y = elapsed * 0.15 * state.particleSpeed;
    particleField.rotation.x = Math.sin(elapsed * 0.2) * 0.08;

    applyGroupWeights(state.groupWeights);
    renderer.render(scene, camera);
    ready = true;
  }

  function animate() {
    animationId = window.requestAnimationFrame(animate);
    renderFrame();
  }

  resize();
  window.addEventListener('resize', resize);
  renderFrame();
  animate();

  return {
    update: (nextProgress: number) => {
      progress = nextProgress;
    },
    setQuality: (settings: QualitySettings) => {
      quality = settings;
      resize();

      groups.ai.remove(particleField);
      particleField.geometry.dispose();
      (particleField.material as THREE.Material).dispose();
      particleField = createParticleField(settings.particleCount, settings.highQuality ? 16 : 10);
      particleField.material.color = themeColor;
      groups.ai.add(particleField);
    },
    setThemeColor: (hex: string) => {
      themeColor = new THREE.Color(hex);
      scene.traverse((child) => {
        if ('material' in child && child.material && 'color' in child.material) {
          child.material.color = themeColor;
        }
      });
      particleField.material.color = themeColor;
    },
    dispose: () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((child) => {
        if ('geometry' in child && child.geometry) child.geometry.dispose();
        if ('material' in child && child.material) {
          const material = child.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    },
    isReady: () => ready,
  };
}
