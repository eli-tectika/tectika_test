import { initApp } from './ui/app.js'

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp(document))
} else {
  initApp(document)
}
