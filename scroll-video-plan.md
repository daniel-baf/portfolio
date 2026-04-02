# Plan de implementación: Animaciones interactivas con scroll‑triggered video/Lottie

## 1️⃣ Definir el tipo de animación
- **Opción A – Video MP4/WebM** (ideal para clips cinematográficos).  
- **Opción B – Lottie (JSON SVG)** (más ligero, perfecto para UI y animaciones vectoriales).

> **Decisión:** Elige una opción antes de continuar.  
> *Si no sabes cuál, la opción B suele ser más rápida y amigable con móviles.*

---

## 2️⃣ Generar el contenido visual con IA
| Opción | Servicio IA (pago) | Prompt de ejemplo | Exportación |
|--------|-------------------|-------------------|-------------|
| **Video** | **Runway Gen‑2** o **Pika** | `"A futuristic city skyline at sunset, smooth camera pan, 8 seconds, 1080p"` | MP4 (optimizar con HandBrake → ~2 Mbps) |
| **Lottie** | **LottieFiles AI Animator** | `"A looping line‑drawing of a plant growing, pastel colors, 2 seconds"` | JSON (`animation.json`) |
| **Open‑source** | **Stable Diffusion + AnimateDiff** (local) | `"A neon cyber‑punk street, 5 s"` | Secuencia de PNG → MP4 (ffmpeg) o → Lottie (lottie‑converter) |

### Pasos para generar con Runway (ejemplo)
1. Regístrate y compra créditos.
2. En *Create → Text‑to‑Video* pega el prompt.
3. Ajusta duración (max 10 s) y resolución.
4. Descarga el archivo `scroll‑city.mp4`.
5. Optimiza con `handbrake-cli` (opcional):
   ```bash
   handbrake-cli -i scroll-city.mp4 -o scroll-city-opt.mp4 --vb 2000 --encoder x264
   ```

### Pasos para generar Lottie con LottieFiles AI (ejemplo)
1. Crea cuenta en LottieFiles y abre *AI Animator*.
2. Introduce el prompt y pulsa **Generate**.
3. Descarga `animation.json`.
4. (Opcional) Reduce tamaño con `svgo`:
   ```bash
   npx svgo -i animation.json -o animation.min.json
   ```

---

## 3️⃣ Preparar el proyecto web
### 3.1 Estructura de carpetas (ejemplo)
```
project-root/
│   index.html
│   package.json   (si usas npm)
└───public/
│   └───videos/          # videos MP4/WebM
│   └───animations/      # archivos Lottie JSON
└───src/ (opcional)      # código JS/TS
```

### 3.2 Instalar dependencias
- **GSAP + ScrollTrigger** (para ambas opciones)
- **lottie‑web** (solo si usas Lottie)
- **Optional:** `vite` o `parcel` para servir localmente.

```bash
# Si usas npm (recomendado)
npm init -y
npm install gsap lottie-web
# Opcional: servidor de desarrollo rápido
npm install -D vite
# Añade script de dev en package.json
#   "scripts": { "dev": "vite" }
```

---

## 4️⃣ Implementar la animación
### 4.1 Video + GSAP (ScrollTrigger)
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Scroll‑Video Demo</title>
  <style>
    body,html{margin:0;height:200vh;}
    .video-wrapper{position:sticky;top:0;height:100vh;overflow:hidden;}
    video{width:100%;height:100%;object-fit:cover;}
  </style>
</head>
<body>
  <div class="video-wrapper">
    <video id="scrollVideo" muted playsinline preload="auto">
      <source src="public/videos/scroll-city-opt.mp4" type="video/mp4">
    </video>
  </div>
  <!-- contenido extra para que haya scroll -->
  <div style="height:150vh;"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script>
    const vid = document.getElementById('scrollVideo');
    vid.addEventListener('loadedmetadata', () => {
      gsap.to(vid, {
        currentTime: vid.duration,
        ease: 'none',
        scrollTrigger: {
          trigger: '.video-wrapper',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          anticipatePin: 1
        }
      });
    });
  </script>
</body>
</html>
```

### 4.2 Lottie + GSAP (ScrollTrigger)
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Scroll‑Lottie Demo</title>
  <style>
    #lottieContainer{width:100%;height:100vh;}
  </style>
</head>
<body>
  <div id="lottieContainer"></div>
  <div style="height:150vh;"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script>
    const anim = lottie.loadAnimation({
      container: document.getElementById('lottieContainer'),
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'public/animations/animation.json' // <-- tu JSON
    });

    anim.addEventListener('DOMLoaded', () => {
      gsap.to(anim, {
        frame: anim.totalFrames,
        ease: 'none',
        scrollTrigger: {
          trigger: '#lottieContainer',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  </script>
</body>
</html>
```

---

## 5️⃣ Optimización y pruebas
1. **Performance** – Usa `requestAnimationFrame` (GSAP lo hace internamente).  
2. **Mobile** – Añade `media: '(max-width: 768px)'` a `ScrollTrigger` para reducir la distancia de scroll.  
3. **Accesibilidad** – Proporciona subtítulos (`<track kind="captions" ...>`) o una versión estática del mensaje.  
4. **Pruebas** – Abre la página con `npm run dev` (Vite) o con `npx serve .` y verifica en Chrome/Firefox y en dispositivos móviles.

---

## 6️⃣ Despliegue
- **Static hosting** (Netlify, Vercel, GitHub Pages): sube la carpeta `public/` y el `index.html`.  
- **Docker** (si tu proyecto ya usa Docker‑Compose):
  ```yaml
  version: '3.8'
  services:
    web:
      image: nginx:alpine
      volumes:
        - ./public:/usr/share/nginx/html:ro
      ports:
        - "8080:80"
  ```
  Luego `docker-compose up -d` y accede a `http://localhost:8080`.

---

## 7️⃣ Checklist rápido
- [ ] Elegir **Video** o **Lottie**.
- [ ] Generar el asset con IA (Runway / LottieFiles / Stable Diffusion).
- [ ] Optimizar el archivo (HandBrake / svgo).
- [ ] Crear la estructura de carpetas.
- [ ] Instalar `gsap` y, si corresponde, `lottie-web`.
- [ ] Copiar el snippet HTML/JS correspondiente.
- [ ] Probar en desktop y móvil.
- [ ] Añadir accesibilidad (subtítulos / fallback).
- [ ] Deploy (Netlify, Vercel o Docker).

---

**¡Listo!** Sigue este plan paso a paso y tendrás una página con una animación que avanza al hacer scroll, usando herramientas IA para generar el contenido visual y librerías modernas para la interacción.
