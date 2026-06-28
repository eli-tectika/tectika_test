import { beforeEach } from 'vitest'

beforeEach(() => {
  // Ensure a clean DOM and localStorage between tests
  document.body.innerHTML = ''
  localStorage.clear()
})
