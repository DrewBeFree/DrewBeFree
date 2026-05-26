let ctx = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function primeAudio() {
  getCtx()
}

function tone(freq, startOffset, duration, gain, type = 'sine') {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g)
  g.connect(c.destination)
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime + startOffset)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startOffset + duration)
  osc.start(c.currentTime + startOffset)
  osc.stop(c.currentTime + startOffset + duration + 0.05)
}

// level 0 → soft bell
// level 1 → double beep
// level 2 → triple alarm
// level 3+ → sweeping siren
export function playAlert(level) {
  try {
    if (level === 0) {
      tone(523, 0, 0.6, 0.3, 'sine')
    } else if (level === 1) {
      tone(880, 0, 0.2, 0.5, 'square')
      tone(880, 0.35, 0.2, 0.5, 'square')
    } else if (level === 2) {
      tone(1100, 0, 0.15, 0.7, 'square')
      tone(1100, 0.25, 0.15, 0.7, 'square')
      tone(1100, 0.5, 0.15, 0.7, 'square')
    } else {
      const c = getCtx()
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.connect(g)
      g.connect(c.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(600, c.currentTime)
      osc.frequency.linearRampToValueAtTime(1400, c.currentTime + 0.4)
      osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.8)
      osc.frequency.linearRampToValueAtTime(1400, c.currentTime + 1.2)
      g.gain.setValueAtTime(0.9, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.3)
      osc.start(c.currentTime)
      osc.stop(c.currentTime + 1.4)
    }
  } catch {
    // AudioContext unavailable — silent fail
  }
}
