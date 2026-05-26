import { useState, useRef, useEffect } from 'react'
import { primeAudio } from '../utils/audio'

export default function CaptureOverlay({ onCapture, onClose }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    // Small delay so the animation starts before the keyboard pops
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    primeAudio() // unlock AudioContext on user gesture
    onCapture(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="capture-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="capture-card">
        <p className="capture-hint">what do you need to do?</p>
        <input
          ref={inputRef}
          className="capture-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="close garage..."
          maxLength={32}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          enterKeyHint="done"
        />
        <p className="capture-tip">1–3 words • be blunt</p>
        <div className="capture-actions">
          <button className="cancel-btn" onClick={onClose}>
            cancel
          </button>
          <button className="set-btn" onClick={submit} disabled={!text.trim()}>
            SET
          </button>
        </div>
      </div>
    </div>
  )
}
