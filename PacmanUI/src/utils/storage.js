const OPTIONS_KEY = 'pacmanOptions'
const CONFIG_KEY = 'pacmanConfig'

export function loadOptions() {
  try {
    const raw = localStorage.getItem(OPTIONS_KEY)
    return raw ? JSON.parse(raw) : { sound: true, difficulty: 'Normal' }
  } catch {
    return { sound: true, difficulty: 'Normal' }
  }
}

export function saveOptions(opts) {
  localStorage.setItem(OPTIONS_KEY, JSON.stringify(opts))
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : { apiBaseUrl: '' }
  } catch {
    return { apiBaseUrl: '' }
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}
