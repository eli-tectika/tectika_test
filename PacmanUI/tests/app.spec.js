import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initApp } from '../src/ui/app.js'
import { saveOptions } from '../src/utils/storage.js'

function setupDom() {
  document.body.innerHTML = `
  <div id="app">
    <header class="title-screen"><h1>Pacman</h1></header>
    <main>
      <section id="view-menu" class="view" data-view="menu">
        <ul class="menu">
          <li><button class="menu-item" data-action="start">Start Game</button></li>
          <li><button class="menu-item" data-action="options">Options</button></li>
          <li><button class="menu-item" data-action="highscores">High Scores</button></li>
          <li><button class="menu-item" data-action="help">Help / About</button></li>
          <li><button class="menu-item" data-action="exit">Exit / Back</button></li>
        </ul>
      </section>
      <section id="view-options" class="view hidden" data-view="options">
        <form id="options-form">
          <input type="checkbox" id="opt-sound" />
          <select id="opt-difficulty">
            <option value="Easy">Easy</option>
            <option value="Normal" selected>Normal</option>
            <option value="Hard">Hard</option>
          </select>
          <button type="submit" id="btn-save-options">Save</button>
          <button type="button" id="btn-back-options">Back</button>
        </form>
      </section>
      <section id="view-highscores" class="view hidden" data-view="highscores">
        <ol id="scores-list"></ol>
        <button type="button" class="back-button">Back</button>
      </section>
      <section id="view-help" class="view hidden" data-view="help">
        <button type="button" class="back-button">Back</button>
      </section>
      <section id="view-game" class="view hidden" data-view="game">
        <p id="game-status">Game starting... (placeholder)</p>
        <button type="button" class="back-button">Back</button>
      </section>
    </main>
  </div>`
}

describe('Pacman UI', () => {
  beforeEach(() => {
    setupDom()
  })

  it('Start transitions to game state', () => {
    initApp(document)
    const startBtn = document.querySelector('[data-action="start"]')
    startBtn.click()
    expect(document.body.dataset.view).toBe('game')
    const game = document.getElementById('view-game')
    expect(game.classList.contains('hidden')).toBe(false)
  })

  it('Options are persisted and loaded on startup', () => {
    // First run: set options
    initApp(document)
    document.querySelector('[data-action="options"]').click()
    const chk = document.getElementById('opt-sound')
    const sel = document.getElementById('opt-difficulty')
    chk.checked = false
    sel.value = 'Hard'
    document.getElementById('btn-save-options').click()

    // Simulate a new init
    setupDom()
    initApp(document)

    expect(document.getElementById('opt-sound').checked).toBe(false)
    expect(document.getElementById('opt-difficulty').value).toBe('Hard')
  })

  it('High scores render from stub when backend unavailable', async () => {
    // Mock fetch: backend request fails; local highscores.json succeeds
    global.fetch = vi.fn(async (url) => {
      if (typeof url === 'string' && url.includes('/highscores')) {
        // Simulate backend URL request fails (when base URL is set)
        const err = new Error('Network error')
        err.ok = false
        throw err
      }
      if (typeof url === 'string' && url.includes('highscores.json')) {
        return {
          ok: true,
          json: async () => ([
            { name: 'ZZZ', score: 5000 },
            { name: 'AAA', score: 10000 },
            { name: 'MMM', score: 8000 }
          ])
        }
      }
      return { ok: false, json: async () => [] }
    })

    // Ensure no base URL is set so provider uses the stub path
    localStorage.removeItem('pacmanConfig')

    initApp(document)
    document.querySelector('[data-action="highscores"]').click()

    // Wait a tick for async render
    await new Promise(r => setTimeout(r, 0))

    const items = Array.from(document.querySelectorAll('#scores-list li')).map(li => li.textContent)
    // Should be sorted descending by score: AAA (10000), MMM (8000), ZZZ (5000)
    expect(items[0]).toMatch(/AAA/)
    expect(items[1]).toMatch(/MMM/)
    expect(items[2]).toMatch(/ZZZ/)
  })
})
