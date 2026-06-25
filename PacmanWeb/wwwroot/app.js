/* Pacman Menu UI Logic */
(function () {
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    options: document.getElementById('screen-options'),
    highscores: document.getElementById('screen-highscores'),
    credits: document.getElementById('screen-credits'),
  };

  const versionEl = document.getElementById('app-version');
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const startBtn = document.getElementById('btn-start');
  const optionsForm = document.getElementById('options-form');
  const highscoresList = document.getElementById('highscores-list');

  const STORAGE_KEYS = {
    settings: 'pacman.settings',
    highscores: 'pacman.highscores',
    theme: 'pacman.theme',
  };

  const defaultSettings = {
    difficulty: 'normal',
    sound: 70,
    theme: 'classic',
    controls: {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    },
  };

  const state = {
    settings: loadSettings(),
    theme: loadTheme(),
    highscores: loadHighscores(),
  };

  // Init
  applyTheme(state.theme || 'dark');
  updateVersion('0.1.0');
  renderHighscores();
  hydrateOptionsForm();
  setupControlCapture();
  setupGlobalHandlers();

  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[id].classList.remove('hidden');
  }

  function updateVersion(v) {
    versionEl.textContent = `v${v}`;
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.settings);
      return raw ? JSON.parse(raw) : { ...defaultSettings };
    } catch (e) {
      console.warn('Settings load error', e);
      return { ...defaultSettings };
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
    } catch (e) {
      console.warn('Settings save error', e);
    }
  }

  function loadHighscores() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.highscores);
      return raw ? JSON.parse(raw) : sampleScores();
    } catch (e) {
      console.warn('Highscores load error', e);
      return sampleScores();
    }
  }

  function saveHighscores() {
    try {
      localStorage.setItem(STORAGE_KEYS.highscores, JSON.stringify(state.highscores));
    } catch (e) {
      console.warn('Highscores save error', e);
    }
  }

  function sampleScores() {
    const today = new Date().toISOString().slice(0, 10);
    return [
      { player: 'AAA', score: 25000, date: today },
      { player: 'BBB', score: 20000, date: today },
      { player: 'CCC', score: 15000, date: today },
      { player: 'DDD', score: 10000, date: today },
      { player: 'EEE', score: 5000, date: today },
    ];
  }

  function applyTheme(mode) {
    document.body.classList.remove('dark', 'light');
    const next = mode === 'light' ? 'light' : 'dark';
    document.body.classList.add(next);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next);
    } catch {}
  }

  function loadTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function renderHighscores() {
    // Remove previous rows except header
    highscoresList.querySelectorAll('.row.entry').forEach(el => el.remove());

    state.highscores
      .slice()
      .sort((a, b) => b.score - a.score)
      .forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = 'row entry';
        row.setAttribute('role', 'row');
        row.innerHTML = `
          <div class="cell" role="cell">${String(idx + 1).padStart(2, ' ')}</div>
          <div class="cell" role="cell">${escapeHtml(entry.player)}</div>
          <div class="cell" role="cell">${Number(entry.score).toLocaleString()}</div>
          <div class="cell" role="cell">${escapeHtml(entry.date)}</div>
        `;
        highscoresList.appendChild(row);
      });
  }

  function hydrateOptionsForm() {
    document.getElementById('opt-difficulty').value = state.settings.difficulty;
    document.getElementById('opt-sound').value = state.settings.sound;
    document.getElementById('opt-theme').value = state.settings.theme;
    document.getElementById('ctrl-up').value = state.settings.controls.up;
    document.getElementById('ctrl-down').value = state.settings.controls.down;
    document.getElementById('ctrl-left').value = state.settings.controls.left;
    document.getElementById('ctrl-right').value = state.settings.controls.right;
  }

  function setupGlobalHandlers() {
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (!action) return;

      switch (action) {
        case 'start':
          startGame();
          break;
        case 'options':
          showScreen('options');
          break;
        case 'highscores':
          showScreen('highscores');
          break;
        case 'credits':
          showScreen('credits');
          break;
        case 'back':
          showScreen('welcome');
          break;
        case 'clear-scores':
          if (confirm('Clear local high scores? This cannot be undone.')) {
            state.highscores = [];
            saveHighscores();
            renderHighscores();
          }
          break;
      }
    });

    themeToggleBtn.addEventListener('click', () => {
      const next = document.body.classList.contains('light') ? 'dark' : 'light';
      applyTheme(next);
    });

    optionsForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const difficulty = document.getElementById('opt-difficulty').value;
      const sound = Number(document.getElementById('opt-sound').value);
      const theme = document.getElementById('opt-theme').value;

      // Validation
      const validDifficulty = ['easy', 'normal', 'hard'].includes(difficulty);
      const validSound = Number.isFinite(sound) && sound >= 0 && sound <= 100;
      const validTheme = ['classic', 'neon', 'dark'].includes(theme);

      if (!validDifficulty || !validSound || !validTheme) {
        alert('Please provide valid settings values.');
        return;
      }

      state.settings.difficulty = difficulty;
      state.settings.sound = sound;
      state.settings.theme = theme;

      // Controls
      const up = normalizeKey(document.getElementById('ctrl-up').value);
      const down = normalizeKey(document.getElementById('ctrl-down').value);
      const left = normalizeKey(document.getElementById('ctrl-left').value);
      const right = normalizeKey(document.getElementById('ctrl-right').value);
      if (!up || !down || !left || !right) {
        alert('Control keys must be a single, non-modifier key.');
        return;
      }
      state.settings.controls = { up, down, left, right };

      saveSettings();
      applyTheme(state.theme);
      showScreen('welcome');
    });
  }

  function normalizeKey(k) {
    // Simple sanitation: trim and ensure it's a single word key without modifier specifiers
    if (!k) return '';
    const key = String(k).trim();
    const invalid = [/\bControl\b/i, /\bShift\b/i, /\bAlt\b/i, /\bMeta\b/i, /\+/];
    if (invalid.some(r => r.test(key))) return '';
    return key;
  }

  function setupControlCapture() {
    const fields = ['ctrl-up', 'ctrl-down', 'ctrl-left', 'ctrl-right']
      .map(id => document.getElementById(id));
    fields.forEach(input => {
      input.addEventListener('keydown', (ev) => {
        ev.preventDefault();
        const key = ev.key;
        // ignore modifier
        if (ev.ctrlKey || ev.altKey || ev.shiftKey || ev.metaKey) return;
        if (key.length === 1 && key.match(/[\w\d]/)) {
          input.value = key.toUpperCase();
        } else {
          input.value = key;
        }
      });
      input.addEventListener('keypress', (ev) => ev.preventDefault());
      input.addEventListener('keyup', (ev) => ev.preventDefault());
      input.addEventListener('input', (ev) => {
        // Only allow simple keys, sanitize input
        const v = normalizeKey(input.value);
        input.value = v;
      });
    });
  }

  function startGame() {
    // Placeholder integration point. In a full app, this would navigate to the game route or initialize the canvas.
    // For now, we simulate by storing a "lastStart" timestamp and showing a toast.
    try {
      const startInfo = { time: new Date().toISOString(), settings: state.settings };
      localStorage.setItem('pacman.lastStart', JSON.stringify(startInfo));
    } catch {}
    alert('Starting game... (stub)');
    // window.location.href = '/game'; // example when game route exists
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
