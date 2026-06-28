import { loadOptions, saveOptions } from '../utils/storage.js'
import { DataProvider } from '../utils/dataProvider.js'

function showView(doc, viewName) {
  const views = doc.querySelectorAll('.view')
  views.forEach(v => v.classList.add('hidden'))
  const target = doc.querySelector(`#view-${viewName}`)
  if (target) {
    target.classList.remove('hidden')
    doc.body.dataset.view = viewName
  }
}

function setupMenuNavigation(doc) {
  const items = Array.from(doc.querySelectorAll('#view-menu .menu-item'))
  let index = 0
  const focusItem = (i) => {
    items.forEach(btn => btn.classList.remove('focused'))
    const el = items[i]
    el.classList.add('focused')
    el.focus()
  }
  focusItem(index)

  doc.addEventListener('keydown', (e) => {
    const view = doc.body.dataset.view
    if (view !== 'menu') return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      index = (index + 1) % items.length
      focusItem(index)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      index = (index - 1 + items.length) % items.length
      focusItem(index)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[index].click()
    }
  })
}

async function renderHighScores(doc, provider) {
  const list = doc.getElementById('scores-list')
  list.innerHTML = ''
  let scores = []
  try {
    scores = await provider.getHighScores()
  } catch {
    scores = []
  }
  scores.sort((a, b) => b.score - a.score)
  scores.slice(0, 10).forEach((s, i) => {
    const li = doc.createElement('li')
    li.textContent = `${i + 1}. ${s.name} — ${s.score}`
    list.appendChild(li)
  })
}

export function initApp(doc) {
  // default is menu view
  showView(doc, 'menu')
  setupMenuNavigation(doc)

  const provider = new DataProvider()

  // Menu actions
  doc.querySelector('[data-action="start"]').addEventListener('click', () => {
    showView(doc, 'game')
    const status = doc.getElementById('game-status')
    if (status) status.textContent = 'Game starting... (placeholder)'
  })
  doc.querySelector('[data-action="options"]').addEventListener('click', () => showView(doc, 'options'))
  doc.querySelector('[data-action="highscores"]').addEventListener('click', async () => {
    showView(doc, 'highscores')
    await renderHighScores(doc, provider)
  })
  doc.querySelector('[data-action="help"]').addEventListener('click', () => showView(doc, 'help'))
  doc.querySelector('[data-action="exit"]').addEventListener('click', () => {
    // In a web app, Exit can act as Back to Menu or close; we'll show a simple back behavior
    showView(doc, 'menu')
  })

  // Back buttons
  doc.querySelectorAll('.back-button').forEach(btn => btn.addEventListener('click', () => showView(doc, 'menu')))
  const backOpt = doc.getElementById('btn-back-options')
  if (backOpt) backOpt.addEventListener('click', () => showView(doc, 'menu'))

  // Options load
  const opts = loadOptions()
  const chkSound = doc.getElementById('opt-sound')
  const selDiff = doc.getElementById('opt-difficulty')
  if (chkSound) chkSound.checked = !!opts.sound
  if (selDiff) selDiff.value = opts.difficulty || 'Normal'

  // Options save
  const form = doc.getElementById('options-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const newOpts = {
      sound: chkSound?.checked ?? true,
      difficulty: selDiff?.value ?? 'Normal'
    }
    saveOptions(newOpts)
    showView(doc, 'menu')
  })
}
