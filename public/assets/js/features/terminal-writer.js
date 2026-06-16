export function initTerminalWriter(prefersReducedMotion) {
  const terminalOutput = document.getElementById('terminal-output');
  const statusLine = document.getElementById('terminal-status');
  if (!terminalOutput) return;

  const script = [
    { type: 'command', text: 'docker compose exec -it backend sh', speed: 46 },
    { type: 'pause', ms: 520 },
    { type: 'line', text: '[+] Running 1/1' },
    { type: 'line', text: ' ✔ Container db        Running                             0.0s' },
    { type: 'line', text: ' ✔ Container redis     Running                             0.0s' },
    { type: 'line', text: ' ✔ Container backend   Running                             0.0s' },
    { type: 'pause', ms: 360 },
    { type: 'line', text: 'Attaching to backend_1' },
    { type: 'line', text: 'backend_1  | /entrypoint.sh: checking configuration...' },
    { type: 'line', text: 'backend_1  | Booting dev shell...' },
    { type: 'line', text: 'backend_1  | reading /app/.env.local' },
    { type: 'line', text: 'backend_1  | Loading environment variables [ok]' },
    { type: 'line', text: 'backend_1  | validating python dependencies [ok]' },
    { type: 'line', text: 'backend_1  | validating node dependencies [ok]' },
    { type: 'line', text: 'backend_1  | Python 3.12.2 (main, Mar 31 2026, 10:14:07)' },
    { type: 'line', text: 'backend_1  | FastAPI + Uvicorn dev runtime ready' },
    { type: 'line', text: 'backend_1  | postgres:5432 reachable' },
    { type: 'line', text: 'backend_1  | redis:6379 reachable' },
    { type: 'line', text: 'backend_1  | ping api-gateway:8080 [ok]' },
    { type: 'line', text: 'backend_1  | loading secrets from /run/secrets/app_env' },
    { type: 'line', text: 'backend_1  | migrations status: up to date' },
    { type: 'line', text: 'backend_1  | cache warmup completed' },
    { type: 'line', text: 'backend_1  | mounting source: /app' },
    { type: 'line', text: 'backend_1  | shell profile: /root/.profile' },
    { type: 'line', text: 'backend_1  | shell granted' },
    { type: 'pause', ms: 420 },
    { type: 'prompt', text: 'root@backend_1:/app# ', speed: 42 },
  ];

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function appendLine(className = 'terminal-line') {
    const line = document.createElement('p');
    line.className = className;
    terminalOutput.append(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return line;
  }

  function pushInstant(text, className = 'terminal-line') {
    const line = appendLine(className);
    line.textContent = text;
    return line;
  }

  async function typeLine(text, className = 'terminal-line', speed = 28) {
    const line = appendLine(className);
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '_';

    for (let i = 1; i <= text.length; i += 1) {
      line.textContent = text.slice(0, i);
      line.append(cursor);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      await wait(speed);
    }

    cursor.remove();
    return line;
  }

  async function playEntry(entry) {
    if (entry.type === 'pause') {
      await wait(entry.ms);
      return;
    }

    if (entry.type === 'line') {
      pushInstant(entry.text);
      await wait(210);
      return;
    }

    if (entry.type === 'command') {
      await typeLine(`$ ${entry.text}`, 'terminal-line command', entry.speed);
      await wait(280);
      return;
    }

    if (entry.type === 'prompt') {
      await typeLine(entry.text, 'terminal-line-static', entry.speed);
    }
  }

  async function runTerminalSession() {
    terminalOutput.replaceChildren();

    if (statusLine) {
      statusLine.textContent = 'status: ejecutando comando en contenedor...';
    }

    await script.reduce((sequence, entry) => sequence.then(() => playEntry(entry)), Promise.resolve());

    if (statusLine) {
      statusLine.textContent = 'status: docker shell activa';
    }
  }

  if (prefersReducedMotion) {
    script.forEach((entry) => {
      if (entry.type === 'pause') return;
      if (entry.type === 'command') {
        pushInstant(`$ ${entry.text}`, 'terminal-line command');
        return;
      }
      if (entry.type === 'prompt') {
        pushInstant(entry.text, 'terminal-line-static');
        return;
      }
      pushInstant(entry.text);
    });

    if (statusLine) statusLine.textContent = 'status: docker shell activa';
    return;
  }

  runTerminalSession();
  setInterval(runTerminalSession, 26000);
}
