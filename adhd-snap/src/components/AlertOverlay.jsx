import { formatAge } from '../utils/time'

const BADGES = ['reminder', '!', '!!', '!!!']

export default function AlertOverlay({ reminder, onDismiss }) {
  const level = Math.min(reminder.pingCount, 3)

  return (
    <div className={`alert-overlay level-${level}`}>
      <div className="alert-inner">
        <p className="alert-badge">{BADGES[level]}</p>
        <p className="alert-text">{reminder.text}</p>
        <p className="alert-age">{formatAge(reminder.createdAt)}</p>
        <button className="alert-done" onClick={onDismiss}>
          DONE
        </button>
      </div>
    </div>
  )
}
