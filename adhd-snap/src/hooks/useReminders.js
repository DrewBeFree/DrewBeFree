import { useState, useEffect, useRef, useCallback } from 'react'
import { playAlert } from '../utils/audio'
import { vibrate } from '../utils/vibration'

const STORAGE_KEY = 'adhd-snap-reminders'
const CHECK_INTERVAL = 5000 // check every 5 seconds

// How long to wait before each escalating ping
function nextDelay(pingCount) {
  if (pingCount === 0) return 5 * 60 * 1000   // 5 min
  if (pingCount === 1) return 3 * 60 * 1000   // 3 min
  if (pingCount === 2) return 2 * 60 * 1000   // 2 min
  return 60 * 1000                              // 1 min
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function useReminders() {
  const [reminders, setReminders] = useState(load)
  const [activeAlert, setActiveAlert] = useState(null)
  const remindersRef = useRef(reminders)

  useEffect(() => {
    remindersRef.current = reminders
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  // Notification tap → show in-app overlay
  useEffect(() => {
    const handler = (e) => setActiveAlert(e.detail)
    window.addEventListener('snap:alert', handler)
    return () => window.removeEventListener('snap:alert', handler)
  }, [])

  const addReminder = useCallback((text) => {
    const now = Date.now()
    setReminders((prev) => [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        createdAt: now,
        pingCount: 0,
        nextPingAt: now + nextDelay(0),
        done: false,
      },
      ...prev,
    ])
  }, [])

  const dismissReminder = useCallback((id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: true } : r))
    )
    setActiveAlert((prev) => (prev?.id === id ? null : prev))
  }, [])

  // Escalation engine — runs every CHECK_INTERVAL ms
  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const due = remindersRef.current.filter(
        (r) => !r.done && r.nextPingAt <= now
      )
      if (!due.length) return

      // Process the oldest due reminder first
      const reminder = due.reduce((a, b) => (a.nextPingAt < b.nextPingAt ? a : b))
      const level = Math.min(reminder.pingCount, 3)

      // Advance the reminder's schedule
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminder.id
            ? {
                ...r,
                pingCount: r.pingCount + 1,
                nextPingAt: now + nextDelay(r.pingCount + 1),
              }
            : r
        )
      )

      playAlert(level)
      vibrate(level)

      if (document.visibilityState === 'visible') {
        setActiveAlert({ ...reminder })
      } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const n = new Notification('ADHD Snap', {
          body: reminder.text.toUpperCase(),
          requireInteraction: true,
          tag: reminder.id,
          silent: false,
        })
        n.onclick = () => {
          window.focus()
          window.dispatchEvent(new CustomEvent('snap:alert', { detail: reminder }))
          n.close()
        }
      }
    }

    const id = setInterval(tick, CHECK_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return { reminders, addReminder, dismissReminder, activeAlert }
}
