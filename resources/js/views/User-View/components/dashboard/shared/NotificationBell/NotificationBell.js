import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../../../../api/notificationsApi';
import './NotificationBell.scss';

const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/** Candidate notification bell (application stage updates). */
export default function NotificationBell({ pollIntervalMs = 60000, variant = 'user' }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  const refreshCount = useCallback(async () => {
    try {
      const count = await fetchUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // ignore when logged out or offline
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNotifications();
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refreshCount, pollIntervalMs]);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, loadNotifications]);

  useEffect(() => {
    if (!open) return undefined;

    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(id);
    } catch {
      refreshCount();
    }
  };

  const handleMarkAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      refreshCount();
    }
  };

  const handleItemClick = (notification) => {
    handleMarkRead(notification.id);
    if (notification.action_url) {
      setOpen(false);
      navigate(notification.action_url);
    }
  };

  const rootClass = [
    'notif-bell',
    variant === 'user' && 'notif-bell--user',
    variant === 'dashboard' && 'notif-bell--dashboard',
    variant === 'sidebar' && 'notif-bell--sidebar',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass} ref={dropRef}>
      <button
        type="button"
        className="notif-bell__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notif-bell__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-bell__dropdown" role="dialog" aria-label="Notifications">
          <div className="notif-bell__head">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button type="button" className="notif-bell__mark-all" onClick={handleMarkAll}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-bell__list">
            {loading && notifications.length === 0 && (
              <p className="notif-bell__empty">Loading…</p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="notif-bell__empty">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`notif-bell__item${n.read ? '' : ' notif-bell__item--unread'}`}
                onClick={() => handleItemClick(n)}
              >
                <span className="notif-bell__icon">{n.icon}</span>
                <div className="notif-bell__body">
                  <strong>{n.title}</strong>
                  <p>{n.text || n.message}</p>
                  <span>{n.time}</span>
                </div>
                {!n.read && <span className="notif-bell__dot" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
