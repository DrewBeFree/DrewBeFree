const PATTERNS = [
  [200],
  [200, 100, 200],
  [200, 100, 200, 100, 200],
  [400, 100, 400, 100, 400, 100, 400],
]

export function vibrate(level) {
  if (!navigator.vibrate) return
  navigator.vibrate(PATTERNS[Math.min(level, 3)])
}
