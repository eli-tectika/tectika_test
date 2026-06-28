import { loadConfig } from './storage.js'

const STUB_SCORES = [
  { name: 'AAA', score: 12000 },
  { name: 'BBB', score: 8000 },
  { name: 'PAC', score: 16000 }
]

export class DataProvider {
  constructor(fetchImpl) {
    this.fetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null)
  }

  async getHighScores() {
    const cfg = loadConfig()
    const apiBase = cfg?.apiBaseUrl?.trim()

    // Try backend first if configured
    if (apiBase && this.fetch) {
      try {
        const res = await this.fetch(`${apiBase.replace(/\/$/, '')}/highscores`)
        if (res.ok) return await res.json()
      } catch {
        // fall through to stub
      }
    }

    // Fallback: static file
    if (this.fetch) {
      try {
        const res = await this.fetch('/highscores.json')
        if (res.ok) return await res.json()
      } catch {
        // fall through to in-memory stub
      }
    }

    // Final fallback: in-memory stub
    return STUB_SCORES
  }
}
