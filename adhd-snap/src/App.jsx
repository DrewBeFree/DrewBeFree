import { useState, useEffect } from 'react'
import CaptureOverlay from './components/CaptureOverlay'
import AlertOverlay from './components/AlertOverlay'
import ReminderList from './components/ReminderList'
import { useShakeDetector } from './hooks/useShakeDetector'
import { useReminders } from './hooks/useReminders'

export default function App() {
  const [capturing, setCapturing] = useState(false)
  const { reminders, addReminder, dismissReminder, activeAlert } = useReminders()
  const { needsPermission, requestPermission } = useShakeDetector(() => {
    if (!capturing && !activeAlert) setCapturing(true)
  })

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const activeCount = reminders.filter((r) => !r.done).length

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">SNAP</h1>
        <p className="tagline">
          {activeCount > 0
            ? `${activeCount} pending`
            : 'shake to capture'}
        </p>
      </header>

      {needsPermission && (
        <button className="motion-banner" onClick={requestPermission}>
          Tap to enable shake detection
        </button>
      )}

      <main>
        <ReminderList reminders={reminders} onDismiss={dismissReminder} />
      </main>

      <button
        className="capture-fab"
        onClick={() => setCapturing(true)}
        aria-label="Add reminder"
      >
        +
      </button>

      {capturing && (
        <CaptureOverlay
          onCapture={(text) => {
            addReminder(text)
            setCapturing(false)
          }}
          onClose={() => setCapturing(false)}
        />
      )}

      {activeAlert && (
        <AlertOverlay
          reminder={activeAlert}
          onDismiss={() => dismissReminder(activeAlert.id)}
        />
      )}
    </div>
  )
}
