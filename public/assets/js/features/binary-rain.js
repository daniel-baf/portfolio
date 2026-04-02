export function initBinaryRain() {
  const canvas = document.getElementById('binaryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width;
  let height;
  let columns;
  let drops;
  const chars = '01アイウエオカキクケコ10';
  const fontSize = 14;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10,10,15,0.05)';
    ctx.fillRect(0, 0, width, height);

    const colors = window.binaryRainColors || { primary: '#FF851B', accent: '#FDAF00' };
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i += 1) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = i % 5 === 0 ? colors.accent : colors.primary;
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
}
