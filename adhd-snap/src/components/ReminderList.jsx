import { formatAge } from '../utils/time'

export default function ReminderList({ reminders, onDismiss }) {
  const active = reminders.filter((r) => !r.done)

  if (!active.length) {
    return (
      <div className="empty-state">
        <p className="empty-icon">✓</p>
        <p className="empty-text">all clear</p>
        <p className="empty-sub">shake to capture a thought</p>
      </div>
    )
  }

  return (
    <ul className="reminder-list">
      {active.map((r) => (
        <ReminderItem key={r.id} reminder={r} onDismiss={onDismiss} />
      ))}
    </ul>
  )
}

function ReminderItem({ reminder, onDismiss }) {
  const level = Math.min(reminder.pingCount, 3)

  return (
    <li className={`reminder-item level-${level}`}>
      <div className="reminder-content">
        <span className="reminder-text">{reminder.text}</span>
        <span className="reminder-meta">
          {formatAge(reminder.createdAt)}
          {reminder.pingCount > 0 && (
            <span className="reminder-pings"> · pinged {reminder.pingCount}×</span>
          )}
        </span>
      </div>
      <button className="done-btn" onClick={() => onDismiss(reminder.id)}>
        DONE
      </button>
    </li>
  )
}
