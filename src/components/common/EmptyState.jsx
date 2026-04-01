import { Inbox } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ title = 'No data yet', message, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Inbox size={40} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction} style={{ marginTop: '1rem' }}>
          {action}
        </button>
      )}
    </div>
  );
}
